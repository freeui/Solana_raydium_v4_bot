import RaydiumSwap from "./swap";
import { Transaction, VersionedTransaction } from "@solana/web3.js";
import * as dotenv from "dotenv";
dotenv.config();
import { swapConfig } from "./swapConfig"; // Import the configuration

const RPC_URL = process.env.RPC_URL;
/**
 * Performs a token swap on the Raydium protocol.
 * Depending on the configuration, it can execute the swap or simulate it.
 */
const WSOL = "So11111111111111111111111111111111111111112";

const fetchPoolAddress = async (tokenAddress: string) => {
  let market = Object();
  try {
    await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`
    ).then(async (res) => {
      await res.json().then((data) => {
        market = data;
      });
    });
    return market?.pairs[0].pairAddress;
  } catch (error) {
    console.log("Retry calling market...");
  }
};

export const swap = async (
  input: string,
  output: string,
  inputAmount: number
) => {
  // /**
  //  * The RaydiumSwap instance for handling swaps.
  //  */

  // let private_key_list = [];
  // load wallet DB
  // const wallets = await Pnl.findAll({ attributes: ["private_key"] });
  // wallets.forEach((wallet: object) => {
  //   return private_key_list.push(wallet["private_key"]);
  // });
  const wallet_private_key = process.env.WALLET_SECRET;
  // const wallet = Keypair.fromSecretKey(bs58.decode(private_key_list[index]));
  // ===============================================================

  const raydiumSwap = new RaydiumSwap(
    String(RPC_URL),
    String(wallet_private_key)
  );
  console.log(`Raydium swap initialized`);
  console.log(`Swapping ${inputAmount} of ${input} for ${output}...`);

  // /**
  //  * Load pool keys from the Raydium API to enable finding pool information.
  //  */
  // await raydiumSwap.loadPoolKeys(swapConfig.liquidityFile);
  // console.log(`Loaded pool keys`);

  // /**
  //  * Find pool information for the given token pair.
  //  */
  // const poolInfo = raydiumSwap.findPoolInfoForTokens(
  //   input,
  //   output
  // ) as LiquidityPoolKeys;
  // console.log("Found pool info: ", poolInfo);

  // fetch current poolAddress
  const poolAddress = await fetchPoolAddress(input == WSOL ? output : input);

  // console.log("poolAddress: ", poolAddress);
  const poolInfo = await raydiumSwap.getPoolKeys(String(poolAddress));
  /**
   * Prepare the swap transaction with the given parameters.
   */
  const tx = await raydiumSwap.getSwapTransaction(
    output,
    inputAmount,
    poolInfo,
    swapConfig.maxLamports,
    swapConfig.useVersionedTransaction,
    swapConfig.direction
  );

  /**
   * Depending on the configuration, execute or simulate the swap.
   */
  if (swapConfig.executeSwap) {
    /**
     * Send the transaction to the network and log the transaction ID.
     */
    const txid = swapConfig.useVersionedTransaction
      ? await raydiumSwap.sendVersionedTransaction(
          tx as VersionedTransaction,
          swapConfig.maxRetries
        )
      : await raydiumSwap.sendLegacyTransaction(
          tx as Transaction,
          swapConfig.maxRetries
        );

    console.log(`https://solscan.io/tx/${txid}`);
  } else {
    /**
     * Simulate the transaction and log the result.
     */
    const simRes = swapConfig.useVersionedTransaction
      ? await raydiumSwap.simulateVersionedTransaction(
          tx as VersionedTransaction
        )
      : await raydiumSwap.simulateLegacyTransaction(tx as Transaction);

    console.log(simRes);
  }
};
