#! /bin/bash

CONDITION=$1

case $CONDITION in
"build")
	bun run ./scripts/build.js
	;;
"dev")
	NODE_ENV=development tsx --watch ./src/server.ts
	;;
"start")
	NODE_ENV=production node ./dist/server.js
	;;
*)
	echo "The $CONDITION is unknown"
	;;
esac