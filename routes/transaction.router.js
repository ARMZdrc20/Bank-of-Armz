const express = require("express");
const dotenv = require("dotenv");

const transactionController = require("../controllers/transaction.controller");

dotenv.config();
const router = express.Router();

router.get("/", async (req, res) => { res.json({ok: true}); });

router.get("/possibleNFTList", transactionController.getInscriptionList);
router.get("/possibleNFT", transactionController.getSpecificDenominationNFTAddress);

router.post("/validNFT", transactionController.getValidNFT);

router.post("/swapArmzToNFT", transactionController.swapFromArmzToNFT);
router.post("/swapNFTToArmz", transactionController.swapFromNFTToArmz);

router.get("/status/:id", transactionController.getStatus);
router.post("/broadcast", transactionController.broadcast);

module.exports = router;
