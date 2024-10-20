const NETWORKS = {
  dogecoin: {
    messagePrefix: "\x19Dogecoin Signed Message:\n",
    bip32: {
      public: 0x02facafd,
      private: 0x02fac398,
    },
    pubKeyHash: 0x1e,
    scriptHash: 0x16,
    wif: 0x9e,
  },
  dogecointestnet: {
    messagePrefix: "\x19Dogecoin Signed Message:\n",
    bip32: {
      public: 0x043587cf,
      private: 0x04358394,
    },
    pubKeyHash: 0x71,
    scriptHash: 0xc4,
    wif: 0xf1,
  },
};

const ALLOW_INVISIBLE_TIMES = 4;
const REFRESH_TIME = 5000;

const MAX_CHUNK_LEN = 240;
const MAX_PAYLOAD_LEN = 1500;
const UPDATE_PRICE_TIME = 60 * 1000; // 1 min

module.exports = {
  NETWORKS,
  ALLOW_INVISIBLE_TIMES,
  REFRESH_TIME,
  UPDATE_PRICE_TIME,
  MAX_CHUNK_LEN,
  MAX_PAYLOAD_LEN
};