import { useState } from "react";
import styled from "styled-components";
import {
  Row,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
} from "reactstrap";
import CurrencyInputPanel from "./CurrencyInputPanel";
import ArrowDownIcon from "../../assets/img/icons/arrow-down.png";
import Typography from "../Typography";

import { GradientButton } from "../Buttons";
import PropTypes from "prop-types";
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
import IUniswapV2Router02ABI from "../../assets/constants/abi/IUniswapV2Router02.json";
import SettingsIcon from "../../assets/img/icons/settings.svg";
import { getGasPrice } from "../../utils/ethereum";

const FeeBlock = styled(Row)`
  border-top: ${({ theme }) => `1px solid ${theme.color.grayLight}`};
  border-bottom: ${({ theme }) => `1px solid ${theme.color.grayLight}`};
  justify-content: space-between;
  width: 100%;
  margin: 20px 0;
  padding: 8px 0;
`;

const BuyPanel = ({ type, token, dynasetid }) => {
  const [fromCurrency, setFromCurrency] = useState("ETH");
  const [balance, setBalance] = useState(0);
  const [amounteth, setamountEth] = useState(0);
  const [toCurrency, setToCurrency] = useState("AGI");
  const [toCurrencyPrice, setToCurrencyPrice] = useState(0);

  const [fee, setFee] = useState(0);
  const [amount, setAmount] = useState();
  const { library, account } = useUser();

  const changeprice = async (e) => {
    const DAI = new Token(
      ChainId.ROPSTEN,
      "0x5e94577b949a56279637ff74dfcff2c28408f049",
      18
    );

    // note that you may want/need to handle this async code differently,
    // for example if top-level await is not an option
    const pair = await Fetcher.fetchPairData(DAI, WETH[DAI.chainId]);

    const route = new Route([pair], WETH[DAI.chainId]);

    const trade = new Trade(
      route,
      new TokenAmount(WETH[DAI.chainId], web3.utils.toWei(e)),
      TradeType.EXACT_INPUT
    );

    console.log("trade price");
    console.log(trade.executionPrice.invert().toSignificant(6));

    const price = e * trade.executionPrice.toSignificant(6);

    console.log(parseInt(price)); // 201.306

    setamountEth(e);
    setToCurrencyPrice(price);

    console.log(route.midPrice.invert().toSignificant(6)); // 0.00496756
  };

  const buy = async () => {
    const signer = await library.getSigner(account);

    const uniswap = new ethers.Contract(
      "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      IUniswapV2Router02ABI.abi,
      signer
    );

    //  const DAI = new Token(ChainId.ROPSTEN, dynasetid, 18);

    const DYN = new Token(
      ChainId.ROPSTEN,
      "0x5e94577b949a56279637ff74dfcff2c28408f049",
      18
    );

    // note that you may want/need to handle this async code differently,
    // for example if top-level await is not an option
    const pair = await Fetcher.fetchPairData(DYN, WETH[DYN.chainId]);

    const route = new Route([pair], WETH[DYN.chainId]);

    console.log(route.path);

    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

    console.log(web3.utils.toWei(toCurrencyPrice.toString(), "gwei"));
    console.log(web3.utils.toWei(amounteth.toString(), "ether"));
    const gasPrice = await getGasPrice();
    const tx = await uniswap.swapExactETHForTokens(
      web3.utils.toWei(toCurrencyPrice.toString(), "gwei"),
      [route.path[0].address, route.path[1].address],
      account,
      deadline,
      {
        value: web3.utils.toWei(amounteth.toString(), "ether"),
        gasPrice,
      }
    );

    console.log(`Transaction hash: ${tx.hash}`);

    const receipt = await tx.wait();

    console.log(`Transaction was mined in block ${receipt.blockNumber}`);
  };

  return (
    <>
      <div className="d-flex justify-content-between">
        <Typography size={20} style={{ textAlign: "left" }}>
          Swap
        </Typography>
        <SettingsIcon />
      </div>

      <CurrencyInputPanel
        balance={balance}
        currency={fromCurrency}
        onChange={changeprice}
        label="From"
      />

      <div className="text-align-center">
        <ArrowDownIcon className="my-3" />
      </div>

      <CurrencyInputPanel
        balance={toCurrencyPrice}
        currency={token}
        onChange={changeprice}
        label="To"
      />

      <FeeBlock>
        <Typography size={14}>Fee:</Typography>
        <Typography size={14}>{fee.toFixed(2)} ETH</Typography>
        <Typography size={14}>Slipage:</Typography>
        <Typography size={14}>{fee.toFixed(2)} ETH</Typography>
      </FeeBlock>

      <div className="d-flex justify-content-center">
        <GradientButton onClick={buy}>Swap {token}</GradientButton>
      </div>
    </>
  );
};

BuyPanel.propTypes = {
  type: PropTypes.bool,
};

BuyPanel.defaultProps = {
  // If true, it means that it is the buy panel. If false, it is the swap panel.
  type: true,
};

export default BuyPanel;
