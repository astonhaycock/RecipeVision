FROM oven/bun:1 AS base

FROM base AS final
WORKDIR /app
RUN mkdir -p /app/client /app/server
COPY ./docker-files/client /app/client
COPY ./docker-files/server /app/server

WORKDIR /app/server
EXPOSE 8080/tcp

ENTRYPOINT [ "bun", "run", "index.js" ]
