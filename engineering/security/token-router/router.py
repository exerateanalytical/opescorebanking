"""Pinned-JWKS access-token and bank-routing security foundation.

No production HTTP gateway, live credentials, KMS or broker is implemented here.
The route is granted only when both cryptographically verified token claims AND
authoritative server-side membership match the requested institution.
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
import json
import re
from types import MappingProxyType
from typing import Mapping
from uuid import UUID

import jwt
from jwt.algorithms import RSAAlgorithm

class AccessDenied(Exception):
    """No fallback-to-default-tenant behavior is ever allowed."""

@dataclass(frozen=True)
class PinnedIssuer:
    issuer: str
    audience: str
    jwks: Mapping[str,dict]
    max_token_lifetime_s: int = 300

@dataclass(frozen=True)
class Membership:
    institution_id: str
    issuer: str
    subject: str
    active: bool
    permissions: frozenset[str]
    revision: int

@dataclass(frozen=True)
class TenantRoute:
    institution_id: str
    database_principal: str
    issuer: str
    subject: str
    permission: str
    membership_revision: int
    token_jti: str

class PinnedBankRouter:
    """Trusted bank directory is local control-plane data, not request headers."""

    def __init__(self,issuer:PinnedIssuer,
                 memberships:Mapping[tuple[str,str,str],Membership],
                 principals:Mapping[str,str]):
        self.issuer=issuer
        self.memberships = {}
        for directory_key, member in memberships.items():
            if (not isinstance(directory_key, tuple) or len(directory_key) != 3
                    or not isinstance(member, Membership)):
                raise ValueError("membership directory requires (institution, issuer, subject) keys")
            institution, issuer, subject = directory_key
            if (not self._uuid(institution) or member.institution_id != institution
                    or member.issuer != issuer or member.subject != subject
                    or not isinstance(member.revision, int) or isinstance(member.revision, bool)
                    or member.revision < 1):
                raise ValueError("invalid bank-scoped membership directory entry")
            if directory_key in self.memberships:
                raise ValueError("duplicate membership directory entry")
            self.memberships[directory_key] = member
        self.principals=dict(principals)
        # Do not allow shared DB principals across distinct banks.
        if len(set(self.principals.values())) != len(self.principals):
            raise ValueError("bank database principals must be distinct")
        for tenant,principal in self.principals.items():
            if not self._uuid(tenant) or not re.fullmatch(r"[a-z][a-z0-9_]{2,63}",principal):
                raise ValueError("invalid trusted bank-principal directory")

    @staticmethod
    def _uuid(x):
        try:
            UUID(x)
            return True
        except (TypeError,ValueError,AttributeError):
            return False

    def authorize(self,token:str,institution_path_id:str,
                  permission:str,request_headers:Mapping[str,str]|None=None)->TenantRoute:
        if not self._uuid(institution_path_id):
            raise AccessDenied("invalid institution path")
        if not re.fullmatch(r"[a-z][a-z0-9.:_-]{3,100}",permission):
            raise AccessDenied("invalid permission")
        headers=request_headers or {}
        # Do not allow caller to shadow institution context via trusted-looking headers.
        if any(k.lower() in ("x-institution-id","x-bank-id","x-tenant-id","x-db-principal")
               for k in headers):
            raise AccessDenied("client-supplied trusted routing context forbidden")
        try:
            h=jwt.get_unverified_header(token)
        except jwt.PyJWTError as exc:
            raise AccessDenied("malformed token header") from exc
        if not isinstance(h,dict) or any(k in h for k in ("jku","x5u","x5c","jwk","crit")):
            raise AccessDenied("unsupported or remotely-sourced token keys")
        if h.get("alg")!="RS256" or h.get("typ")!="at+jwt":
            raise AccessDenied("algorithm/type confusion")
        kid=h.get("kid")
        if not isinstance(kid,str) or not re.fullmatch(r"[A-Za-z0-9._-]{1,64}",kid):
            raise AccessDenied("invalid key ID")
        jwk=self.issuer.jwks.get(kid)
        if not isinstance(jwk,dict) or jwk.get("kty")!="RSA" or jwk.get("alg")!="RS256":
            raise AccessDenied("unknown or incompatible pinned key")
        if jwk.get("use","sig")!="sig":
            raise AccessDenied("key not intended for signatures")
        try:
            key=RSAAlgorithm.from_jwk(json.dumps(jwk))
            claims=jwt.decode(
                token,key,algorithms=["RS256"],issuer=self.issuer.issuer,
                audience=self.issuer.audience,
                options={"require":["iss","aud","sub","exp","iat","nbf","jti"]},
                leeway=0
            )
        except (jwt.PyJWTError,ValueError,TypeError) as exc:
            raise AccessDenied("access token verification failed") from exc
        if not isinstance(claims,dict) or not isinstance(claims.get("sub"),str):
            raise AccessDenied("missing subject")
        if not isinstance(claims.get("jti"),str) or not self._uuid(claims["jti"]):
            raise AccessDenied("missing or invalid unique token identifier")
        if claims["exp"]-claims["iat"] > self.issuer.max_token_lifetime_s:
            raise AccessDenied("token lifetime exceeds configured maximum")
        token_scopes=claims.get("scope","")
        if not isinstance(token_scopes,str) or permission not in token_scopes.split():
            raise AccessDenied("token permission absent")
        # Token institution is *not* authority; it must match the server-held membership.
        member=self.memberships.get((institution_path_id,claims["iss"],claims["sub"]))
        if member is None or not member.active or member.revision<1:
            raise AccessDenied("unknown, disabled or stale subject membership")
        if member.issuer!=claims["iss"] or member.subject!=claims["sub"]:
            raise AccessDenied("server membership identity mismatch")
        if member.institution_id!=institution_path_id or not self._uuid(member.institution_id):
            raise AccessDenied("cross-bank path denied")
        if claims.get("institution_id",member.institution_id)!=member.institution_id:
            raise AccessDenied("token tenant claim conflicts with authoritative membership")
        if permission not in member.permissions:
            raise AccessDenied("membership does not authorize this operation")
        principal=self.principals.get(member.institution_id)
        if principal is None:
            raise AccessDenied("no dedicated bank principal configured")
        return TenantRoute(member.institution_id,principal,claims["iss"],claims["sub"],
                           permission,member.revision,claims["jti"])
