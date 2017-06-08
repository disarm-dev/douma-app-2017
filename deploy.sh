#!/usr/bin/env bash
rm -rf dist/
npm install
npm run build
echo "Built for:" $(git log --oneline -n 1)
