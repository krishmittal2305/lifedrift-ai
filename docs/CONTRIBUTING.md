# Contributing to LifeDrift OS

Thank you for your interest in contributing. LifeDrift OS is fully open source and welcomes contributions of all kinds — bug fixes, new features, documentation improvements, ML enhancements, and UI polish.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [How to Contribute](#how-to-contribute)
- [Branch Naming](#branch-naming)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Good First Issues](#good-first-issues)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Code Style](#code-style)

---

## Code of Conduct

Be respectful, constructive, and inclusive. Harassment of any kind will not be tolerated.

---

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/lifedrift-ai.git
   cd lifedrift-ai
   ```
3. Add the upstream remote:
   ```bash
   git remote add upstream https://github.com/krishmittal2305/lifedrift-ai.git
   ```

---

## Development Setup

### Frontend (Next.js)

```bash
cd lifedrift-os
npm install
npm run dev        # http://localhost:3000
```

### Backend (Flask)

```bash
# From the repo root
pip install -r requirements.txt
python backend.py  # http://localhost:5000
```

### Train the Model

```bash
python train_model.py
# Outputs lifedrift_model.pkl and scaler.pkl
```

### Streamlit Prototype

```bash
streamlit run app.py
```

---

## Project Structure

See [ARCHITECTURE.md](ARCHITECTURE.md) for a full breakdown.

Key directories:

| Path | Purpose |
|------|---------|
| `lifedrift-os/app/` | Next.js pages (App Router) |
| `lifedrift-os/components/` | React components |
| `lifedrift-os/api/index.py` | Python Flask serverless API |
| `lifedrift-os/store/` | Zustand state management |
| `lifedrift-os/lib/` | Utilities, constants, types |
| `backend.py` | Standalone Flask server |
| `train_model.py` | ML training pipeline |

---

## How to Contribute

### For a Bug Fix

1. Open (or find) an issue describing the bug
2. Create a branch: `fix/short-description`
3. Make your fix with a focused, minimal diff
4. Test your change locally
5. Submit a pull request referencing the issue

### For a New Feature

1. Open a Feature Request issue first to discuss the idea
2. Wait for maintainer approval before building
3. Create a branch: `feat/short-description`
4. Implement, test, and submit a PR

### For Documentation

1. Branch: `docs/short-description`
2. Edit the relevant file in `docs/` or `README.md`
3. Submit a PR — no issue required for small doc fixes

---

## Branch Naming

```
feat/chrono-planner        # New feature
fix/api-cors-error         # Bug fix
docs/api-reference         # Documentation
refactor/predictor-logic   # Refactor
chore/update-deps          # Dependency / tooling update
```

---

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(neural): add confidence interval display to result panel
fix(api): handle missing field validation in /predict endpoint
docs(readme): update quickstart instructions
refactor(store): simplify mood state transitions
chore(deps): bump scikit-learn to 1.4.2
```

Format:
```
<type>(<scope>): <short imperative summary>

[Optional body explaining WHY, not WHAT]

[Optional footer: Closes #42]
```

---

## Pull Request Process

1. Ensure your branch is up to date with `main`:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```
2. Run the Next.js build to catch type errors:
   ```bash
   cd lifedrift-os && npm run build
   ```
3. Test the API manually with curl if you changed Python code
4. Fill out the PR template completely
5. Link the related issue in the PR description
6. Request a review from `@krishmittal2305`

PRs that break the build or have no description will not be merged.

---

## Good First Issues

These are well-scoped, beginner-friendly tasks:

- **Implement Chrono 24h Temporal Planner** — `app/chrono/page.tsx` is a stub; build an interactive 24-hour block planner with stress visualization
- **Prediction History Charts** — Add line/bar charts to the Logs page showing stress trends over a session
- **Unit Tests** — Add pytest tests for `backend.py` API routes
- **Model Feature Expansion** — Add screen time or caffeine intake as features and retrain
- **Streamlit Dashboard Polish** — Improve `dashboard.py` with charts and a better layout
- **Accessibility Audit** — Add ARIA labels and keyboard navigation to the OS shell

---

## Reporting Bugs

Open a GitHub Issue and include:

- **Describe the bug** — what happened vs. what you expected
- **Steps to reproduce** — numbered, minimal
- **Environment** — OS, browser, Node.js version, Python version
- **Screenshots or console output** — paste relevant logs
- **Severity** — does it block usage?

---

## Suggesting Features

Open a GitHub Issue with the label `enhancement` and include:

- **Problem** — what pain point does this address?
- **Proposed Solution** — describe your idea
- **Alternatives** — any other approaches you considered
- **Scope** — is this a small UI change, a new page, or a model change?

---

## Code Style

### TypeScript / React

- Use TypeScript strictly — no `any` unless absolutely unavoidable
- Functional components only
- Tailwind for all styling — no inline `style=` except for dynamic CSS variable values
- Follow existing naming conventions: `PascalCase` for components, `camelCase` for functions/variables
- No unused imports

### Python

- Follow PEP 8
- Type hints on function signatures
- Descriptive variable names — no single letters except loop counters
- Keep Flask route handlers thin; move logic to helper functions

### General

- Small, focused commits
- One feature or fix per PR
- Don't refactor unrelated code in a feature PR
