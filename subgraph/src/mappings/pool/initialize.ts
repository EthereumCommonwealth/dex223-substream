import { BigDecimal, BigInt, Address } from "@graphprotocol/graph-ts";

import { Bundle, Pool, Token } from "../../../generated/schema";
import { InitializeEvent } from "../../pb/dex223/v1/InitializeEvent";
import { Transaction } from "../../pb/dex223/v1/Transaction";

import {
  updatePoolDayData,
  updatePoolHourData,
} from "../../utils/intervalUpdates";
import {
  MINIMUM_ETH_LOCKED,
  STABLE_COINS,
  STABLECOIN_IS_TOKEN0,
  USDC_WETH_03_POOL,
  WETH_ADDRESS,
} from "../../utils/constants";
import { findEthPerToken, getEthPriceInUSD } from "../../utils/pricing";

export function handleInitialize(event: InitializeEvent): void {
  handleInitializeHelper(event);
}

export function handleInitializeHelper(
  event: InitializeEvent,
  stablecoinWrappedNativePoolAddress: string = USDC_WETH_03_POOL,
  stablecoinIsToken0: boolean = STABLECOIN_IS_TOKEN0,
  wrappedNativeAddress: string = WETH_ADDRESS,
  stablecoinAddresses: string[] = STABLE_COINS,
  minimumEthLocked: BigDecimal = MINIMUM_ETH_LOCKED
): void {
  // update pool sqrt price and tick
  const tx = event.tx as Transaction;
  const poolAddress = Address.fromString(event.poolAddress);
  const pool = Pool.load(poolAddress.toHexString())!;
  pool.sqrtPrice = BigInt.fromString(event.sqrtPriceX96);
  pool.tick = BigInt.fromI32(event.tick);
  pool.save();

  // update token prices
  const token0 = Token.load(pool.token0);
  const token1 = Token.load(pool.token1);

  // update ETH price now that prices could have changed
  const bundle = Bundle.load("1")!;
  bundle.ethPriceUSD = getEthPriceInUSD(
    stablecoinWrappedNativePoolAddress,
    stablecoinIsToken0
  );
  bundle.save();

  updatePoolDayData(tx);
  updatePoolHourData(tx);

  // update token prices
  if (token0 && token1) {
    token0.derivedETH = findEthPerToken(
      token0 as Token,
      wrappedNativeAddress,
      stablecoinAddresses,
      minimumEthLocked
    );
    token1.derivedETH = findEthPerToken(
      token1 as Token,
      wrappedNativeAddress,
      stablecoinAddresses,
      minimumEthLocked
    );
    token0.save();
    token1.save();
  }
}
