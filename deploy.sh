#!/usr/bin/env bash

for pid in $(pgrep -f deploy.sh); do
    if [ $pid != $$ ]; then
        PGID=$(ps opgid= "$pid")
        echo "Killed process group $PGID"
        kill -KILL -$PGID
    fi
done

git fetch --tags
#rm -rf node_modules/
npm install
npm run build
rm -rf serve/
mv dist/ serve/

message=$(git rev-parse --abbrev-ref HEAD)": "
message=$message" "$(git describe)
message=$message"    [commit: "$(git log --oneline -n 1)"]"
echo "Built $message"

echo $message | tr -d \'\" | xargs -I % curl -X "POST" "https://hooks.slack.com/services/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" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
  "text": "'%I'"
}'
