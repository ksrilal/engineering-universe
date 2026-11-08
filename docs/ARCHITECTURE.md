# Engineering Universe — architecture v0.1

## Boundaries
- `src/core/knowledge`: pure typed concept and relationship model; indexing, search, neighbor traversal and validation.
- `src/core/simulation`: deterministic, UI-independent timeline engine and definitions.
- `src/components/ui`: shared accessible primitives.
- `src/components/simulation`: interactive rendering of engine state.
- `src/data`: current prototype graph; to be migrated to the typed knowledge graph without breaking the homepage.
- `src/app`: Next.js routes, composition and metadata.

## Rules
1. Core modules must not import React, Next.js or browser APIs.
2. Visualizations consume snapshots; they must not invent simulation events.
3. Each relationship has explicit direction and semantics.
4. Protocol paths must identify assumptions (e.g. HTTP/2 over TCP vs HTTP/3 over QUIC).
5. No credentials in source or deployment logs.
6. Concept content must be reviewable and versioned.
7. Use automated validation and test gates before production release.

## Follow-up
- Replace prototype concept data with typed content loader and graph adapter.
- Add accessible 2D graph mode and reduced-motion behavior.
- Add engine unit tests and content validation.
- Add scenario controls, event playback, fault injection and diagrams.
- Add learning paths, lab interface, and persistence behind defined ports.
