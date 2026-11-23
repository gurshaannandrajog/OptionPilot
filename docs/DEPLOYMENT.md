# Deployment and release guide

## Cloudflare Pages via GitHub

1. Push this project to a GitHub repository you control (private is suitable).
2. In Cloudflare, create a Pages project connected to that repository.
3. Set framework preset to **Vite**, build command to `npm run build`, and output directory to `dist`. No environment variables are required.
4. Deploy the production branch. Cloudflare creates preview deployments for other branches/PRs.
5. Verify desktop and 360px mobile layouts, run the deployed URL on a phone, then retain the previous successful deployment as the rollback point.
6. To roll back, use Cloudflare Pages deployment history and select **Rollback** on the last known-good production deployment. Reverting the Git commit and pushing is the auditable source rollback.

No ChatGPT Sites deployment is used. Static output has no server-side runtime and needs no AI service.

## Versioned release

After review, create an annotated tag, for example `git tag -a v1.0.0 -m "OptionPilot Iteration 1"`, then `git push origin v1.0.0`. Do not tag until the actual repository owner has reviewed the contract assumptions and release.
