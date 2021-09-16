import BigNumber from "bignumber.js";
import { Currencies } from "./currencies";
BigNumber.config({ EXPONENTIAL_AT: 1e9 });

const DEFAULT_DECIMAL = Currencies.NIOX.decimal;
/**
 *
 * @param {BigNumber | String | Number} balance
 * @param {BigNumber | String | Number} decimals
 * @param {Number} precision
 * @returns {String} fraction
 */
export const toFraction = (
  balance,
  decimals = DEFAULT_DECIMAL,
  precision = 8
) => {
  const numerator = BigNumber(balance.toString());
  const denominator = BigNumber(10).exponentiatedBy(decimals);
  const value = numerator
    .dividedBy(denominator)
    .decimalPlaces(precision)
    .toString();
  return value;
};

/**
 *
+ * @param {BigNumber | String | Number} decimals
 * @param {Number} precision
 * @returns {String} balance
 */
export const fromFraction = (
  balance,
  decimals = DEFAULT_DECIMAL,
  precision = 8
) => {
  balance = BigNumber(balance.toString());
  decimals = BigNumber(10).exponentiatedBy(decimals);
  return balance.multipliedBy(decimals).decimalPlaces(precision).toString();
};

export const BigNumberComparision = {
  GREATER: 1,
  LESSER: -1,
  EQUAL: 0,
  NAN: null,
};
