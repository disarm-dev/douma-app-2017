#!/usr/bin/env bash
rm -rf dist/
npm install
npm run build
rm -rf dist/
mv dist/ serve/
echo "Built for:" $(git log --oneline -n 1)
