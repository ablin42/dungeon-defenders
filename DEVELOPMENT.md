# Development

## Setup (in this order)

### Build the smart contract module

```
blockchain> npm install
blockchain> fill .env vars
blockchain> npm run compile
blockchain> npm run module:build
```

### Run the frontend

```
frontend> npm install
frontend> npm start
```

### Run the server

```
Development Server // uses local json file as db
server> npm install
server> fill .env vars
server> npm run dev

Production Server // uses production db
server> npm run build
server> npm start
```
