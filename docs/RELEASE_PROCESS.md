# OptionPilot release and rollback process

OptionPilot is an incremental project: edit the existing checkout, rather than creating a new ZIP/project for every iteration.

## Existing stable baseline

- v1.0.0: released from commit `778cdf042ddf8cc737d4d102c132cdda5f9ea9d4`.
- Production branch: `main`.
- Cloudflare Pages deploys from `main`.

## Develop safely

```powershell
git switch main
git pull --ff-only origin main
git switch -c iteration-2
```

Edit with VS Code/Codex, run `npm test` and `npm run build`, then commit and push the feature branch. Create a pull request to `main`; the existing CI workflow verifies tests and build. Review its changes and preview before merging.

## Back up each completed iteration

For the next released iteration, bump the version number on its feature branch, including the lockfile:

```powershell
npm version 2.0.0 --no-git-tag-version
npm test
npm run build
git add package.json package-lock.json
git commit -m "Version OptionPilot 2.0.0"
```

Merge the completed pull request to `main`. The versioned-release GitHub Actions workflow runs when `package.json` changes on `main`. It verifies tests/build, creates the version tag (such as `v2.0.0`) and publishes a GitHub Release. GitHub provides a ZIP and tarball for the tagged source. It doesn't move an existing tag. You can also invoke this workflow manually from GitHub Actions.

Only completed releases require version bumps; daily development commits can remain on a feature branch.

## Rollback

- For an immediate website-only recovery, select an earlier eligible Cloudflare Pages production deployment and use Rollback. Retention limits can apply.
- For restoring the source code, create a new repair branch from the older Git tag (`git switch -c restore-v1 v1.0.0`), inspect what must be retained and open a pull request. Avoid rewriting shared `main` history.
- For independent backup protection, download each GitHub Release source ZIP and keep it outside GitHub (e.g. an external drive).

The production deployment and GitHub Release are separate: successful tagging doesn't itself guarantee a successful Cloudflare deployment. Verify both.
