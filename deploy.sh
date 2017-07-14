#!/usr/bin/env bash
git fetch --tags
#rm -rf node_modules/
npm install
npm run build
rm -rf serve/
mv dist/ serve/
echo "Built for:" $(git log --oneline -n 1)

echo $(git rev-parse --abbrev-ref HEAD) $(git log --oneline -n 1) $(git describe) | tr -d \'\" | xargs -I % curl -X "POST" "https://hooks.slack.com/services/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" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
  "text": "'%I'"
}'

