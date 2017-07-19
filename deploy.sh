#!/usr/bin/env bash
echo " >>>>>>>>>"
echo " >>>>>>>>>"
echo "Starting DiSARM build process (PID: $$)"
echo " >>>>>>>>>"
echo " >>>>>>>>>"

# Find any running deploy.sh scripts and kill all children processes
for pid in $(pgrep -f deploy.sh); do
    if [ $pid != $$ ]; then
        PGID=$(ps opgid= "$pid" | xargs)
        echo "Killing process group >$PGID<"
        kill -TERM -"$PGID"
    fi
done

# Do the actual building and zero-downtime deployment
git fetch --tags
npm install
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

