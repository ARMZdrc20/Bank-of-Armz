const informationService = require("../services/information.service.js");

const getArmzPrice = async (req, res, next) => {
  try {
    const result = await informationService.getArmzPrice();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const getDogecoinPrice = async (req, res, next) => {
  try {
    const result = await informationService.getDogecoinPrice();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const getArmzInVault = async (req, res, next) => {
  try {
    const result = await informationService.getArmzInVault();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const getAvailableNoteCount = async (req, res, next) => {
  try {
    const result = await informationService.getAvailableNoteCount();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const getNFTInscriptions = async(req, res, next) => {
  try {
    const result = await informationService.getNFTInscriptions(req.params.address);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

const getDRC20Inscriptions = async(req, res, next) => {
  try {
    const result = await informationService.getDRC20Inscriptions(req.params.address, req.params.tick);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

const getTransactionsInfo = async(req, res, next) => {
  try {
    const result = await informationService.getTransactionsInfo(req.params.address, req.query.cursor);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

const getNFTBalance = async(req, res, next) => {
  try {
    const result = await informationService.getNFTBalance();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

const getDRC20ImageURL = async (req, res, next) => {
  try {
    const result = await informationService.getDRC20ImageURL(req.params.tick)
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

const getNFTImageURL = async (req, res, next) => {
  try {
    const result = await informationService.getNFTImageURL(req.params.nft)
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getArmzPrice,
  getDogecoinPrice,
  getArmzInVault,
  getAvailableNoteCount,
  getNFTInscriptions,
  getDRC20Inscriptions,
  getTransactionsInfo,
  getNFTBalance,
  getDRC20ImageURL,
  getNFTImageURL
};