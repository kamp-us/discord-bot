# base node image
FROM node:16-bullseye-slim as base

# set for base and all that inherit from it
ENV NODE_ENV=production

# Install all node_modules, including dev dependencies
FROM base as deps

RUN mkdir /app
WORKDIR /app

ADD package.json package-lock.json ./
RUN npm ci


# Finally, build the production image with minimal footprint
FROM base

ENV NODE_ENV=production

RUN mkdir /app
WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
ADD . .

CMD ["./node_modules/.bin/nodemon", "index.js"]
