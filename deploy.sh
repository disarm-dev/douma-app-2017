#!/usr/bin/env bash
rm -rf dist/
rm -rf node_modules/
npm install
npm run build
rm -rf serve/
mv dist/ serve/
echo "Built for:" $(git log --oneline -n 1)
