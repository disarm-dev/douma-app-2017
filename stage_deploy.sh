#!/usr/bin/env bash
rm -rf dist/
git pull
npm install
npm run build
git log --oneline -n 1
