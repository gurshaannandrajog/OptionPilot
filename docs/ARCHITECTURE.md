# Architecture and calculation design

## Runtime structure

- `src/domain`: scenario types, defaults and validation.
- `src/math`: standard normal CDF, expected move, Black–Scholes and Greek Taylor estimate. These are pure functions with no React, browser or network dependency.
- `src/risk`: composes pricing with fee, cost, P&L and sizing calculations.
- `src/storage`: local draft/saved-plan handling and versioned JSON validation.
- `src/App.tsx`: form state, scenario cards, result presentation and browser actions.
- `src/styles.css`: responsive dark dashboard; no chart, server, framework or remote font dependency.

The client is statically built by Vite. Inputs, outputs and saved scenarios stay in browser storage. Import is allowlisted to known fields and rejects unknown schema versions/invalid numeric values before use. There are no HTML injection APIs or secret fields.

## Math reference

Rates are continuously compounded annual percentages converted to decimals; IV percentages are converted to decimals only at the Black–Scholes boundary. Remaining time and elapsed scenario time are hours; year conversion is 365×24 hours. No calendar timezone ambiguity arises because this iteration uses remaining hours rather than an expiry timestamp.

Expected move:

`T = h / (365 × 24)`, `M = S × (ATM IV / 100) × sqrt(T)`.

Bands are symmetric normal-price ranges at z=1, 2, 3, corresponding to 68.27%, 95.45%, 99.73%. Lower bounds are clamped to zero. These are approximate terminal ranges, not path ranges, touch chances or forecasts.

Black–Scholes:

`d1 = (ln(S/K) + (r-q+σ²/2)T) / (σ√T)`, `d2 = d1 - σ√T`.

`C = S e^(-qT) N(d1) - K e^(-rT) N(d2)`; `P = K e^(-rT) N(-d2) - S e^(-qT) N(-d1)`.

At expiry use intrinsic payoff. At zero volatility use discounted deterministic forward intrinsic. The standard normal CDF uses Abramowitz–Stegun 7.1.26 (approximate max absolute error ~7.5e-8). The displayed Black–Scholes Greeks are: call/put delta; gamma per $1 BTC squared; vega per one IV percentage point (1% absolute IV); theta per calendar day. Theta is annual theta divided by 365.

Greek exit:

`P_exit ≈ P_entry + Δ·dS + 0.5·Γ·dS² + Vega_pp·dIV_pp + Theta_day·elapsed_days`.

It is a second-order local estimate and omits changing Greeks and cross terms. Negative output is surfaced as invalid for interpretation.

For each TP and SL, raw theoretical premium is repriced with scenario spot, IV and remaining hours. Entry-calibrated model premium is `raw exit + observed entry premium - raw model entry`, floored at zero. Simulated sale premium is `max(0, calibrated premium - exit adjustment)`. This is a hypothetical execution haircut, not a bid quote.

Per-contract net P&L is `(simulated exit - observed entry) × multiplier - entry fees - exit fees`. A percentage fee applies to premium cash per contract on each side; fixed fees are per contract per side. Quantity sizing floors both the risk-budget count and premium-capital count to whole configured lots. If modeled stop net P&L is nonnegative, stop-based sizing is undefined and reported as not inferable. Reward/risk is defined only for positive TP net profit and negative SL net P&L.

## Assumptions and open verification

- Model inputs are user-supplied and contract prices are per exposure unit; multiplier converts one exposure unit to contract premium cash.
- Black–Scholes assumes European exercise, lognormal underlying, constant IV/rates, and the entered carry. It may not describe CoinDCX BTC options without verifying spot/futures underlying, settlement currency, exercise, multiplier, quote conventions and basis.
- Fees, execution adjustment and USD/INR are user assumptions. No exchange fee is embedded.
- The entered remaining hours are a convenience; exact UTC expiry conversion is deferred until contract expiry conventions are verified.
