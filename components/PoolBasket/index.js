// import { Card, Col, Row } from "reactstrap";
// // import styled from "styled-components";
// import { OutlinedButton } from "../Buttons";
// import Typography from "../Typography";
// import { useRouter } from "next/router";
// import { DetailLabel } from "../TokenFunctionPanelStake/Label";
// import { Token, Fetcher } from "@uniswap/sdk";
// import IUniswapV2ERC20 from "@uniswap/v2-core/build/IUniswapV2ERC20.json";
// import { useUser } from "contexts/UserContext";
// import { useCallback, useEffect, useState } from "react";
// // import { ethers } from "ethers";
// // import { ContractAddress } from "../../assets/constants/addresses";
// // import StakingRewardsABI from "../../assets/constants/abi/StakingRewards.json";
// // import web3 from "web3";
// // import { Currencies, getErc20TokenById } from "../../utils/currencies";

// // import { TOKEN_DAY_DATAS_QUERY } from "../../queries/tokenDailyAggregated";
// // import { useQuery } from "@apollo/client";
// // import { ETH_PRICE_QUERY, TOKEN_QUERY } from "../../queries/price";
// import BigNumber from "bignumber.js";
// import { useQuery } from "@apollo/client";
// import { USER_LIQUIDITY_QUERY } from "../../queries/liquidity";
// import { unitBlockTime } from "../../utils/ethereum";
// import { toast } from "react-toastify";
// import { ethers } from "ethers";
// // import web3 from "web3";
// // import { Currencies, getErc20TokenById } from "../../utils/currencies";
// import { toFraction } from "../../utils/balance";
// // import UniswapV2Pair from "@uniswap/v2-core/build/UniswapV2Pair.json";

// // const CustomProgress = styled(Progress)`
// //   .progress-bar {
// //     background-color: ${({ theme }) => `${theme.color.interactive3} !important`};
// //   }
// //   height: 8px !important;
// //   margin-bottom: 10px !important;
// // `;

// // function useTokenDetails() {
// //   const [details, setDetails] = useState({ loading: false, data: undefined, error: undefined });

// //   function fetchDetails() {

// //   }

// //   useEffect(() => fetchDetails(), []);

// //   return { ...details, refetch: fetchDetails };
// // }

// const ForgeBasket = ({ title, apy, tokens }) => {
//   const router = useRouter();
//   // const account = "0x0ad7a09575e3ec4c109c4faa3be7cdafc5a4adba";
//   // const chainId = 1;
//   // const poolAddress = "0x424485f89ea52839fdb30640eb7dd7e0078e12fb";
//   const [poolAddress, setPoolAddress] = useState("");
//   const { account, chainId, library } = useUser();
//   const tokenPair = tokens[chainId];
//   const [balance, setBalance] = useState("...");
//   const [share, setShare] = useState("...");
//   // const { loading: ethLoading, data: ethPriceData } = useQuery(ETH_PRICE_QUERY);
//   // const { loading: tokenDayDatasLoading, data: tokenDayDatas } = useQuery(TOKEN_QUERY, {
//   //   variables: { tokenAddress: ContractAddress.SDAO },
//   // });
//   const [showError, setShowError] = useState(false);

//   const {
//     loading: userLiquidityLoading,
//     data: userLiquidityData,
//     error: userLiquidityError,
//     refetch: userLiquidityRefetch,
//   } = useQuery(USER_LIQUIDITY_QUERY, {
//     skip: !account || !library || !poolAddress,
//     variables: {
//       userAddress: account || "",
//       userAndPairAddress: `${poolAddress}-${account}`,
//       pairAddress: poolAddress || "",
//     },
//     pollInterval: unitBlockTime,
//   });

//   useEffect(() => userLiquidityRefetch(), [chainId]);

//   if (userLiquidityError) {
//     toast(userLiquidityError.message, { type: "error" });
//   }

//   // console.table(ethPriceData?.bundles);

//   useEffect(() => getPairData(), []);

//   useEffect(() => {
//     if (!chainId) return;
//     getPairData();
//   }, [tokens, chainId, account]);

//   const getPairData = async () => {
//     try {
//       if (!chainId || !account || !library) return;

//       if (!tokenPair) throw new Error("Token addresses not available");
//       setShowError(false);
//       const token1 = new Token(chainId, tokenPair[0], 18);
//       const token2 = new Token(chainId, tokenPair[1], 18);
//       const pair = await Fetcher.fetchPairData(token1, token2);

//       console.log(title, "pair dataa", pair);
//       const liquidityToken = pair.liquidityToken;
//       setPoolAddress(liquidityToken.address.toLowerCase());

//       // const reserve0 = pair.reserve0;
//       // const reserve1 = pair.reserve1;
//       // console.log("liquidityToken", liquidityToken.address);
//       // console.log("reserve0", reserve0.toSignificant(6));
//       // console.log("reserve1", reserve1.toSignificant(6));
//       // BALANCE OF USER IN LIQUIDITY TOKEN
//       const signer = await library.getSigner(account);
//       const lpToken = new ethers.Contract(
//         liquidityToken.address.toLowerCase(),
//         IUniswapV2ERC20.abi,
//         signer
//       );
//       console.log(title, "lpToken", lpToken);
//       const lpDecimals = await lpToken.callStatic.decimals();
//       let lpBalance = await lpToken.callStatic.balanceOf(account);
//       lpBalance = toFraction(lpBalance.toString(), lpDecimals);
//       console.log(title, "baalanceeeee", lpBalance);
//       setBalance(lpBalance);

//       let totalSupply = await lpToken.callStatic.totalSupply();
//       totalSupply = toFraction(totalSupply.toString(), lpDecimals);

//       const percentShare = BigNumber(lpBalance)
//         .dividedBy(BigNumber(totalSupply))
//         .multipliedBy(100)
//         .decimalPlaces(4)
//         .toString();
//       setShare(percentShare);
//       console.log(title, "percentShare web3 calc", percentShare);

//       // console.log("totalSupply from Web3", web3.utils.fromWei(totalSupply.toString()));
//       // // setBalance(web3.utils.fromWei(lpBalance.toString()));
//       // // BALANCE OF LIQUIDITY IN SDAO
//       // console.log("liquidityToken.address", liquidityToken.address)
//       // const token1Contract = new ethers.Contract(token1.address, IUniswapV2ERC20.abi, signer);
//       // const lpSDAOBalance = await token1Contract.callStatic.balanceOf(liquidityToken.address);
//       // console.log("lpSDAOBalance in token1", web3.utils.fromWei(lpSDAOBalance.toString()));

//       // const ethBalance = await library.getBalance(liquidityToken.address);
//       // console.log("ethBalance", ethBalance.toString());
//       // // CALCULATE YOUR SHARE PERCENT
//       // console.log("balance", lpBalance.toString());
//       // console.log("totalSupply", totalSupply.toString());
//       // const percent = BigNumber(lpBalance.toString()).div(BigNumber(totalSupply.toString())).multipliedBy(100);
//       // // setShare(percent.toString());
//       // console.log();
//     } catch (error) {
//       console.log(title, "pair erorrrr", error);
//       toast(error.message, { type: "error" });
//       setShowError(true);
//     }
//   };

//   const DepositTypography = () => (
//     <div className="d-flex justify-content-between">
//       <Typography color="text2" size={14} weight={400}>
//         SDAO LP deposited
//       </Typography>
//       <Typography color="text1" size={14} weight={600}>
//         0.0000 LP
//       </Typography>
//     </div>
//   );

//   // const userLiqudityTokenBalance = userLiquidityLoading
//   //   ? "loading"
//   //   : userLiquidityData?.user?.liquidityPositions[0]?.liquidityTokenBalance || "0";

//   const totalLiquidity = userLiquidityLoading
//     ? "loading"
//     : userLiquidityData?.pair?.reserveUSD
//     ? BigNumber(userLiquidityData.pair.reserveUSD).decimalPlaces(4).toString()
//     : "0";

//   // DEPRECATED: Will be removed once the state `share` is tested
//   const userLiquidityShare = useCallback(() => {
//     if (userLiquidityLoading) return "loading";
//     let totalSupply = userLiquidityData?.pair?.totalSupply;
//     console.log("totalSupply", totalSupply);
//     if (!balance || !totalSupply) return "0";
//     totalSupply = new BigNumber(totalSupply);
//     return BigNumber(balance).div(totalSupply).multipliedBy(100).toString();
//   }, [userLiquidityData?.pair?.totalSupply])();

//   console.log(title, "userLiquidityShare", userLiquidityShare);

//   if (showError || !!userLiquidityError) {
//     return (
//       <Card className="p-4 forge-card">
//         <Row>
//           <Col className="col-auto">
//             <img
//               src="https://www.singularitydao.ai/file/2021/04/singularitydao-image.png"
//               width={40}
//               height={40}
//             />
//           </Col>
//           <Col>
//             <Typography color="text1" size={24} weight={600}>
//               {title}
//             </Typography>
//           </Col>
//         </Row>
//         <Row>
//           <Typography size="14" weight="400" color="text2">
//             Error: Unable to fetch the details of the liquidity pool. Please
//             reload / try again
//           </Typography>
//         </Row>
//       </Card>
//     );
//   }

//   if (userLiquidityLoading || !poolAddress) {
//     return (
//       <Card className="p-4 forge-card">
//         <p>Loading</p>
//       </Card>
//     );
//   }

//   const routeLink = tokenPair
//     ? `pools/add/${tokenPair[0]}/${tokenPair[1]}`
//     : "#";

//   return (
//     <Card className="p-4 forge-card">
//       <Row>
//         <Col className="col-auto">
//           <img
//             src="https://www.singularitydao.ai/file/2021/04/singularitydao-image.png"
//             width={40}
//             height={40}
//           />
//         </Col>
//         <Col>
//           <Typography color="text1" size={24} weight={600}>
//             {title}
//           </Typography>
//         </Col>
//       </Row>
//       <div className="mt-2">
//         <DetailLabel title="Liquidity" desc={`$ ${totalLiquidity}`} />
//         <DetailLabel title="APY (approx.)" desc={`${apy} %`} />
//         <DetailLabel title="Your share" desc={`${share ? share : 0} %`} />
//         <DetailLabel title="Balance" desc={`${balance} ${title}`} />
//       </div>

//       <div className="text-align-center mt-3">
//         <OutlinedButton
//           color="interactive2"
//           onClick={() => router.push({ pathname: routeLink })}
//         >
//           Add Liquidity
//         </OutlinedButton>
//       </div>
//     </Card>
//   );
// };

// ForgeBasket.defaultProps = {
//   title: "",
//   apy: "'",
//   tokens: {},
// };

// export default ForgeBasket;
const ForgeBasket = () => {
  return <></>;
};

export default ForgeBasket;
