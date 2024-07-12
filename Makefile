
deploy-server:
	cd dev/server && bun install
	mkdir -p deploy/server
	cp -r dev/server/* deploy/server/
	cp -r dev/server/.env deploy/server/
	cp -r dev/server/.env.local deploy/server/

deploy-client:
	cd dev/client && bun install && bun run build
	mkdir -p deploy/client
	cp -r dev/client/dist/* deploy/client/

deploy: deploy-server deploy-client

run: deploy
	cd deploy/server && bun run src/index.ts

# prog1 & prog2 && fg

clean:
	rm -rf ./deploy
	rm -rf ./dev/images
	rm -rf ./dev/server/node_modules
	rm -rf ./dev/client/node_modules
	rm -rf ./dev/client/dist
