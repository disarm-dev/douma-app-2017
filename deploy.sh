#!/usr/bin/env bash
rm -rf dist/
rm -rf node_modules/
npm install
npm run build
rm -rf serve/
mv dist/ serve/
echo "Built for:" $(git log --oneline -n 1)

echo $(git log --oneline -n 1) |  xargs -I % curl -X "POST" "https://hooks.slack.com/services/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" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
  "text": "'%I'"
}'
