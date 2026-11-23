# OptionPilot Iteration 1 — Requirements and acceptance trace

## Purpose and scope

OptionPilot is a private, responsive, browser-only BTC option scenario calculator. It accepts manual inputs and computes expected-move ranges, European Black–Scholes prices and Greeks, second-order Greek exits, simulated costs, P&L, reward/risk, loss caps and risk-budget sizing. It has no account, server, broker connection, market feed, predictive signal or order execution.

## User workflow

1. Choose a call or put and enter BTC spot, strike, observed premium, IV and hours to expiry.
2. Enter ATM IV and a horizon to view symmetric, terminal normal-price bands.
3. Enter exchange or model Greeks in the explicitly labeled units.
4. Configure separate BTC TP and SL, elapsed hours, and IV changes.
5. Compare raw model, entry-calibrated model, Greek approximation and simulated sale value.
6. Review estimated fees, net ROI/P&L, risk, whole-lot quantity and reward/risk.
7. Save locally or import/export a versioned JSON scenario.

## Requirements traceability

| Requirement group | Iteration 1 implementation |
|---|---|
| FR-01, 15 / responsive and accessible controls | Semantic sections, labeled numeric fields, keyboard-operable buttons, mobile CSS breakpoints, scrollable result table |
| FR-02–05 / contract, time, expected move, pricing | Call/put selection; manual spot/strike/entry premium/IV/rates/carry/multiplier/lot; remaining hours; Black–Scholes pricing and model Greeks |
| FR-06–08 / Greek and TP/SL | Per-unit Greek inputs and Taylor model; independent TP/SL spot, elapsed hours, IV change; side-by-side price, difference, P&L and ROI |
| FR-09–10 / loss cap, sizing, costs and FX | Separate premium stop and account risk percentages; costs per side; cash/risk/lot sizing; manually entered USD/INR display equivalents |
| FR-11 / local persistence | Draft auto-save, saved plan list, load, delete, clear, version 1 JSON import/export with schema checks |
| FR-12–14 / transparency and safety | Formula notes, units, calibration and simulated execution labels, validation errors, no live exchange/API/secret access |
| NFR-01–12 | Pure TypeScript math/risk modules, deterministic unit tests, local-only calculations, static Vite build, documented assumptions and limitations |

## Acceptance checks

The 17 Vitest assertions cover the expected-move fixture, expiry and zero-volatility pricing, put-call parity, Greek TP/SL fixtures, put direction, input/import validation, fee-aware lot sizing, multiplier/quantity math, local storage, and independent scenario inputs. The static build confirms AT-13 and static delivery capability supports AT-15. AT-14 visual checks at 360px and 1440px were attempted but blocked because the browser environment could not connect to the local preview server; this remains unverified. AT-16 is represented in distinct result labels and scenario caveats. Deployment was not performed because no GitHub remote or Cloudflare project was supplied. See README for actual command results.
