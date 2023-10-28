import express, { Application, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";
import bodyParser from "body-parser";
import { ABI } from "./token";
import Web3 from "web3";
const POLY_TOKEN_ADDRESS = "0x5E906C9f094906c80F34e8524C8Eec81D19CEcD2";
const ETH_TOKEN_ADDRESS = "0xe5cdFC9a5A59E9949f6C31aB05De8d7DB414756F";
const ETH_PROVIDER =
  "https://eth-sepolia.g.alchemy.com/v2/z9xzfmxaZkYiqOqNwBNfG0Hu6IBqPLN8";
const POLY_PROVIDER =
  "https://polygon-mumbai.g.alchemy.com/v2/HF4M_M-GmS3kW_tVGbR2PEr_xYd1L2zA";
const POLY_CHAIN_ID = 80001;
const ETH_CHAIN_ID = 11155111;

const app: Application = express();
const port = 3000;
//@ts-ignore
BigInt.prototype.toJSON = function () {
  // <------------
  return this.toString(); // <--- SOLUTION
};

const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 15 minutes
  max: 2, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Body parsing Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(limiter);
app.set("trust proxy", true);

app.get("/", async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    message: "Hello World!",
  });
});

app.post(
  "/faucets",
  bodyParser.json(),
  async (req: Request, res: Response): Promise<Response> => {



    return res.status(200);
  }
);
app.post(
  "/registerNft",
  bodyParser.json(),
  async (req: Request, res: Response): Promise<Response> => {

    return res.status(200);
  }
)
try {
  app.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`);
  });
} catch (error) {
  console.error(`Error occured: ${error}`);
}
