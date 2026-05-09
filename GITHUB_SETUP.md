# GitHub Setup — candidates-api

Steps to publish this repo to GitHub under `luigi-basantes` as a **private** repository.

## Prerequisites

- `gh` CLI installed and authenticated (`gh auth status`)
- You're in the project root: `/Users/koukin/Documents/Jelou/BackEnd/candidates-api`

## Steps

### 1. Initialize the local repo

```bash
git init -b main
```

### 2. Stage files and verify

```bash
git add .
git status
```

Confirm `.env` is **NOT** in the staged list. Your `.gitignore` already excludes:
- `node_modules`
- `.env`
- `.vscode`
- `*.log`
- `.DS_Store`

If `.env` shows up staged, run:

```bash
git rm --cached .env
```

### 3. First commit

```bash
git commit -m "Initial commit: candidates-api"
```

### 4. Create the GitHub repo and push

```bash
gh repo create candidates-api --private --source=. --remote=origin --push
```

Flags:
- `--private` — only you can see it
- `--source=.` — use current directory
- `--remote=origin` — set remote name
- `--push` — push `main` immediately

The repo will be live at: `https://github.com/luigi-basantes/candidates-api`

## Sanity checks before committing

- Glance at `fly.toml` — if it contains secrets (tokens, DB URIs, API keys), move them to Fly secrets first:

  ```bash
  fly secrets set KEY=value
  ```

- Double-check `.env` isn't tracked.

## Post-push (optional)

```bash
# Add a repo description
gh repo edit --description "Candidates API backend"

# Open the repo in your browser
gh repo view --web

# Enable auto-delete of merged branches
gh repo edit --delete-branch-on-merge
```

## Branch protection (optional, recommended)

Once you have at least one collaborator or want to enforce PR reviews:

```bash
gh api -X PUT repos/luigi-basantes/candidates-api/branches/main/protection \
  -f required_pull_request_reviews.required_approving_review_count=1
```

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `.env` got committed | `git rm --cached .env && git commit -m "Remove .env"` then rotate any leaked secrets |
| `gh: command not found` | Install: `brew install gh` |
| `gh auth status` shows logged out | Run `gh auth login` |
| Repo name already exists | Pick a new name or delete the old one: `gh repo delete luigi-basantes/candidates-api` |
