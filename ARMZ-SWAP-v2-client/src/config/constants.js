import NoteImageFile1 from "../assets/notes/1000.webp";
import NoteImageFile2 from "../assets/notes/10000.webp";
import NoteImageFile3 from "../assets/notes/20000.webp";
import NoteImageFile4 from "../assets/notes/50000.webp";
import NoteImageFile5 from "../assets/notes/100000.webp";
import NoteImageFile6 from "../assets/notes/300000.webp";

const MASTRO_API_URL = "https://xdg-mainnet.gomaestro-api.org/v0";
const MASTRO_API_KEY = "mGS8eYIUBnvft7XBzG4ZQGeVq6dbhwim";

const KEY_BACKUP_STATE = "ArmzBackup";
const KEY_LOCALSTORAGE_PRIVATE_KEY = "ArmzKey";
const MAIN_TOKEN_NAME = "armz";

// const BASE_URL = "http://localhost:3000";
const BASE_URL = "https://www.bankofarmz.com";
const NFT_IMAGE_URL = "https://cdn.doggy.market/content";

const MAX_CHUNK_LEN = 240;
const MAX_PAYLOAD_LEN = 1500;

// const SERVER_URL = "http://localhost:5000";
const SERVER_URL = "https://api.bankofarmz.com";
// const SERVER_WALLET_ADDRESS = "DSokPPTe2zeckvuDtDg69fUp4a9d3fo6F6";
const SERVER_WALLET_ADDRESS = "DE3CCDVGMndrzn5ZGtQjL5CsBshZis1PCb";
const FEE_STORE_WALLET_ADDRESS = "DPo8FMKZLzBUiXWtBpA5LL5bFAtd94iraV";

const NotesData = [
  {
    image: NoteImageFile1,
    denomination: 1000,
  },
  {
    image: NoteImageFile2,
    denomination: 10000,
  },
  {
    image: NoteImageFile3,
    denomination: 20000,
  },
  {
    image: NoteImageFile4,
    denomination: 50000,
  },
  {
    image: NoteImageFile5,
    denomination: 100000,
  },
  {
    image: NoteImageFile6,
    denomination: 300000,
  },
];

const NoteImages = {
  "1000": {
    image: NoteImageFile1
  },
  "10000": {
    image: NoteImageFile2
  },
  "20000": {
    image: NoteImageFile3
  },
  "50000": {
    image: NoteImageFile4
  },
  "100000": {
    image: NoteImageFile5
  },
  "300000": {
    image: NoteImageFile6
  },
}

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

const LOADING_TEXT = [
  "Please wait ...",
  "Loading ...",
  "You are nearly there",
  "The transaction will be success",
  "You will achieve your goals",
  "ARMZ is the strongest token",
  "Choosing ARMZ is your right choice",
  "You will get rich with ARMZ",
  "ARMZ skyrocket",
  "ARMZ price will be soon as solana"
];

const AIRDROP_DRC20_TABLE_LIST = [
  {
    title: "Public Address",
    maxWidth: "450px",
    align: "left",
  },
  {
    title: "txid",
    maxWidth: "410px",
    align: "left",
  },
  {
    title: "Status",
    maxWidth: "260px",
    align: "left",
  },
];

const AIRDROP_NFT_TABLE_LIST = [
  {
    title: "Public Address",
    maxWidth: "450px",
    align: "left",
  },
  {
    title: "NFT inscription id",
    maxWidth: "410px",
    align: "left",
  },
  {
    title: "Status",
    maxWidth: "260px",
    align: "left",
  },
];

const LINK_DOWNLOAD_CSV_NFT = "/samples/nft.csv";
const LINK_DOWNLOAD_CSV_DRC20 = "/samples/drc20.csv";

const NAME_DOWNLOAD_CSV_NFT = "nft_sample.csv";
const NAME_DOWNLOAD_CSV_DRC20 = "drc20_sample.csv";

const LEVEL_USER_AIRDROP_CLIENT_HOLDER = "LEVEL_USER_AIRDROP_CLIENT_HOLDER";
const LEVEL_USER_AIRDROP_NOTE_HOLDER = "LEVEL_USER_AIRDROP_NOTE_HOLDER";
const LEVEL_USER_AIRDROP_ARMZ_HOLDER = "LEVEL_USER_AIRDROP_ARMZ_HOLDER";
const LEVEL_USER_AIRDROP_GENERAL_HOLDER = "LEVEL_USER_AIRDROP_GENERAL_HOLDER";

const AIRDROP_BONUS_FEE_LIST = {
  LEVEL_USER_AIRDROP_CLIENT_HOLDER: 0,
  LEVEL_USER_AIRDROP_NOTE_HOLDER: 1,
  LEVEL_USER_AIRDROP_ARMZ_HOLDER: 2,
  LEVEL_USER_AIRDROP_GENERAL_HOLDER: 3
};

export {
  MASTRO_API_URL,
  MASTRO_API_KEY,
  BASE_URL,
  NotesData,
  NETWORKS,
  KEY_BACKUP_STATE,
  KEY_LOCALSTORAGE_PRIVATE_KEY,
  NFT_IMAGE_URL,
  MAIN_TOKEN_NAME,
  MAX_CHUNK_LEN,
  MAX_PAYLOAD_LEN,
  SERVER_URL,
  SERVER_WALLET_ADDRESS,
  LOADING_TEXT,
  NoteImages,
  AIRDROP_DRC20_TABLE_LIST,
  AIRDROP_NFT_TABLE_LIST,
  LINK_DOWNLOAD_CSV_NFT,
  LINK_DOWNLOAD_CSV_DRC20,
  NAME_DOWNLOAD_CSV_NFT,
  NAME_DOWNLOAD_CSV_DRC20,
  LEVEL_USER_AIRDROP_CLIENT_HOLDER,
  LEVEL_USER_AIRDROP_NOTE_HOLDER,
  LEVEL_USER_AIRDROP_ARMZ_HOLDER,
  LEVEL_USER_AIRDROP_GENERAL_HOLDER,
  AIRDROP_BONUS_FEE_LIST,
  FEE_STORE_WALLET_ADDRESS
};
