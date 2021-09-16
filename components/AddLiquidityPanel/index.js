// import React, { useCallback, useEffect, useState } from "react";
// import { Card, Spinner } from "reactstrap";
// import Typography from "components/Typography";
// import { GradientButton } from "components/Buttons";
// import CurrencyInputPanelLP from "../../components/CurrencyInputPanelLP";
// import { ContractAddress } from "../../assets/constants/addresses";
// import {
//   Token,
//   Trade,
//   TokenAmount,
//   TradeType,
//   Fetcher,
//   Route,
//   InsufficientReservesError,
// } from "@uniswap/sdk";
// import web3 from "web3";
// import { useUser } from "contexts/UserContext";
// import { ethers } from "ethers";
// import {
//   defaultGasLimit,
//   getGasPrice,
//   defaultApprovalAmount,
//   unitBlockTime,
// } from "../../utils/ethereum";
// import { abi as IUniswapV2Router02ABI } from "../../assets/constants/abi/IUniswapV2Router02.json";
// import { Currencies } from "../../utils/currencies";
// import { toast } from "react-toastify";
// import { sanitizeNumber } from "../../utils/input";
// import useInterval from "../../utils/hooks/useInterval";
// import BigNumber from "bignumber.js";
// import { useTokenDetails } from "../../utils/hooks/useTokenDetails";
// import { fromFraction, toFraction } from "../../utils/balance";
// import { useQuery } from "@apollo/client";
// import { ETH_PRICE_QUERY } from "../../queries/price";
// import AddLiquiditySuccessModal from "./AddLiquiditySuccessModal";
// import IUniswapV2ERC20 from "@uniswap/v2-core/build/IUniswapV2ERC20.json";
// import PendingTxn from "../PendingTxn";

// const conversionTypes = { FROM: "FROM", TO: "TO" };

// const memoizedRoute = {};
// const setMemoizedRoute = (fromAddress, toAddress, value) =>
//   (memoizedRoute[`${fromAddress}_${toAddress}`] = value);
// const getMemoizedRoute = (fromAddress, toAddress) =>
//   memoizedRoute[`${fromAddress}_${toAddress}`];

// const AddLiquidityPanel = ({ tokens }) => {
//   const [fromAmount, setFromAmount] = useState(0);
//   const [toAmount, setToAmount] = useState(0);
//   const { library, account, network, chainId } = useUser();
//   const [pendingTxn, setPendingTxn] = useState(undefined);
//   const [addingLiquidity, setAddingLiquidity] = useState(false);
//   const [approving, setApproving] = useState(false);
//   const [swappingRoute, setSwappingRoute] = useState(undefined);
//   const [fromTokenAllowance, setFromTokenAllowance] = useState("0");
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const {
//     loading: token0Loading,
//     data: token0Data,
//     error: token0Error,
//   } = useTokenDetails(tokens ? tokens[0] : "", account, library);
//   const {
//     loading: token1Loading,
//     data: token1Data,
//     error: token1Error,
//   } = useTokenDetails(tokens ? tokens[1] : "", account, library);
//   const [insufficientReserves, setInsufficientReserves] = useState(false);
//   const [conversionRate, setConversionRate] = useState(undefined);
//   const [invertedConversionRate, setInvertedConversionRate] =
//     useState(undefined);
//   // const [lpBalance, setLpBalance] = useState(undefined);
//   const [liquidityReceived, setLiquidityReceived] = useState(undefined);

//   // console.log({ token0Loading, token0Data, token0Error });
//   const { data: ethPriceData } = useQuery(ETH_PRICE_QUERY);

//   useEffect(async () => {
//     const route = await getSwappingRoute();
//     setSwappingRoute(route);
//     const trade = getConversionRate(route, "1");
//     if (!trade) return;
//     setConversionRate(trade.executionPrice.toSignificant(6));
//     setInvertedConversionRate(trade.executionPrice.invert().toSignificant(6));
//   }, [token0Loading, token1Loading]);

//   useEffect(async () => {
//     setSwappingRoute(undefined);
//     const route = await getSwappingRoute();
//     setSwappingRoute(route);
//   }, []);

//   const getUSDValue = useCallback(() => {
//     const ethPriceInUSD = ethPriceData?.bundles[0]?.ethPrice;
//     const eth = Number(toAmount);
//     const usdValue = eth * Number(ethPriceInUSD);
//     if (isNaN(usdValue)) return undefined;
//     return usdValue.toFixed(4);
//   }, [fromAmount, toAmount]);

//   useInterval(() => updateFromTokenAllowance(), unitBlockTime, [account]);

//   const updateFromTokenAllowance = async () => {
//     if (!token0Data) return;
//     let allowance = await token0Data.contract.allowance(
//       account,
//       ContractAddress.UNISWAP
//     );
//     allowance = BigNumber(allowance.toString());
//     setFromTokenAllowance(allowance.toString());
//   };

//   const getTokens = useCallback(() => {
//     if (!token0Data || !token1Data) return {};
//     const fromToken = new Token(
//       chainId,
//       token0Data.address,
//       token0Data.decimals
//     );
//     const toToken = new Token(chainId, token1Data.address, token1Data.decimals);
//     return { fromToken, toToken };
//   }, [token0Loading, token1Loading]);

//   const getSwappingRoute = async () => {
//     if (!token0Data || !token1Data) return;
//     const { fromToken, toToken } = getTokens();
//     const memo = getMemoizedRoute(token0Data.address, token1Data.address);
//     if (memo) return memo;
//     const pair = await Fetcher.fetchPairData(fromToken, toToken);
//     const route = new Route([pair], fromToken);
//     setMemoizedRoute(fromToken.address, toToken.address, route);
//     return route;
//   };

//   const getConversionRate = (route, value, type = conversionTypes.FROM) => {
//     setInsufficientReserves(false);
//     try {
//       const { fromToken, toToken } = getTokens();
//       if (!fromToken || !toToken) return;
//       const tradeToken = type === conversionTypes.FROM ? fromToken : toToken;
//       const tradeType =
//         type === conversionTypes.FROM
//           ? TradeType.EXACT_INPUT
//           : TradeType.EXACT_OUTPUT;
//       const decimals =
//         type === conversionTypes.FROM
//           ? token0Data.decimals
//           : token1Data.decimals;
//       const trade = new Trade(
//         route,
//         new TokenAmount(tradeToken, fromFraction(value, decimals)),
//         tradeType
//       );

//       // console.log("getConversionRate trade executionPrice", trade.executionPrice.toSignificant(6));
//       // console.log("getConversionRate trade executionPrice invert", trade.executionPrice.invert().toSignificant(6));
//       return trade;
//     } catch (error) {
//       if (error instanceof InsufficientReservesError) {
//         setInsufficientReserves(true);
//         toast("Insuffucient liquidity in the pool. Try with a lesser amount", {
//           type: "error",
//         });
//         return;
//       }
//       console.log("errorr", error);
//       toast("errorrr", error.message);
//     }
//   };

//   const handleFromAmountChange = async (value) => {
//     value = sanitizeNumber(value);
//     if (!value) return resetAmounts();
//     if (value === ".") return setFromAmount("0.");
//     if (`${value}`.charAt(0) === ".") {
//       value = `0${value}`;
//     }
//     setFromAmount(value);
//     setToAmount("Calculating ...");
//     console.log("handleFromAmountChange setConversionRate", conversionRate);
//     if (!conversionRate) {
//       return setToAmount(0);
//     }
//     const price = value * conversionRate;
//     setToAmount(price);
//   };

//   const handleToAmountChange = async (value) => {
//     value = sanitizeNumber(value);
//     if (!value) return resetAmounts();
//     if (value === ".") return setToAmount("0.");
//     if (`${value}`.charAt(0) === ".") {
//       value = `0${value}`;
//     }
//     setToAmount(value);
//     setFromAmount("Calculating ...");
//     // const tradeExecutionPrice = await getConversionRate(value, conversionTypes.TO);
//     if (!invertedConversionRate) {
//       return setFromAmount(0);
//     }
//     console.log(
//       "handleToAmountChange invertedConversionRate",
//       invertedConversionRate
//     );
//     const price = value * invertedConversionRate;
//     setFromAmount(price);
//   };

//   const resetAmounts = () => {
//     setFromAmount("0");
//     setToAmount("0");
//   };

//   const approveTokens = async () => {
//     try {
//       setApproving(true);
//       if (!token0Data) return;
//       const txn = await token0Data.contract.approve(
//         ContractAddress.UNISWAP,
//         defaultApprovalAmount
//       );
//       setPendingTxn(txn.hash);
//       await txn.wait();

//       await updateFromTokenAllowance();
//       toast("Approval completed successfully.");
//       setPendingTxn(undefined);
//     } catch (error) {
//       toast(`Failed to Approve: ${error.message}`, { type: "error" });
//       throw error;
//     } finally {
//       setApproving(false);
//     }
//   };

//   const buyLiquidity = async () => {
//     try {
//       if (!token0Data) return;

//       const oldLpBalance = await getBalance(
//         swappingRoute?.pairs[0]?.liquidityToken.address
//       );

//       const signer = await library.getSigner(account);
//       const uniswap = new ethers.Contract(
//         ContractAddress.UNISWAP,
//         IUniswapV2Router02ABI,
//         signer
//       );
//       const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
//       const gasPrice = await getGasPrice();
//       // const amountTokenDesired = web3.utils.toWei(fromAmount.toString(), "ether");
//       // console.log("amountTokenDesired", amountTokenDesired);

//       const amountTokenDesired = fromFraction(
//         fromAmount,
//         token0Data.decimals,
//         0
//       );
//       const value = fromFraction(toAmount, 18, 0);
//       // const slippage = Currencies.SDAO.slippagePercent;
//       // const slippageMulFactor = 1 - slippage / 100;
//       // const amountTokenMin = ethers.BigNumber.from(amountTokenDesired) * slippageMulFactor;
//       // const amountETHMin = web3.utils.toWei(toAmount.toString(), "ether");
//       const tx = await uniswap.addLiquidityETH(
//         token0Data.address,
//         amountTokenDesired,
//         "0",
//         "0",
//         account,
//         deadline,
//         {
//           gasLimit: defaultGasLimit,
//           gasPrice,
//           value,
//         }
//       );
//       setPendingTxn(tx.hash);
//       console.log(`Transaction hash: ${tx.hash}`);
//       const receipt = await tx.wait();

//       const newLpBalance = await getBalance(
//         swappingRoute?.pairs[0]?.liquidityToken.address
//       );

//       let lpReceived = newLpBalance.sub(oldLpBalance);

//       lpReceived = toFraction(
//         lpReceived.toString(),
//         swappingRoute?.pairs[0]?.liquidityToken.decimals
//       );

//       setLiquidityReceived(lpReceived);
//       // swappingRoute?.pairs[0]?.liquidityToken.decimals

//       console.log("Receipt", receipt);
//       console.log(`Transaction was mined in block ${receipt.blockNumber}`);
//       toast(`Transaction was mined in block ${receipt.blockNumber}`, {
//         type: "success",
//       });
//     } catch (error) {
//       console.log("unable to add liquidity");
//       throw error;
//     } finally {
//       setPendingTxn(undefined);
//     }
//   };

//   const approveIfInsufficientAllowance = async () => {
//     if (!token0Data) return;

//     let allowance = await token0Data.contract.allowance(
//       account,
//       ContractAddress.UNISWAP
//     );
//     allowance = BigNumber(allowance.toString());
//     const amount = fromFraction(fromAmount, token0Data?.decimals);

//     if (allowance.comparedTo(BigNumber(amount)) !== 1) {
//       await approveTokens();
//       // const txn = await token0Data.contract.approve(ContractAddress.UNISWAP, defaultApprovalAmount);
//     }
//   };

//   const getBalance = async (tokenAddress) => {
//     const signer = await library.getSigner(account);
//     const contract = new ethers.Contract(
//       tokenAddress,
//       IUniswapV2ERC20.abi,
//       signer
//     );
//     let balance = await contract.callStatic.balanceOf(account);
//     return balance;
//   };

//   const handleClick = async () => {
//     try {
//       setAddingLiquidity(true);
//       await approveIfInsufficientAllowance();
//       await buyLiquidity();
//       setShowSuccessModal(true);
//     } catch (error) {
//       toast(`Operation Failed: ${error.message}`, { type: "error" });
//       console.log("errrrrrrrrrr", error);
//     } finally {
//       setAddingLiquidity(false);
//     }
//   };

//   const showApproval = () => {
//     if (!sanitizeNumber(fromAmount) || isNaN(sanitizeNumber(fromAmount)))
//       return false;
//     const allowance = BigNumber(fromTokenAllowance);
//     if (allowance.isZero()) return true;
//     const amount = fromFraction(fromAmount, token0Data?.decimals);
//     return allowance.comparedTo(BigNumber(amount)) !== 1;
//   };

//   const handleModalClose = () => {
//     resetAmounts();
//     setShowSuccessModal(false);
//   };

//   return (
//     <Card className="p-4" style={{ borderRadius: 8 }}>
//       <Typography
//         color="text1"
//         size={20}
//         weight={600}
//         className="d-flex justify-content-center"
//       >
//         Add Liquidity
//       </Typography>
//       <CurrencyInputPanelLP
//         onAmountChange={handleFromAmountChange}
//         amount={fromAmount}
//         // selectedCurrency={fromCurrency}
//         disabled={!swappingRoute || !conversionRate}
//         token={tokens ? tokens[0] : ""}
//         USDValue={getUSDValue()}
//       />

//       <Typography className="d-flex justify-content-center">+</Typography>
//       <CurrencyInputPanelLP
//         onAmountChange={handleToAmountChange}
//         amount={toAmount}
//         // selectedCurrency={toCurrency}
//         disabled={!swappingRoute || !conversionRate}
//         token={tokens ? tokens[1] : ""}
//         USDValue={getUSDValue()}
//       />
//       {insufficientReserves ? (
//         <Typography>Insufficient Liquidity. Try with</Typography>
//       ) : null}
//       {showApproval() ? (
//         <div className="d-flex justify-content-center">
//           <GradientButton
//             onClick={approveTokens}
//             disabled={addingLiquidity || approving}
//             style={{ width: 186, height: 56 }}
//             className="d-flex align-middle justify-content-center"
//           >
//             <span style={{ lineHeight: "40px" }}>Approve</span>
//             {approving ? (
//               <span style={{ lineHeight: "35px" }}>
//                 <Spinner color="white" size="sm" className="ml-2" />
//               </span>
//             ) : null}
//           </GradientButton>
//         </div>
//       ) : null}
//       <div className="d-flex justify-content-center mt-4">
//         <GradientButton
//           onClick={handleClick}
//           disabled={
//             !toAmount ||
//             toAmount <= 0 ||
//             addingLiquidity ||
//             approving ||
//             showApproval() ||
//             token0Loading
//           }
//           style={{ width: addingLiquidity ? 212 : 186, height: 56 }}
//           className="d-flex align-middle justify-content-center"
//         >
//           <span style={{ lineHeight: "40px" }}>Add Liquidity</span>
//           {addingLiquidity ? (
//             <span style={{ lineHeight: "35px" }}>
//               <Spinner color="white" size="sm" className="ml-2" />
//             </span>
//           ) : null}
//         </GradientButton>
//       </div>
//       <PendingTxn txn={pendingTxn} />
//       <AddLiquiditySuccessModal
//         modalOpen={showSuccessModal}
//         setModalOpen={handleModalClose}
//         title="Liquidity added successfully!"
//         itemsList={[
//           {
//             label: token0Data?.symbol,
//             desc: `${fromAmount} ${token0Data?.symbol}`,
//           },
//           {
//             label: token1Data?.symbol,
//             desc: `${toAmount} ${token1Data?.symbol}`,
//           },
//         ]}
//         resultsList={[
//           {
//             label: "LP Received",
//             desc: `${liquidityReceived} ${token0Data?.symbol}-${token1Data?.symbol}`,
//           },
//         ]}
//         primaryAction={{ label: "Ok", onClick: handleModalClose }}
//       />
//     </Card>
//   );
// };

// export default AddLiquidityPanel;
const AddLiquidityPanel = () => {
  return <></>;
};

export default AddLiquidityPanel;
