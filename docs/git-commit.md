name: commit
description: Analyze changes and create a well-structured git commit with conventional commit message

# Git Commit

You are creating a git commit for the current changes.

## Steps

1. Run `git status` to see all changed/untracked files (never use -uall flag)
2. Run `git diff` and `git diff --staged` to understand what changed
3. Run `git log --oneline -5` to see recent commit style

## Commit Message Rules

- Use **Conventional Commits**: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`, `style:`, `perf:`
- First line: max 72 chars, imperative mood, lowercase after prefix
- If changes are complex, add a blank line and bullet-point body
- Match the language and style of recent commits in this repo
- Do NOT commit `.env`, credentials, or secrets - warn if detected
- Do NOT add "Coauthored by Claude" or other stuff

## Process

1. Analyze all changes and categorize them (new feature, bugfix, refactor, etc.)
2. Draft a commit message and show it to the user
3. Ask if they want to adjust the message or scope of staged files
4. Stage relevant files (prefer specific files over `git add .`)
5. Create the commit

## Important

- If there are unrelated changes, suggest splitting into multiple commits
- If nothing is changed, say so and stop
- Never force push or amend without explicit user request
