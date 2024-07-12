
deploy-server: dev/server/node_modules/**/* dev/server/src/*
	cd dev/server && bun install
	mkdir -p deploy/server
	cp -r dev/server/* deploy/server

deploy-client: dev/client/node_modules/**/* dev/client/src/**/*
	cd dev/client && bun install && bun run build
	mkdir -p deploy/client
	cp -r dev/client/build/* deploy/client

deploy: deploy-server deploy-client

run: deploy
	cd deploy && bun run src/index.ts

# prog1 & prog2 && fg

clean:
	rm -rf ./dev/images
	rm -rf ./dev/server/node_modules
	rm -rf ./client/node_modules
