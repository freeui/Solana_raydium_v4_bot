import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import { getRandomRunTime, getRandomNumber } from "./config";
import { swap } from "./raydium";

const WSOL_ADDRESS = process.env.WSOL_ADDRESS;
const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;

const buy = async () => {
  console.log("----------------Start Buying----------------");
  const solAmount = getRandomNumber(
    Number(process.env.MIN_BUY_QUANTITY),
    Number(process.env.MAX_BUY_QUANTITY)
  );

  console.log(`I will buy tokens with ${solAmount} sol`);

  await swap(WSOL_ADDRESS, TOKEN_ADDRESS, Number(solAmount));
  console.log("==============buy executed!=================");
  const breaktime: number = getRandomRunTime(
    Number(process.env.MIN_TRADE_WAIT),
    Number(process.env.MAX_TRADE_WAIT)
  );
  console.log(`I will wait ${breaktime} milisecond`);
  setTimeout(buy, breaktime);
};

const timeout = getRandomRunTime(
  Number(process.env.MIN_TIME),
  Number(process.env.MAX_TIME)
);

console.log(`We will exit this process after ${timeout} miliseconds...`);

buy();
setTimeout(() => {
  console.log("process is exited\n\t Times up!");
  process.exit(1);
}, Number(timeout));
