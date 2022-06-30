import express, { Router } from "express";
import registerGameRoutes from "./GameRoutes";
import registerLootRoutes from "./LootRoutes";
import registerNFTRoutes from "./NFTRoutes";

const router = express.Router();
registerNFTRoutes(router);
registerLootRoutes(router);
registerGameRoutes(router);

export function registerV1Routes(r: Router) {
    r.use('/v1', router);
}