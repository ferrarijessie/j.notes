FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* /app/
RUN if [ -f package-lock.json ]; then npm ci --legacy-peer-deps; else npm install --legacy-peer-deps; fi

COPY . /app

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "-p", "3000", "-H", "0.0.0.0"]
