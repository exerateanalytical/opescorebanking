# OPES Core Banking React/TypeScript production frontend checkpoint

The new client targets React 19.3.1, TypeScript 7.0.2 and Vite 8.3.6; Java 25 + Spring Boot remains the production backend.

Migrated original data registries preserve 726 screen names/IDs, 407 document titles and 378 report definitions, with 726 screen-aligned form previews. All operational controls are explicitly disabled pending OIDC/BFF integration, institution permissions, authoritative bank data, legal issuance and regulatory approval. These are source-converted routes **not 726 production-complete screens or forms**.

Run Node 24+ `npm install && npm run typecheck && npm test && npm run build`. Shipping requires lockfile/SBOM, independent security/accessibility review and production backend integration.
