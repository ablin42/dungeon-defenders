import express, { Router } from "express";
import registerNFTRoutes from "./NFT/NFTRoutes";

const router = express.Router();
registerNFTRoutes(router);

export function registerV1Routes(r: Router) {
    r.use('/v1', router);
}