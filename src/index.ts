import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import { getRandomRunTime, getRandomNumber } from "./config";
import { swap } from "./raydium";

const WSOL_ADDRESS = process.env.WSOL_ADDRESS;
const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;

const main = async () => {
  try {
    const rnt = getRandomRunTime(1, 2);
    if (rnt == 1) {
      console.log("----------------Start Buying----------------");
      const solAmount = getRandomNumber(
        Number(process.env.MIN_BUY_QUANTITY),
        Number(process.env.MAX_BUY_QUANTITY)
      );
      console.log(`I will buy tokens with ${solAmount} sol`);

      await swap(WSOL_ADDRESS, TOKEN_ADDRESS, Number(solAmount));
    } else {
      console.log("----------------Start Selling----------------");

      const tokenAmount = getRandomRunTime(
        Number(process.env.MIN_SELL_QUANTITY),
        Number(process.env.MAX_SELL_QUANTITY)
      );

      console.log(`I will sell ${tokenAmount} tokens`);

      await swap(TOKEN_ADDRESS, WSOL_ADDRESS, Number(tokenAmount));
    }
  } catch (error) {
    console.log(error);
  }

  const wtime = getRandomRunTime(
    Number(process.env.MIN_TRADE_WAIT),
    Number(process.env.MAX_TRADE_WAIT)
  );
  console.log(`waiting ${wtime} miliseconds...`);
  setTimeout(main, wtime);
};

const timeout = getRandomRunTime(
  Number(process.env.MIN_TIME),
  Number(process.env.MAX_TIME)
);
console.log(`We will exit this process after ${timeout} miliseconds...`);
main();
setTimeout(() => {
  console.log("process is exited\n\t Times up!");
  process.exit(1);
}, timeout);
