const xrpl = require("xrpl");
const { XummSdk } = require('xumm-sdk');
require('dotenv').config();

const Sdk = new XummSdk(process.env.XUMM_API_KEY, process.env.XUMM_API_SECRET);

const mintNfToken = async (mintingWallet, ipfsHash, memoType, memoData) => {
    const hexHash = xrpl.convertStringToHex(ipfsHash);
    const hexMemoData = xrpl.convertStringToHex(memoData);
    const hexMemoType = xrpl.convertStringToHex(memoType);
    const tokenMintCreate = await Sdk.payload.create({
        "TransactionType": "NFTokenMint",
        "Account": mintingWallet,
        "TransferFee": 0,
        "NFTokenTaxon": 0,
        //flag for only xrp as buy/sell currency
        "Flags": 2,
        "Fee": "10",
        "URI": hexHash,
        "Memos": [
            {
                "Memo": {
                    "MemoType":
                        hexMemoType,
                    "MemoData": hexMemoData
                }
            }
        ]
    });
    //open payload link / qr and sign to create NFToken (costs 2,000,010 drops; 2,000,000 are used to create NFTokenPage to store new NFT)
    console.log("tokenMintCreate payload: ",tokenMintCreate)

};

//helper subscribe function to listen to the created payload uuid until signed if you want to use this
const subscribeToTokenMint = async (uuid) => {
    const subscription = await Sdk.payload.subscribe(uuid, (event) => {
        if (Object.keys(event.data).indexOf('signed') > -1) {
            return event.data;
        };
    });

    const resolveData = await subscription.resolved;
    console.log("resolved payload data: ", resolveData)
};

//helper function to lookup final payload after resolved to access information about tx
const lookupPayload = async (uuid) => {
    const payload = await Sdk.payload.get(uuid);
    console.log(payload)

};
