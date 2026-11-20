# Contributing to atomsenses-decoder

## Merge requests

1. Branch from and target the default branch (`main`).
2. The MR description pre-fills from the template in
   `.gitlab/merge_request_templates/Default.md` — fill in **What / Why**,
   **How tested** and **Screenshots / Logs**.
3. Keep every MR small and single-purpose; split larger work into stacked MRs.
4. Never commit secrets (tokens, passwords, private keys, real `.env` files).

## Label convention

| Label | Meaning | Who sets it |
| --- | --- | --- |
| `wip` | Work in progress — not ready for review | Author, at MR creation |
| `needs-review` | Complete, CI green, awaiting review | Author, when ready |
| `blocked` | Cannot proceed — waiting on a dependency, decision or review | Author, with a comment saying what it is blocked on |

Pushing new commits to an MR moves it back to `wip`; re-apply `needs-review`
when it is ready again.

## Reviewer checklist

- [ ] CI green on the MR (lint / test / build)
- [ ] Diff matches the stated What / Why — no unrelated changes
- [ ] No secrets or credentials in the diff
- [ ] Tests cover the behavior change, or the gap is acknowledged in the description
- [ ] Docs updated where behavior is user-visible
- [ ] Labels are correct; `wip` and `blocked` MRs are never merged
