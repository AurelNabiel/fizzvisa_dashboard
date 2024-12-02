FROM node:18 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18 AS production

WORKDIR /app

COPY --from=build /app ./

RUN npm install --only=production

EXPOSE 3003

CMD ["npm", "start"]