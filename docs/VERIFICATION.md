# Verification record — Iteration 1

Date: 22 November 2026. Environment: Node v24.22.3, npm 11.19.1, Linux.

| Check | Result |
|---|---|
| `npm ci` | Passed; installed 73 packages from the committed lockfile |
| `npm test` | Passed; 1 test file, 17 tests |
| `npm run build` | Passed; TypeScript project check and Vite production bundle completed |
| `npm audit` | Passed; 0 vulnerabilities reported |
| Expected move AT-01 | Passed; $90,000, 55% IV, 2 hours gives approximately $748.4, with $89,251.6–$90,748.4 1σ bounds |
| Greek TP AT-02 | Passed; exit estimate $858.50, premium ROI 43.0833% before costs |
| Greek SL AT-03 | Passed; exit estimate $452.50, premium ROI −24.5833% before costs |
| Expiry, zero IV, put-call parity AT-04–07 | Passed in unit tests |
| Invalid values/imports, lots, multiplier, storage AT-08–12 | Passed in unit tests |
| 360px and 1440px rendered overflow AT-14 | Not verified: local Chromium could not start in the sandbox and the browser preview could not connect to the environment's localhost server. Responsive breakpoints are present, but this needs a real-browser check. |
| Deployment AT-15 | Static production assets built. No deployment performed because there was no configured GitHub repository/Cloudflare Pages project. |
| Invalid Greek premium warning AT-17 | Covered by UI warning logic; negative-output cases are surfaced as invalid estimates. |

The npm command emitted an environment warning about its `http-proxy` setting; dependency installation, tests, build and audit still completed successfully.
