import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import { getRandomRunTime, getRandomNumber } from "./config";
import { swap } from "./raydium";
import { token } from "@coral-xyz/anchor/dist/cjs/utils";

const WSOL_ADDRESS = process.env.WSOL_ADDRESS;
const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;

const sell = async () => {
  console.log("----------------Start selling----------------");
  const tokenAmount = getRandomRunTime(
    Number(process.env.MIN_SELL_QUANTITY),
    Number(process.env.MAX_SELL_QUANTITY)
  );

  console.log(`I will sell ${tokenAmount} tokens`);

  await swap(TOKEN_ADDRESS, WSOL_ADDRESS, Number(tokenAmount));
  console.log("==============sell executed!=================");
  const breaktime: number = getRandomRunTime(
    Number(process.env.MIN_TRADE_WAIT),
    Number(process.env.MAX_TRADE_WAIT)
  );
  console.log(`I will wait ${breaktime} milisecond`);
  setTimeout(sell, breaktime);
};

const timeout = getRandomRunTime(
  Number(process.env.MIN_TIME),
  Number(process.env.MAX_TIME)
);

console.log(`We will exit this process after ${timeout} miliseconds...`);

sell();
setTimeout(() => {
  console.log("process is exited\n\t Times up!");
  process.exit(1);
}, Number(timeout));
