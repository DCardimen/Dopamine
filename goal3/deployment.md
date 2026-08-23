# Goal 03 deployment

Public playtest: https://dopamine-playtest.vercel.app/?v=goal3-12

Production deployment: `dpl_2cF6BxM8USHHaQ1xMgVr4KLi6tmZ`

Runtime pins:
- Goal 02 v1.2 baseline: `f8835df56101a93e4d87fa498d17cee228fe292e`
- Goal 03 v1.2 tested runtime stack: `7bfc3dc1445d61234fe099f1261c55178fe1ae57`

Injected Goal 03 stack, in order:
1. `legacy-compat.js`
2. `skills.js`
3. `runtime-fixes.js`
4. `progression.js`
5. `brain-sync.js`
6. `polish.js`
7. `progression-quality.js`
8. `quality-v2.js`

The production shell fetches the immutable Goal 02 v1.2 HTML from jsDelivr, rewrites its four runtime script URLs to the same pinned CDN commit, then injects the tested Goal 03 v1.2 stack from one exact Git commit. The main `dopamine-playtest.vercel.app` alias points at this production deployment.

Goal 03 v1.2 requires both the local Chrome quality gate and the public-Vercel browser gate, including a 3,600-second skill-progression soak with no genuine 91-second combat stalls.
