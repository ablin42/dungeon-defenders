import express, { Router } from "express";
import { logInfo } from "../../Config/Logger";
import { getNFT, renderNFT, getNFTCollection } from "../../Services/NFTService";

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
// router.get('/', (_req, res) => {
//     logInfo(`Getting all NFT metadatas`);
//     const metadatas = getNFTMetadatas();

//     return res.json({NFTs: metadatas});
// })
router.get('/:id', (req, res) => {
    const tokenId = req.params.id;
    logInfo(`Getting metadata for tokenId=${tokenId}`);
    const metadata = getNFT(tokenId);
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