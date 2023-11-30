import express, { Application, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";
import bodyParser from "body-parser";
import algosdk, { waitForConfirmation } from 'algosdk'
import { ABI } from "./token";
// import Web3 from "web3";++ 
import { Signer, Wallet, ethers } from "ethers";
import web3 from "web3";
import { createActor } from "./declarations";
import { HttpAgent } from "@dfinity/agent"

const JSON_RPC_URL = "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID";
const PRIVATE_KEY = "b2b613d940b42b6f27d3cb5234d71dd808f6634ceb826d82b0231244be5a993c";

const ADDRESS_TO_MINT = "";
const actor = createActor("utlhf-biaaa-aaaap-abtna-cai", {
  agent: new HttpAgent({
    host: "https://icp-api.io",
  })
})
const provider = new ethers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/HF4M_M-GmS3kW_tVGbR2PEr_xYd1L2zA")
let wallet = new ethers.Wallet(PRIVATE_KEY, provider);



const ONE_ALGO_TO_ETH = 0.0062
// const ONE_ALGO_TO_MATIC = 0.164411
const ETH_CONTRACT_ADDRESS = "0x76c93C837c46665811FEd1534a60496AbFd9132e";
const ETH_PROVIDER =
  "https://eth-sepolia.g.alchemy.com/v2/z9xzfmxaZkYiqOqNwBNfG0Hu6IBqPLN8";
const POLY_PROVIDER =
  "https://polygon-mumbai.g.alchemy.com/v2/HF4M_M-GmS3kW_tVGbR2PEr_xYd1L2zA";
const POLY_CHAIN_ID = 80001;
const ETH_CHAIN_ID = 11155111;
const token = '';
const server = 'https://testnet-api.algonode.cloud';
const indexer = 'http://testnet-idx.algonode.cloud/v2/'

const algoPort = "";
const client = new algosdk.Algodv2(token, server);
const indexClient = new algosdk.Indexer(token, indexer)


const app: Application = express();
const port = 3000;

const iface = new ethers.Interface(ABI).format()
console.log(iface)
//@ts-ignore
BigInt.prototype.toJSON = function () {
  // <------------
  return this.toString(); // <--- SOLUTION
};
let fIndex = ''
// Body parsing Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(limiter);
app.set("trust proxy", true);

app.get("/asset/:id", async (req: Request, res: Response): Promise<Response> => {
  const assetRes = await (await fetch(`http://testnet-idx.algonode.cloud/v2/transactions?txid=${req.params.id.toString()}`, {
    method: 'GET',
  })).json()
  console.log({ assetRes })

  const index = assetRes.transactions[0]["created-asset-index"]

  console.log({ index })
  return res.status(200).send({
    asset: index,
  });
});

let account = algosdk.mnemonicToSecretKey("caught used average what spider tomorrow hospital car crime bullet mass fringe rice media tackle toilet bamboo energy athlete volcano moon vote dolphin abstract post")



app.post(
  "/faucets",
  bodyParser.json(),
  async (req: Request, res: Response): Promise<Response> => {



    return res.status(200);
  }
);

async function getGasPrice() {
  let feeData = ((await provider.getFeeData()).gasPrice!)
  return feeData
}

async function getNonce(wallet: Wallet) {
  let nonce = await provider.getTransactionCount(wallet.address)
  return nonce
}

app.post(
  "/registerNft",
  bodyParser.json(),
  async (req: Request, res: Response): Promise<Response> => {
    console.log(wallet.address, "wallet")
    console.log(req.body, "body")
    const { nftAddress, txId, algoAddress, algo }: {
      nftAddress: string,
      txId: string,

      algoAddress: string,
      algo: number
    } = req.body;
    console.log({ nftAddress, txId, algoAddress, algo })
    const response = await (await fetch(`http://testnet-idx.algonode.cloud/v2/transactions?txid=WUM7RLJAAGURTWMPMF5K7A3UJOCSHW5L3RHRAA74ZWESLJQCAJ7Q`, {
      method: 'GET',
    })).json()
    console.log(response, "response")

    if (!response.transactions) {
      return res.status(405).json({ message: "Algo was not sent" })
    }
    const options = { value: ethers.parseEther((ONE_ALGO_TO_ETH).toString()) }

    // let contract = new web3.eth.Contract(nftAddress, ABI, provider);
    // console.log({ contract })
    let contract = new ethers.Contract(nftAddress, [


      'function approve(address to, uint256 tokenId)',

      'error ERC721IncorrectOwner(address sender, uint256 tokenId, address owner)',
      'error ERC721InsufficientApproval(address operator, uint256 tokenId)',
      'error ERC721InvalidApprover(address approver)',
      'error ERC721InvalidOperator(address operator)',
      'error ERC721InvalidOwner(address owner)',
      'error ERC721InvalidReceiver(address receiver)',
      'error ERC721InvalidSender(address sender)',
      'error ERC721NonexistentToken(uint256 tokenId)',
      'event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)',
      'event ApprovalForAll(address indexed owner, address indexed operator, bool approved)',
      'event BatchMetadataUpdate(uint256 _fromTokenId, uint256 _toTokenId)',
      'event MetadataUpdate(uint256 _tokenId)',
      'function mint(address player) payable returns (uint256)',
      'function safeTransferFrom(address from, address to, uint256 tokenId)',
      'function safeTransferFrom(address from, address to, uint256 tokenId, bytes data)',
      'function setApprovalForAll(address operator, bool approved)',
      'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
      'function transferFrom(address from, address to, uint256 tokenId)',
      'function balanceOf(address owner) view returns (uint256)',
      'function getApproved(uint256 tokenId) view returns (address)',
      'function isApprovedForAll(address owner, address operator) view returns (bool)',
      'function name() view returns (string)',
      'function ownerOf(uint256 tokenId) view returns (address)',
      'function supportsInterface(bytes4 interfaceId) view returns (bool)',
      'function symbol() view returns (string)',
      'function tokenURI(uint256 tokenId) view returns (string)',
      'function tokenurl() view returns (string)'

    ], wallet)

    const name = await contract.name()



    console.log({ name })




    const symbol = await contract.symbol()

    try {
      //@ts-ignore
      const gasEstimate = await contract.mint.estimateGas(wallet.address);
      const gasLimit = parseInt(gasEstimate.toString()) * 2// Doubling the estimated gas for buffer
      console.log({ gasLimit })
      console.log(wallet.address, "addresss")
      const tx = await contract.mint(wallet.address, { ...options, gasLimit: BigInt(gasLimit) });
      console.log({ tx })
      const receipt = await tx.wait();
      console.log('Transaction successful:', receipt);
    } catch (error) {
      console.error('Error occurred while sending transaction:', error);
      return res.status(405).json({ message: "Algo was not sent" });
    }

    const tokenUri = await contract.tokenURI(BigInt(1));

    console.log({ tokenUri })
    // const tx = await contract.mintNFT(wallet.address, options)


    // await tx.wait().then((response: any) => { console.log({ response }) }).catch((error: any) => { console.log({ error }) })
    client.genesis().do().then((response: any) => { console.log({ response }) }).catch((error: any) => { console.log({ error }) })

    const transactionParam = await client.getTransactionParams().do()
    const transactionASA = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      from: account.addr,
      total: 1,
      decimals: 0,
      defaultFrozen: false,
      assetName: name,
      unitName: `W${symbol}`,
      assetURL: `${tokenUri}#arc3`,
      suggestedParams: transactionParam
    })


    const signedTx = transactionASA.signTxn(account.sk)


    const { txId: txid } = await client.sendRawTransaction(signedTx).do()
    const result = await waitForConfirmation(client, txid, 3);


    console.log({ txid })

    const assetRes = await (await fetch(`http://localhost:3000/asset/${txid.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }))
    console.log({ assetRes })
    console.log({ assetRes })
    const index = (await (assetRes.json())).asset

    console.log({ txid })
    console.log({ "txid": txid, "assetIndex": index })

    return res.status(200).send({ "txid": txid, "assetIndex": index });
  }
)
app.post(
  "/sendNft",
  bodyParser.json(),
  async (req: Request, res: Response): Promise<Response> => {

    const transactionParam = await client.getTransactionParams().do()
    const { algoAddress, assetIndex }: { algoAddress: string, assetIndex: number } = req.body;
    const transaction = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      amount: 1,
      assetIndex: assetIndex,
      from: account.addr,
      to: algoAddress,
      suggestedParams: transactionParam,



    })
    const signedTx = transaction.signTxn(account.sk)

    const txid = await client.sendRawTransaction(signedTx).do()
    return res.status(200).send({ "txid": txid });
  }
);
try {
  app.listen(port, async (): Promise<void> => {
    await actor.get_signature().then((response: any) => {
      console.log({ response })
      console.log(response.Ok.signature_hex)
      wallet = new ethers.Wallet(ethers.hashMessage(response.Ok.signature_hex), provider);
      account = algosdk.mnemonicToSecretKey(algosdk.mnemonicFromSeed(new TextEncoder().encode(ethers.hashMessage(response.Ok.signature_hex))));
    }).catch((error: any) => { console.log({ error }) })
    console.log(`Connected successfully on port ${port}`);
  });
} catch (error) {
  console.error(`Error occured: ${error}`);
}
