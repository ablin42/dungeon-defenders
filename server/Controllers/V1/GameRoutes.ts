import express, { Router } from "express";
import { logInfo } from "../../Config/Logger";
import { allocateRewards } from "../../Services/GameService";

const router = express.Router();
router.post('/:address/allocateRewards', async (req, res) => {
    const address = req.params.address;

    logInfo(`Allocating rewards to address=${address}`);
    await allocateRewards(address);
    
    return res.send();
})

export default function registerGameRoutes(r: Router) {
    r.use('/game', router);
}