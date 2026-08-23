# Goal 03 deployment

Public playtest: https://dopamine-playtest.vercel.app/?v=goal3-13

Production deployment: `dpl_D81JrinHjj8vyHesUPh54E7MaPkV`

Runtime pins:
- Goal 02 v1.2 baseline: `f8835df56101a93e4d87fa498d17cee228fe292e`
- Goal 03 v1.3 tested runtime stack: `8b50476ded1ed25a57d71173ae586e2c4408921e`

Injected Goal 03 stack, in order:
1. `legacy-compat.js`
2. `skills.js`
3. `runtime-fixes.js`
4. `progression.js`
5. `brain-sync.js`
6. `polish.js`
7. `signoff.js`
8. `signoff-fixes.js`
9. `progression-quality.js`
10. `quality-v2.js`
11. `signoff-quality.js`

The production shell fetches the immutable Goal 02 v1.2 HTML from jsDelivr, rewrites its four runtime script URLs to the same pinned CDN commit, then injects the tested Goal 03 v1.3 stack from one exact Git commit. The main `dopamine-playtest.vercel.app` alias points at this production deployment.

Final signoff requires both local and public-production browser gates. The public v1.3 gate passed the core/component checks, final Skill Arsenal/UI checks, 30-minute fresh-account benchmark, six-build diversity matrix, one-hour skill soak, and three independent one-hour progression runs.

Public production signoff evidence: https://github.com/DCardimen/Dopamine/issues/4#issuecomment-5384136712
