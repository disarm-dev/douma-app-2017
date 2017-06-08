#!/usr/bin/env bash
rm -rf dist/
npm install
npm run build
rm -rf serve/
mv dist/ serve/
echo "Built for:" $(git log --oneline -n 1)
