#!/usr/bin/env bash
# Run this from the root of a clone of PromiseNetwork/promise-demos
# (Clone first: git clone https://github.com/PromiseNetwork/promise-demos.git)

set -e
BRANCH="${1:-ramin/ops-dashboard-clean}"

echo "==> Fetching origin..."
git fetch origin

echo "==> Checking out main and pulling latest..."
git checkout main
git pull origin main

echo "==> Creating branch: $BRANCH"
git checkout -b "$BRANCH"

echo "==> Adding remote 'raminpromise' (your fork)..."
git remote add raminpromise https://github.com/raminpromise/promise-demos.git 2>/dev/null || git remote set-url raminpromise https://github.com/raminpromise/promise-demos.git

echo "==> Pushing branch to raminpromise/promise-demos..."
git push -u raminpromise "$BRANCH"

echo ""
echo "Done. Open a PR on GitHub: base = PromiseNetwork/promise-demos main, compare = raminpromise/promise-demos $BRANCH"
