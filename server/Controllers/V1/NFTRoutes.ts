import express, { Router } from "express";
import { logInfo } from "../../Config/Logger";
import { getNFT, renderNFT, getNFTCollection, getLatestNFTs } from "../../Services/NFTService";

const router = express.Router();
router.post('/:id/render', async (req, res) => {
    logInfo(`Generating NFT`);
    const renderedNFT = await renderNFT(req.params.id);

    res.writeHead(200, {
        "Content-Type": "image/jpeg",
        "Content-Length": renderedNFT.length
    });

    return res.end(renderedNFT);
})
router.get('/latest/:numToGet', async (req, res) => {
    const numToGet = parseInt(req.params.numToGet);
    logInfo(`Getting latest=${numToGet} NFTs`);
    const NFTs = await getLatestNFTs(numToGet);
    
    return res.json(NFTs);
})
router.get('/:id', async (req, res) => {
    const tokenId = req.params.id;
    logInfo(`Getting metadata for tokenId=${tokenId}`);
    const metadata = await getNFT(tokenId);
    logInfo(`Got metadata for tokenId=${tokenId} metadata=${JSON.stringify(metadata)}`);

    if (!metadata) {
        return res.status(404);
    }

    return res.json(metadata);
})

router.get('/wallet/:id', async (req, res) => {
    const addressId = req.params.id;
    logInfo(`Getting collection for wallet=${addressId}`);
    const NFTs = await getNFTCollection(addressId);
    logInfo(`Got collection for wallet=${addressId} collectionSize=${NFTs.length}`);

    return res.json(NFTs);
})

export default function registerNFTRoutes(r: Router) {
    r.use('/nft', router);
}