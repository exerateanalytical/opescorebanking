# Production frontend full source-contract conversion

The Java 25 Spring Boot API and the React/TypeScript frontend are distinct codebases.

Previous migration imported only inventory identifiers. This increment also carries
**exact original source modules** in `build/source`, executed only by the
build-time `scripts/generate-manifests.mjs`, which outputs inert JSON consumed
by the TypeScript application:

- 726 per-screen UI blueprints, including field groups and disabled workflow stages
- 726 individually named form contracts, proposed validation/conditional rules
- 407 complete document-template field contracts, families and issuance blocks
- 378 report definitions, metrics, filters, source requirements and publication blocks

The build fails if counts, identifiers, or source acceptance flags drift.
No original Node.js source module is imported into the **browser** at runtime,
no fake banking fixture transactions are generated, and no source-approved claim
is introduced. Prototype JavaScript remains as **migration/build-time source**
until validated typed contracts have superseded every source-field rule.

**Not yet implemented:** Java server endpoints that serve these client fields
with institution-specific permissions, authenticated BFF sessions, legal document
issuance, authoritative report execution, production-ready bank screen flows.
The recovered visual layouts are not claimed pixel-identical to the prototypes.

Use `npm run generate`, then `npm run typecheck`, `npm test`, `npm run build`.
The npm pre-lifecycle hooks generate the exact source manifests automatically.
