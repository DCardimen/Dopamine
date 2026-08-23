# Goal 03 deployment

Public playtest: https://dopamine-playtest.vercel.app/?v=goal3-11

Production deployment: `dpl_8VxmaPHeC2CZuJZ8mCHt14WQ22vZ`

Runtime pins:
- Goal 02 v1.2 baseline: `f8835df56101a93e4d87fa498d17cee228fe292e`
- Goal 03 skill runtime: `f0012e1f7ddd5aa51810cb4bbf233f709541b509`

The Vercel shell fetches the pinned Goal 02 HTML from jsDelivr, rewrites its four relative runtime script URLs to the same pinned CDN directory, and injects the pinned Goal 03 runtime before boot. This avoids dependence on protected immutable Vercel deployment URLs while preserving deterministic rollback pins.
