import { useState } from "react";
import styled from "styled-components";
import { Row } from "reactstrap";
import CurrencyInputPanel from "../CurrencyInputPanel";
import Typography from "../Typography";
import { GradientButton } from "../Buttons";
import PropTypes from "prop-types";
import TokenInputPanel from "../TokenInputPanelBurn";
import { useUser } from "../../contexts/UserContext";
import web3 from "web3";
import {
  ChainId,
  Token,
  WETH,
  Trade,
  TokenAmount,
  TradeType,
  Fetcher,
  Route,
  Percent,
} from "@uniswap/sdk";
import { ethers } from "ethers";
import DynasetABI from "../../assets/constants/abi/Dynaset.json";

import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";
import { getGasPrice } from "../../utils/ethereum";

const TokensBlock = styled(Row)`
  border-top: ${({ theme }) => `1px solid ${theme.color.grayLight}`};
  border-bottom: ${({ theme }) => `1px solid ${theme.color.grayLight}`};
  justify-content: space-between;
  width: 100%;
  padding: 8px 0;
  margin-bottom: 20px;
`;

const BurnPanel = ({ token, ptokens, type, dynasetid }) => {
  const [receiveCurrency, setReceiveCurrency] = useState("ETH");
  const [balance, setBalance] = useState(0);
  const [tokens, setTokens] = useState([]);
  const [amounteth, setamountEth] = useState(0);
  const [toCurrencies, setToCurrencies] = useState([]);
  const [ratios, setRatios] = useState([
    "00000000000000000000000",
    "00000000000000000000000",
    "00000000000000000000000",
  ]);

  const { library, account } = useUser();

  console.log(ptokens);

  const changeprice = async (e) => {
    const signer = await library.getSigner(account);

    const Dynaset = new ethers.Contract(dynasetid, DynasetABI.abi, signer);

    //  const DAI = new Token(ChainId.ROPSTEN, dynasetid, 18);

    const totalsupply = await Dynaset.totalSupply();
    console.log(" dynaset totalsupply:" + totalsupply.toString());

    const ratio = ethers.BigNumber.from(e) / totalsupply;

    console.log("ratio");
    console.log(ratio.toString());

    setToCurrencies([]);

    const results = await Promise.all(
      ptokens.map(async (i) => {
        let coin = i.token;
        let token = ratio * i.balance;
        // console.log(web3.utils.toWei(token.toString()));
        return {
          symbol: coin.symbol,
          ratio: ethers.BigNumber.from(token).toString(),
          address: coin.id,
        };
      })
    );

    // const resultsbuy = await Promise.all(ptokens.map(async (i) => {
    //   let coin = i.token;
    //   let token = ratio s* i.balance;

    //   return web3.utils.toWei(ethers.BigNumber.from(token).toString()).toString();
    // }));

    // console.log(resultsbuy);

    // console.log(results);
    setamountEth(e);

    setToCurrencies(results);
    //setRatios(resultsbuy);
  };

  const burn = async () => {
    const signer = await library.getSigner(account);

    const Dynaset = new ethers.Contract(dynasetid, DynasetABI.abi, signer);

    //  const DAI = new Token(ChainId.ROPSTEN, dynasetid, 18);

    const totalsupply = await Dynaset.totalSupply();

    console.log(" dynaset totalsupply:");

    //  var total = ethers.BigNumber.from();

    console.log(totalsupply.toString());
    const gasPrice = await getGasPrice();
    const tx = await Dynaset.exitPool(web3.utils.toWei(amounteth), ratios, {
      gasLimit: 210000,
      gasPrice,
    });

    console.log(`Transaction hash: ${tx.hash}`);

    const receipt = await tx.wait();

    console.log(`Transaction was mined in block ${receipt.blockNumber}`);
  };

  return (
    <>
      <CurrencyInputPanel
        balance={balance}
        onChange={changeprice}
        currency={token}
        label={"Destroy"}
      />

      <TokensBlock>
        {toCurrencies &&
          toCurrencies.map((token) => {
            let coin = token;

            return (
              <TokenInputPanel
                currency={coin.symbol}
                ratio={coin.ratio}
                address={coin.address}
              />
            );
          })}
      </TokensBlock>

      <GradientButton onClick={burn}>Burn</GradientButton>
    </>
  );
};

BurnPanel.propTypes = {
  tokens: PropTypes.arrayOf(PropTypes.object),
  type: PropTypes.bool,
};

BurnPanel.defaultProps = {
  // If true, it means that it is the mint panel. If false, it is the burn panel.
  type: true,
};

export default BurnPanel;
