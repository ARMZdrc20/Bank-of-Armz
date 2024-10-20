const transactionService = require("../services/transaction.service.js");

/*
 * Get inscription list 
 * 
 * Parameter:
 * <amount> : number
 */
const getInscriptionList = async (req, res, next) => {
  try {
    const result = await transactionService.getInscriptionList(req.query.amount);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const getSpecificDenominationNFTAddress = async (req, res, next) => {
  try {
    const result = await transactionService.getSpecificDenominationNFTAddress(req.query.denomination);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

const swapFromArmzToNFT = async (req, res, next) => {
  try {
    const result = await transactionService.swapFromArmzToNFT(
      req.body.sender,
      req.body.txid,
      req.body.amount,
      req.body.inscriptionId,
      req.body.address
    );
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const swapFromNFTToArmz = async (req, res, next) => {
  try {
    const result = await transactionService.swapFromNFTToArmz(
      req.body.sender,
      req.body.txid,
      req.body.amount,
      req.body.inscriptionId,
    );
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const getStatus = async (req, res, next) => {
  try {
    const result = await transactionService.getStatus(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const broadcast = async (req, res, next) => {
  try {
    const result = await transactionService.broadcast(req.body.txs);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const getValidNFT = async (req, res, next) => {
  try {
    console.log(req.body);
    const result = await transactionService.getValidNFT(req.body.inscriptionIds);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getInscriptionList,
  getSpecificDenominationNFTAddress,
  swapFromArmzToNFT,
  swapFromNFTToArmz,
  getStatus,
  broadcast,
  getValidNFT
};
