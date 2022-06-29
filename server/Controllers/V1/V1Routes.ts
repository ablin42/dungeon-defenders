import express, { Router } from "express";
import registerGameRoutes from "./GameRoutes";
import registerNFTRoutes from "./NFTRoutes";

const router = express.Router();
registerNFTRoutes(router);
registerGameRoutes(router);

export function registerV1Routes(r: Router) {
    r.use('/v1', router);
}