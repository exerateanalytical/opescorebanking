package com.opesware.banking.security;

import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.security.oauth2.jwt.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfiguration {
    @Bean
    SecurityFilterChain apiSecurity(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(req -> req
                .requestMatchers(HttpMethod.GET, "/actuator/health", "/actuator/health/**").permitAll()
                .anyRequest().authenticated())
            .oauth2ResourceServer(o -> o.jwt(Customizer.withDefaults()))
            .build();
    }

    @Bean
    JwtDecoder jwtDecoder(
        @Value("${OPES_OIDC_ISSUER}") String issuer,
        @Value("${OPES_OIDC_JWKS_URI}") String jwks,
        @Value("${OPES_OIDC_AUDIENCE}") String audience
    ) {
        if (!issuer.startsWith("https://") || !jwks.startsWith("https://")
            || audience.isBlank() || issuer.contains("example.invalid") || jwks.contains("example.invalid")) {
            throw new IllegalStateException("Trusted OIDC configuration required");
        }
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withJwkSetUri(jwks)
            .jwsAlgorithm(SignatureAlgorithm.RS256)
            .jwsAlgorithm(SignatureAlgorithm.ES256)
            .build();
        OAuth2TokenValidator<Jwt> iss = JwtValidators.createDefaultWithIssuer(issuer);
        OAuth2TokenValidator<Jwt> aud = jwt -> {
            if (jwt.getAudience() != null && jwt.getAudience().contains(audience)) {
                return OAuth2TokenValidatorResult.success();
            }
            return OAuth2TokenValidatorResult.failure(
                new OAuth2Error("invalid_token", "Wrong audience", null));
        };
        decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(List.of(iss, aud)));
        return decoder;
    }
}
