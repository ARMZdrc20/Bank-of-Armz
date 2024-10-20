const axios = require("axios");
const dotenv = require("dotenv");

const { Info, NFT, PendingTransaction } = require("../models");
const { UPDATE_PRICE_TIME } = require("../config/constants");
const { getAllUTXOs, getAllNFTInscriptions, getOutputValue } = require("../config/utils");
const logMessage = require("../config/logger");

dotenv.config();

const getArmzPrice = async () => {
  try {
    const info = await Info.findOne({});
    if (info) {
      return {
        isSuccess: true,
        message: "Armz price successful found!",
        data: {
          armzPrice: info.armzPrice,
        },
      };
    }
    return {
      isSuccess: false,
      message: "Not found",
    };
  } catch (err) {
    logMessage(err);
    return {
      isSuccess: false,
      message: "Not found",
    };
  }
};

const getDogecoinPrice = async () => {
  try {
    const info = await Info.findOne({});
    if (info) {
      return {
        isSuccess: true,
        message: "Dogecoin price successful found!",
        data: {
          dogecoinPrice: info.dogecoinPrice,
        },
      };
    }
    return {
      isSuccess: false,
      message: "Not found",
    };
  } catch (err) {
    logMessage(err);
    return {
      isSuccess: false,
      message: "Not found",
    };
  }
};

const getArmzInVault = async () => {
  try {
    const result = await NFT.aggregate([
      {
        $match: {
          own: false // Filter documents where `own` is true
        }
      },
      {
        $group: {
          _id: null, // Group all filtered documents together
          totalDenomination: { $sum: "$denomination" } // Sum the denomination field
        }
      }
    ]);
    return {
      isSuccess: true,
      message: "Successful found",
      data: {
        amount: result[0] ? result[0].totalDenomination : 0
      }
    };
  } catch (err) {
    logMessage(err);
    return {
      isSuccess: false,
      message: "Not found",
    };
  }
};

const getAvailableNoteCount = async () => {
  try {
    const result = await NFT.aggregate([
      {
        $match: {
          own: true // Filter documents where `own` is true
        }
      },
      {
        $group: {
          _id: null, // Group all filtered documents together
          noteCount: { $sum: 1 } // Sum the denomination field
        }
      }
    ]);
    return {
      isSuccess: true,
      message: "Successful found",
      data: {
        amount: result[0] ? result[0].noteCount : 0
      }
    };
  } catch (err) {
    logMessage(err);
    return {
      isSuccess: false,
      message: "Not found",
    };
  }
};

const _updateArmzPrice = async () => {
  try {
    const result = await axios.get(
      `${process.env.COINRANK_API}/coin/${process.env.ARMZ_DRC20_TICKER_UUID}/price`
    );
    // logMessage("RESULT:", result.data.data.price);
    const info = await Info.findOne({});
    if (info) {
      info.armzPrice = result.data.data.price;
      await info.save();
      // logMessage("Update info armz token:", info.armzPrice);
    } else {
      newInfo = new Info({
        armzPrice: result.data.data.price,
        dogecoinPrice: 0,
      });
      await newInfo.save();
      // logMessage("New info armz token:", newInfo.armzPrice);
    }
  } catch (err) {
    logMessage("Error occured in updating armz token price!");
    throw err;
  }
};

const _updateDogecoinPrice = async () => {
  try {
    const result = await axios.get(
      `${process.env.COINGECKO_API}/api/v3/simple/price?ids=dogecoin&vs_currencies=usd`
    );
    // logMessage("Dogecoin", result);
    const info = await Info.findOne({});
    if (info) {
      info.dogecoinPrice = result.data.dogecoin.usd;
      await info.save();
      // logMessage("Update info dogecoin:", info.dogecoinPrice);
    } else {
      newInfo = new Info({
        armzPrice: 0,
        dogecoinPrice: result.data.dogecoin.usd,
      });
      await newInfo.save();
      // logMessage("New info dogecoin:", newInfo.dogecoinPrice);
    }
  } catch (err) {
    logMessage("Error occured in updating dogecoin price!", err);
    throw err;
  }
};

const synchronizingPrice = async () => {
  try {
    await _updateDogecoinPrice();
    await _updateArmzPrice();
    setTimeout(async () => await synchronizingPrice(), UPDATE_PRICE_TIME);
  } catch(err) {
    setTimeout(async () => await synchronizingPrice(), UPDATE_PRICE_TIME);
    logMessage("Error occur!");
  }
};

const getNFTInscriptions = async (address) => {
  try {
    const nfts = await getAllNFTInscriptions(address);
    const UTXOs = await getAllUTXOs(address);

    const restructuredInscriptions = [];

    for (let index = 0; index < nfts.length; index++) {
      const nft = nfts[index];
      const nftUtxo = UTXOs.find(
        (utxo) =>
          utxo.inscriptions.length &&
          utxo.inscriptions[0].inscription_id === nft.inscriptionId
      );
      if (nftUtxo)
        restructuredInscriptions.push({
          txid: nftUtxo.txid,
          inscriptionId: nftUtxo.inscriptions[0].inscription_id,
          imageType: nft.contentType.includes("image") ? "image" : (nft.contentType.includes("html") ? "html" : "model")
          // satoshis: parseInt(nftUtxo.satoshis),
          // vout: nftUtxo.vout,
          // script: nftUtxo.script_pubkey
        });
    }
    // logMessage("NFT:", restructuredInscriptions);
    return {
      isSuccess: true,
      message: "Get inscription success",
      data: {
        nfts: restructuredInscriptions,
      },
    };
  } catch (err) {
    logMessage("Get nft inscription err:", err.msg);
    return {
      isSuccess: false,
      message: "Failed get nft inscription",
    };
  }
};

const getDRC20Inscriptions = async (address, tick) => {
  try {
    const drc20_url = `${process.env.DOGGY_MARKET_API}/wallet/${address}/inscribedTransfers/${tick}`;
    const result_drc20s = await axios.get(`${process.env.SCRAPINT_URL}/?api_key=${process.env.SCRAPING_API_KEY}&url=${drc20_url}`);
    const jsonString = result_drc20s.data.match(/<pre>(.*?)<\/pre>/s)[1];

    const UTXOs = await getAllUTXOs(address);
    const drc20s = JSON.parse(jsonString);
    
    const restructuredInscriptions = [];
    for (let index = 0; index < drc20s.length; index++) {
      const drc20 = drc20s[index];
      const drc20Utxo = UTXOs.find(
        (utxo) =>
          utxo.inscriptions.length &&
          utxo.inscriptions[0].inscription_id === drc20.inscriptionId
      );
      if (drc20Utxo)
        restructuredInscriptions.push({
          inscriptionId: drc20Utxo.inscriptions[0].inscription_id,
          satoshis: parseInt(drc20Utxo.satoshis),
          vout: drc20Utxo.vout,
          script: drc20Utxo.script_pubkey,
          amount: drc20.amt,
          txid: drc20Utxo.txid
        });
    }
    // logMessage("NFT:", restructuredInscriptions);
    return {
      isSuccess: true,
      message: "Get inscription success",
      data: {
        drc20s: restructuredInscriptions,
      },
    };
  } catch (err) {
    logMessage("Get nft inscription err:", err);
    return {
      isSuccess: false,
      message: "Failed get nft inscription",
    };
  }
};

const _getPendingTransactionId = async (address) => {
  try {
    const config = {
      maxBodyLength: Infinity,
      headers: {
        Accept: "application/json",
        "api-key": process.env.MASTRO_API_KEY,
      },
    };

    const pendingTxs = await PendingTransaction.find({address: address, pending: true});
    // logMessage(...pendingTxs);

    const pendingTxIds = [];
    for(let i = 0;i < pendingTxs.length;i ++) {
      const tx = pendingTxs[i];
      const result_txInfo = await axios.get(`${process.env.MASTRO_API_URL}/transactions/${tx.txid}`, config);
      const txInfo = result_txInfo.data.data;
      if(txInfo.confirmations) {
        tx.pending = false;
        await tx.save();
      } else pendingTxIds.push(tx.txid);
    }

    return pendingTxIds;
  } catch (err) {
    logMessage(err);
    logMessage("Pending transactions error");
    return;
  }
}

const getTransactionsInfo = async (address, cursor) => {
  try {
    const config = {
      maxBodyLength: Infinity,
      headers: {
        Accept: "application/json",
        "api-key": process.env.MASTRO_API_KEY,
      },
    };
    
    let result_txs;
    let pendingTxs = (cursor ? [] : await _getPendingTransactionId(address));
    console.log("Okay", pendingTxs);
    const TRANSACTION_COUNT_PER_PAGE = Math.max(1, Math.min(5, 5 - pendingTxs.length));
    if(cursor) result_txs = await axios.get(`${process.env.MASTRO_API_URL}/addresses/${address}/txs?count=${TRANSACTION_COUNT_PER_PAGE}&order=desc&cursor=${cursor}`, config);
    else result_txs = await axios.get(`${process.env.MASTRO_API_URL}/addresses/${address}/txs?count=${TRANSACTION_COUNT_PER_PAGE}&order=desc`, config);

    logMessage("pendingTxs",pendingTxs);
    const t_txs = result_txs.data.data.map((tx) => tx.tx_hash);
    logMessage("txs",t_txs);
    const txs = [...pendingTxs, ...t_txs];
    const txInfos = [];

    for(let i = 0;i < txs.length;i ++) {
      const tx = txs[i];
      const result_txInfo = await axios.get(`${process.env.MASTRO_API_URL}/transactions/${tx}`, config);
      const txInfo = result_txInfo.data.data;
      
      let txInfo_inputValue = 0;
      let txInfo_outputValue = getOutputValue(address, txInfo);
      for(let j = 0;j < txInfo.vin.length;j ++) {
        const result_t_vinTxInfo = await axios.get(`${process.env.MASTRO_API_URL}/transactions/${txInfo.vin[j].txid}`, config);
        const t_vinTxInfo = result_t_vinTxInfo.data.data;
        txInfo_inputValue = txInfo_inputValue + getOutputValue(address, t_vinTxInfo);
      }

      txInfos.push({
          txid: txInfo.txid,
          time: txInfo.time,
          satoshis: txInfo_outputValue - txInfo_inputValue,
          confirmations: txInfo.confirmations
      });
    }

    return {
      isSuccess: true,
      message: "Get transactions success",
      data: {
        txs: txInfos,
        cursor: result_txs.data.next_cursor
      },
    };
  } catch (err) {
    logMessage("Get transactions err:", err);
    return {
      isSuccess: true,
      message: "Get transactions success",
      data: {
        txs: [],
        cursor: null
      },
    };
  }
};

/*
 * The maximum inscriptions that can user's can get when they pay
 */
const getNFTBalance = async () => {
  const result = await NFT.aggregate([
    {
      $match: {
        own: true,
        status: "general"  // Only include documents where the 'own' field is true
      }
    },
    {
      $group: {
        _id: "$denomination",  // Group by the 'type' field
        count: { $sum: 1 }  // Count the number of documents in each group
      }
    },
    {
      $project: {
        denomination: "$_id",   // Rename _id to type
        count: 1,       // Include the count field
        _id: 0          // Exclude the original _id field
      }
    },
    {
      $sort: { denomination: -1 }  // Sort by denomination in ascending order
    }
  ]);

  logMessage("RESULT", result);
  return {
    isSuccess: true,
    message: "Succeed found",
    data: result
  };
}

const getDRC20ImageURL = async (tick) => {
  try {
    console.log(tick);
    const result = await axios.get(`${process.env.DOGGY_MARKET_API}/token/${tick}`);
    console.log("RESULT", result.data.pic);
    return {
      isSuccess: true,
      message: "Succeed found",
      data: result.data.pic
    };
  } catch (err) {
    logMessage("GetDRC20ImageURL failed", tick);
    return {
      isSuccess: false,
      message: "Not found",
    }
  }
}

const getNFTImageURL = async (nft) => {
  try {
    const nftURL = `${process.env.DOGGY_MARKET_API}/inscriptions/${nft}`;
    const result_nftImage = await axios.get(`${process.env.SCRAPINT_URL}/?api_key=${process.env.SCRAPING_API_KEY}&url=${nftURL}`);
    const jsonString = result_nftImage.data.match(/<pre>(.*?)<\/pre>/s)[1];
    const nftData = JSON.parse(jsonString);

    console.log("RESULT", nftData.nft.image);
    return {
      isSuccess: true,
      message: "Succeed found",
      data: nftData.nft.image
    };
  } catch (err) {
    logMessage("Error when getting nft image url");
    return {
      isSuccess: false,
      message: "Not found",
    }
  }
}

module.exports = {
  getArmzPrice,
  getDogecoinPrice,
  getArmzInVault,
  getAvailableNoteCount,
  synchronizingPrice,
  getNFTInscriptions,
  getDRC20Inscriptions,
  getTransactionsInfo,
  _getPendingTransactionId,
  getNFTBalance,
  getDRC20ImageURL,
  getNFTImageURL
};
