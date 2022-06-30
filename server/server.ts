import express, { Express, Request, Response } from 'express';
import { SERVER_PORT } from './Config/Config';
import { logInfo } from './Config/Logger';
import registerRoutes from './Controllers/Controllers';
import cors from 'cors';
import { registerEventListeners } from './Services/NFTService';
import { registerEventListeners as registerLootEventListeners } from './Services/LootService';

const app: Express = express();
app.use(cors());

registerRoutes(app);

app.listen(SERVER_PORT, () => {
  logInfo(`Server is running at https://localhost:${SERVER_PORT}`);
  registerEventListeners();
  registerLootEventListeners();
});