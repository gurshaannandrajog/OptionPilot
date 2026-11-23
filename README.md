# OptionPilot — BTC Options Calculator

Private, local-first React + TypeScript workbench for hypothetical BTC option scenarios. It includes expected move, European Black–Scholes price/Greeks, independent TP/SL repricing, manual Greek estimates, user-configurable costs, position sizing, INR display conversion, and locally saved/importable plans.

> Decision support only. There is no live quote, broker connection, order placement, prediction or fill guarantee. CoinDCX contract conventions and fee schedules are not assumed.

## Requirements

- Node.js **20.19+** (or 22.12+), npm 10+.
- No API key, backend, AI account or environment variables.

## Run on Windows 11 / VS Code

```powershell
cd optionpilot
npm install
npm run dev
```

Open the local URL printed by Vite. If PowerShell blocks `npm.ps1`, run `npm.cmd install` and `npm.cmd run dev`, or use Command Prompt. This avoids changing the machine's script execution policy.

## Verify and build

Last verified on 22 November 2026 with `npm ci` (Node v24.22.3 / npm 11.19.1): **17 tests passed**, `tsc -b && vite build` succeeded, and `npm audit` reported **0 vulnerabilities**. The build generated `dist/`. A visual 360px/1440px browser check could not be completed because the browser environment could not connect to the local preview server; responsive breakpoints are implemented, but this viewport acceptance check remains open.

```bash
npm test
npm run build
npm run preview
```

`npm test` runs deterministic Vitest unit tests. `npm run build` runs TypeScript project checks before creating static assets in `dist/`.

## GitHub and Cloudflare Pages

The supplied workspace did not contain an existing Git checkout or a configured remote. To create a GitHub source repository and push this project, create an empty repository in your account, then from this folder:

```bash
git init -b main
git add .
git commit -m "Build OptionPilot Iteration 1"
git remote add origin https://github.com/YOUR-USER/YOUR-REPOSITORY.git
git push -u origin main
```

Then connect the repository to Cloudflare Pages with build command `npm run build` and output directory `dist`. There are no production secrets or environment variables. Detailed deployment and rollback steps are in [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## Features

- Call and put input with spot, strike, observed premium, IV, ATM IV, time to expiry, rates/carry, multiplier and lot size.
- Expected move bands at 1σ/2σ/3σ for 68.27%/95.45%/99.73% normal terminal coverage.
- Black–Scholes entry/exit and model Greeks, plus manually entered second-order Greek TP/SL estimates.
- Separate BTC TP and SL levels, elapsed times and IV changes; comparison of raw theoretical, entry-calibrated, Greek and simulated exit premiums.
- Simulated spread/slippage adjustment, per-side percentage/fixed fees, net P&L/ROI, reward/risk, premium loss trigger, maximum premium risk and whole-lot sizing.
- INR equivalents from a manual USD/INR rate; all core pricing remains in USD.
- Browser-local draft and named scenario storage; versioned JSON import/export; copyable result summary; clear local data control.
- Responsive dark dashboard with inline validation and model limitations.

## Known limitations

- No market feed or executable order-book data; exit adjustment is only a user-entered simulation.
- No exact expiry date/time input yet; time is remaining hours. Verify exchange timezone/settlement details before relying on expiry scenarios.
- Black–Scholes is a European-style approximation. CoinDCX underlying, exercise style, multiplier, settlement currency, Greek units, fee basis, and premium denomination need independent verification.
- Entry calibration adds a constant premium offset; it does not fit IV or the volatility surface.
- Symmetric normal expected-move intervals may be poor for large BTC moves. They represent terminal ranges, not touch probabilities or directional forecasts.
- Fixed input Greeks are a local approximation; cross-terms and changing Greeks are omitted. Treat near-expiry/large-move discrepancies as a warning.
- The risk sizing output is only as reliable as the entered stop, costs and contract specs. Long options can lose premium plus fees.
- USD/INR is display-only and manually entered.

## Documentation

- [`docs/SRS.md`](docs/SRS.md): scope, workflow, requirement mapping and acceptance coverage.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): code structure, formulas, units and assumptions.
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md): Cloudflare Pages and rollback workflow.
- [`CHANGELOG.md`](CHANGELOG.md): Iteration 1 delivery notes.
