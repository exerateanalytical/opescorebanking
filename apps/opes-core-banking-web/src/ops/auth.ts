/**
 * Public OIDC Authorization Code + PKCE.
 * Access tokens are kept in React memory only. No client secret or customer bank
 * data is stored in localStorage or sessionStorage.
 */
export type LoginToken={accessToken:string; expiresAt:number};
export type Config={
 bankId:string;clientId:string;issuer:string;authorizationUrl:string;tokenUrl:string;
 redirectUrl:string;apiBase:string
};
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
function configError(message:string):never{throw new Error("OPES identity configuration: "+message)}
function sameOriginOrHttps(url:string){
 try{const parsed=new URL(url,window.location.origin);
  if(parsed.protocol!=="https:"&&parsed.hostname!=="localhost"&&parsed.hostname!=="127.0.0.1")
   configError("TLS is required");
  return parsed.href;
 }catch{ return configError("Invalid authentication URL");}
}
export function configuration():Config|null{
 const issuer=import.meta.env.VITE_OPES_OIDC_ISSUER as string|undefined;
 const clientId=import.meta.env.VITE_OPES_OIDC_CLIENT_ID as string|undefined;
 const auth=import.meta.env.VITE_OPES_OIDC_AUTHORIZE_URL as string|undefined;
 const token=import.meta.env.VITE_OPES_OIDC_TOKEN_URL as string|undefined;
 const bankId=import.meta.env.VITE_OPES_BANK_ID as string|undefined;
 if(!issuer||!clientId||!auth||!token||!bankId)return null;
 if(!uuid.test(bankId))configError("Invalid institution UUID");
 if(!issuer.startsWith("https://")&&!issuer.startsWith("http://localhost"))
  configError("Trusted issuer must use TLS");
 const api=import.meta.env.VITE_OPES_API_BASE as string|undefined;
 const apiBase=api?sameOriginOrHttps(api).replace(/\/$/,""):"";
 const redirectUrl=window.location.origin+"/auth/callback";
 return {bankId,clientId,issuer,authorizationUrl:sameOriginOrHttps(auth),
         tokenUrl:sameOriginOrHttps(token),redirectUrl,apiBase};
}
const base64url=(bytes:Uint8Array)=>{
 let binary="";bytes.forEach(b=>binary+=String.fromCharCode(b));
 return btoa(binary).replaceAll("+","-").replaceAll("/","_").replaceAll("=","");
};
function randomBase64(){const random=new Uint8Array(32);crypto.getRandomValues(random);return base64url(random)}
export async function startLogin(config:Config):Promise<void>{
 const verifier=randomBase64(),state=randomBase64(),nonce=randomBase64();
 const digest=new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(verifier)));
 const challenge=base64url(digest);
 sessionStorage.setItem("opes_banking_pkce_v1",JSON.stringify({
  verifier,state,nonce,createdAt:Date.now()}));
 const url=new URL(config.authorizationUrl);
 url.searchParams.set("response_type","code");url.searchParams.set("client_id",config.clientId);
 url.searchParams.set("redirect_uri",config.redirectUrl);
 url.searchParams.set("scope","openid profile");
 url.searchParams.set("state",state);url.searchParams.set("nonce",nonce);
 url.searchParams.set("code_challenge_method","S256");url.searchParams.set("code_challenge",challenge);
 window.location.assign(url.toString());
}
export async function completeLogin(config:Config):Promise<LoginToken>{
 const parameters=new URLSearchParams(window.location.search);
 if(parameters.has("error"))throw new Error("Identity provider rejected sign-in");
 const code=parameters.get("code"),state=parameters.get("state");
 const raw=sessionStorage.getItem("opes_banking_pkce_v1");
 sessionStorage.removeItem("opes_banking_pkce_v1");
 if(!code||!state||!raw)throw new Error("Missing or expired sign-in state");
 const saved=JSON.parse(raw) as {verifier:string;state:string;nonce:string;createdAt:number};
 if(state!==saved.state||Date.now()-saved.createdAt>600000||saved.createdAt>Date.now())
  throw new Error("Invalid sign-in state");
 const form=new URLSearchParams({grant_type:"authorization_code",code,client_id:config.clientId,
    code_verifier:saved.verifier,redirect_uri:config.redirectUrl});
 const response=await fetch(config.tokenUrl,{
  method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},
  body:form,cache:"no-store",credentials:"omit"});
 if(!response.ok)throw new Error("OIDC token exchange was rejected");
 const data=await response.json() as {
  access_token?:string;token_type?:string;expires_in?:number
 };
 if(!data.access_token||data.token_type?.toLowerCase()!=="bearer"||
    typeof data.expires_in!=="number"||data.expires_in<1)
  throw new Error("OIDC token response is incomplete");
 window.history.replaceState(null,"","/operations");
 return {accessToken:data.access_token,expiresAt:Date.now()+Math.min(data.expires_in,3600)*1000};
}
