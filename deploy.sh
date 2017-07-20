#!/usr/bin/env bash

for pid in $(pgrep -f node); do
  echo "Killed node process $pid"
  kill -KILL -$pid
done

# Do the actual building and zero-downtime deployment
git fetch --tags
npm install --no-shrinkwrap --no-package-lock
npm run build
rm -rf serve/
mv dist/ serve/


# Send a useful message back via a Slack webhook
message=$(git rev-parse --abbrev-ref HEAD)": "
message=$message" "$(git describe)
message=$message"    [commit: "$(git log --oneline -n 1)"]"
echo "Built $message"

echo $message | tr -d \'\" | xargs -I % curl -X "POST" "https://hooks.slack.com/services/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" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
  "text": "'%I'"
}'
