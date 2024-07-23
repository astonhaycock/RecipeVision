dependencies-server:
	cd dev/server && bun install

deploy-server: dependencies-server
	mkdir -p dist/server
	cp -r dev/server/* dist/server/
	cp -r dev/server/.env dist/server/
	cp -r dev/server/.env.local dist/server/

dependencies-client:
	cd dev/client && bun install

deploy-client: dependencies-client
	cd dev/client && bun run build
	mkdir -p dist/client
	cp -r dev/client/dist/* dist/client/

deploy: deploy-server deploy-client
dependencies: dependencies-server dependencies-client

run: deploy
	cd dist/server && bun run src/index.ts

dev: dependencies
	export BACKEND_PORT=8443 && \
	export LOCAL_PORT=8080 && \
	export VITE_PUBLIC_HOST="https://dont-pani.cc" && \
	( \
		echo "cd dev/server && bun --hot run src/index.ts"; \
		echo "cd dev/client && bun run dev" \
	) | parallel --line-buffer

dev2: dependencies
	export BACKEND_PORT=9990 && \
	export LOCAL_PORT=8880 && \
	export VITE_PUBLIC_HOST="https://dont-pani.cc:8880" && \
	( \
		echo "cd dev/server && bun --hot --inspect=4400 run src/index.ts"; \
		echo "cd dev/client && bun run dev" \
	) | parallel --line-buffer

# prog1 & prog2 && fg

clean:
	rm -rf ./dist
	rm -rf ./dev/server/images
	rm -rf ./dev/server/generated_images
	rm -rf ./dev/server/node_modules
	rm -rf ./dev/client/node_modules
	rm -rf ./dev/client/dist
