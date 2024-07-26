SRC_FILES := $(shell find dev -type f -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' | grep -v node_modules | grep -v dist)

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
	# export BACKEND_PORT=9990 && \
	# export LOCAL_PORT=8880 && \
	# export VITE_PUBLIC_HOST="https://dont-pani.cc:8880" && \
	export BACKEND_PORT=8443 && \
	export LOCAL_PORT=8080 && \
	export VITE_PUBLIC_HOST="http://dogsmeow.asuscomm.com:8880" && \
	( \
		echo "cd dev/server && bun --hot --inspect=4400 run src/index.ts"; \
		echo "cd dev/client && bun run dev" \
	) | parallel --line-buffer

docker-files: $(SRC_FILES)
	rm -rf ./docker-files
	mkdir -p docker-files/server
	mkdir -p docker-files/client
	cd dev/server && bun install && bun build --target=bun --outdir ./dist src/index.ts
	cd dev/client && bun install && bun run build
	cp -r dev/server/dist/* docker-files/server/
	cp -r dev/server/.env* docker-files/server/
	cp -r dev/client/dist/* docker-files/client/

docker: docker-files
	docker compose up --build

# prog1 & prog2 && fg

# This is literally the worst thing I've ever done.
# I should have spent more time making networks configs DRY.
kill:
	fuser -k 8080/tcp
	fuser -k 8443/tcp
	fuser -k 9990/tcp
	fuser -k 8880/tcp

clean:
	rm -rf ./docker-files
	rm -rf ./dist
	rm -rf ./dev/server/images
	rm -rf ./dev/server/generated_images
	rm -rf ./dev/server/node_modules
	rm -rf ./dev/client/node_modules
	rm -rf ./dev/client/dist
