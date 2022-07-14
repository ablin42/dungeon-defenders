import express, { Router } from "express";
import { logInfo } from "../../Config/Logger";
import { getLatestLoots, getLootCollection, renderLoot } from "../../Services/LootService";

const router = express.Router();

router.get('/:id/render', async (req, res) => {
    logInfo(`Rendering NFT`);
    const renderedLoot = await renderLoot(parseInt(req.params.id));

    res.writeHead(200, {
        "Content-Type": "image/jpeg",
        "Content-Length": renderedLoot.length
    });

    return res.end(renderedLoot);
})
router.get('/latest/:numToGet', async (req, res) => {
    const numToGet = parseInt(req.params.numToGet);
    logInfo(`Getting latest=${numToGet} NFTs`);
    const NFTs = await getLatestLoots(numToGet);

    return res.json(NFTs);
})

router.get('/wallet/:id', async (req, res) => {
    const addressId = req.params.id;
    logInfo(`Getting collection for wallet=${addressId}`);
    const NFTs = await getLootCollection(addressId);
    logInfo(`Got collection for wallet=${addressId} collectionSize=${NFTs.length}`);

    return res.json(NFTs);
})

export default function registerLootRoutes(r: Router) {
    r.use('/loot', router);
}