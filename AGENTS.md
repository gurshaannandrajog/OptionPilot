# Development rules

These rules apply to all work in the OptionPilot repository.

1. **Develop incrementally.** OptionPilot follows iterative and incremental software development. Always modify the existing application; never recreate the project from scratch.
2. **Preserve behavior and data.** Preserve existing calculator features, mathematical formulas, scenario storage, and user data compatibility unless a change is explicitly requested.
3. **Read project documentation first.** Before implementing substantial changes, read `README.md`, `docs/SRS.md`, `docs/ARCHITECTURE.md`, and `docs/RELEASE_PROCESS.md`.
4. **Keep responsibilities modular.** Keep financial calculations, validation, UI, risk management, and storage logic modular.
5. **Cover calculation and risk changes.** Add or update tests for changes affecting calculations or risk outputs.
6. **Verify before completion.** Before declaring work complete, run `npm test` and `npm run build`; report any failures.
7. **Use iteration branches.** Work on feature or iteration branches, never directly on `main`.
8. **Get explicit approval for release actions.** Do not create commits, push branches, merge pull requests, deploy, or publish releases without explicit approval.
9. **Preserve release history.** Do not alter existing Git tags or release history.
10. **Preserve author attribution.** For any explicitly approved local commit, use the repository's existing Git author identity. Do not add AI tool names to commit messages, release notes, or documentation unless technically required. Never falsify platform-generated attribution.
11. **Document material changes.** Document breaking changes, assumptions, and limitations.
12. **Propose release steps at iteration completion.** When an iteration is completed, propose a version bump, pull request, and tagged GitHub Release for rollback.
