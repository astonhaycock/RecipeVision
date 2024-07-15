
deploy-server:
	cd dev/server && bun install
	mkdir -p dist/server
	cp -r dev/server/* dist/server/
	cp -r dev/server/.env dist/server/
	cp -r dev/server/.env.local dist/server/

deploy-client:
	cd dev/client && bun install && bun run build
	mkdir -p dist/client
	cp -r dev/client/dist/* dist/client/

deploy: deploy-server deploy-client

run: deploy
	cd dist/server && bun run src/index.ts

# prog1 & prog2 && fg

clean:
	rm -rf ./dist
	rm -rf ./dev/images
	rm -rf ./dev/server/node_modules
	rm -rf ./dev/client/node_modules
	rm -rf ./dev/client/dist
