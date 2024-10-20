const express = require("express");
const dotenv = require("dotenv");

const informationController = require("../controllers/information.controller");

dotenv.config();
const router = express.Router();

router.get("/", async (req, res) => {
    res.json({ok: true});
});

router.get("/armzprice", informationController.getArmzPrice);
router.get("/dogecoinprice", informationController.getDogecoinPrice);
router.get("/armzinvault", informationController.getArmzInVault);
router.get("/availablenote", informationController.getAvailableNoteCount);
router.get("/nftbalance", informationController.getNFTBalance);

router.get("/:address/txs", informationController.getTransactionsInfo);
router.get("/:address/nfts", informationController.getNFTInscriptions);
router.get("/:address/drc20s/:tick", informationController.getDRC20Inscriptions);

router.get("/drc20s/:tick/image", informationController.getDRC20ImageURL);
router.get("/nfts/:nft/image", informationController.getNFTImageURL);
module.exports = router;
