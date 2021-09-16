import { useState } from "react";
import styled from "styled-components";
import {
  Row,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
} from "reactstrap";
import CurrencyInputPanel from "../../components/CurrencyInputPanelDropDown";
import CurrencyInputPanelLP from "../../components/CurrencyInputPanelLP";
// import CurrencyInputPanelSDAO from "../../components/CurrencyInputPanelSDAO";

import arrowDownIcon from "../../assets/img/icons/arrow-down.png";
import Typography from "../Typography";

import { DefaultButton, GradientButton } from "../Buttons";
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
import SDAOTokenStakingABI from "../../assets/constants/abi/SDAOTokenStaking.json";
import { abi as DynasetABI } from "../../assets/constants/abi/Dynaset.json";
import settingsIcon from "../../assets/img/icons/settings.svg";
import {
  defaultGasLimit,
  getGasPrice,
  defaultApprovalAmount,
} from "../../utils/ethereum";
import { ContractAddress } from "../../assets/constants/addresses";
import StakeSuccessModal from "./StakeSuccessModal";
import { useRouter } from "next/router";
import { Currencies } from "../../utils/currencies";
import { toast } from "react-toastify";
import { Spinner } from "reactstrap";
import BigNumber from "bignumber.js";
import { BigNumberComparision, toFraction } from "../../utils/balance";

const FeeBlock = styled(Row)`
  border-top: ${({ theme }) => `1px solid ${theme.color.grayLight}`};
  border-bottom: ${({ theme }) => `1px solid ${theme.color.grayLight}`};
  justify-content: space-between;
  width: 100%;
  margin: 20px 0;
  padding: 8px 0;
`;

const RewardStakePanel = ({ token, dynasetid, id, address, currencyid }) => {
  const [fromCurrency, setFromCurrency] = useState("ETH");
  const [fromCurrencyPrice, setFromCurrencyPrice] = useState("0");
  const [balance, setBalance] = useState(0);
  const [staking, setstaking] = useState(false);
  const [approving, setapproving] = useState(false);
  const [amounteth, setamountEth] = useState(0);
  const [toCurrency, setToCurrency] = useState("AGI");
  const [toCurrencyPrice, setToCurrencyPrice] = useState(0);
  const [approved, setApproved] = useState(false);

  const [fee, setFee] = useState(0);
  const [amount, setAmount] = useState();
  const { library, account } = useUser();
  const [showStakeSuccessModal, setShowStakeSuccessModal] = useState(false);
  const router = useRouter();

  let minABI = [
    // balanceOf
    {
      constant: true,
      inputs: [{ name: "_owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "balance", type: "uint256" }],
      type: "function",
    },
    // decimals
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [{ name: "", type: "uint8" }],
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "_spender",
          type: "address",
        },
        {
          name: "_value",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [
        {
          name: "",
          type: "bool",
        },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  const checkenoughtokens = async () => {
    const signer = await library.getSigner(account);

    const LPtoken = new ethers.Contract(address, minABI, signer);

    let balance = await LPtoken.balanceOf(account);
    const decimals = await LPtoken.callStatic.decimals();
    balance = toFraction(balance.toString(), decimals);

    const balanceComparedToStakeAmount = BigNumber(balance).comparedTo(
      BigNumber(fromCurrencyPrice)
    );
    console.log("balanceComparedToStakeAmount", balanceComparedToStakeAmount);
    // console.log("stakeAmount");
    // console.log(stakeAmount);

    //  console.log(BigNumber.from(fromCurrencyPrice.toString()) > balance);

    if (
      balanceComparedToStakeAmount == BigNumberComparision.LESSER ||
      balanceComparedToStakeAmount == BigNumberComparision.NAN
    ) {
      toast("Insufficient Balance", { type: "error" });
      return;
    } else {
      await approveTokens();
    }
  };
  const stakeToken = async () => {
    if (!approved) {
      return toast("Please Approve before staking");
    }

    try {
      setapproving(true);
      const signer = await library.getSigner(account);

      const stakingContract = new ethers.Contract(
        ContractAddress.FARMING_REWARD,
        SDAOTokenStakingABI,
        signer
      );
      const poolId = 0;
      const stakeAmount = web3.utils.toWei(fromCurrencyPrice.toString()); //
      const gasPrice = await getGasPrice();

      const tx = await stakingContract.deposit(id, stakeAmount, account, {
        gasLimit: defaultGasLimit,
        gasPrice,
      });

      console.log(`Transaction hash: ${tx.hash}`);

      const receipt = await tx.wait();

      console.log(`Transaction was mined in block ${receipt.blockNumber}`);
      setapproving(false);
      setShowStakeSuccessModal(true);
    } catch (error) {
      setapproving(false);
      console.log("error", error);
      alert("error: look console for details");
    }
  };

  const approveTokens = async () => {
    try {
      setapproving(true);
      const signer = await library.getSigner(account);

      const lpToken = new ethers.Contract(address, DynasetABI, signer);

      const gasPrice = await getGasPrice();
      const tx = await lpToken.approve(
        ContractAddress.FARMING_REWARD,
        defaultApprovalAmount,
        {
          gasLimit: defaultGasLimit,
          gasPrice,
        }
      );
      console.log(`Transaction hash: ${tx.hash}`);
      const receipt = await tx.wait();
      console.log(`Transaction was mined in block ${receipt.blockNumber}`);

      setApproved(true);
      setapproving(false);
    } catch (error) {
      toast(`Approval Failed: ${error.message}`, { type: "error" });
    } finally {
      setapproving(false);
    }
  };
  const getPendingRewards = async () => {
    const signer = await library.getSigner(account);
    const stakingContract = new ethers.Contract(
      ContractAddress.FARMING_REWARD,
      SDAOTokenStakingABI,
      signer
    );
    const poolId = 0;
    const gasPrice = await getGasPrice();
    const rewards = await stakingContract.pendingRewards(id, account, {
      gasLimit: defaultGasLimit,
      gasPrice,
    });

    return rewards;
  };

  const handleSubmit = async () => {
    // return await getPendingRewards();
    if (!approved) {
      try {
        await checkenoughtokens();
      } catch (error) {
        console.log("error", error);
        toast("error: look console for details");
      }
    } else {
      await setShowStakeSuccessModal(true);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between">
        <Typography size={20} style={{ textAlign: "left" }}>
          Start Farming
        </Typography>
      </div>
      <CurrencyInputPanelLP
        // balance={toCurrencyPrice}
        amount={fromCurrencyPrice}
        onAmountChange={setFromCurrencyPrice}
        selectedCurrency={currencyid}
      />

      <div className="d-flex justify-content-center">
        <DefaultButton
          background="white"
          color="black"
          borderColor="black"
          onClick={() => router.push("/farms")}
        >
          Cancel
        </DefaultButton>
        {!approved ? (
          <GradientButton
            disabled={staking || approving}
            onClick={handleSubmit}
          >
            Approve
            {approving ? (
              <span style={{ lineHeight: "35px" }}>
                <Spinner color="white" size="sm" className="ml-2" />
              </span>
            ) : null}
          </GradientButton>
        ) : (
          <GradientButton disabled={staking || approving} onClick={stakeToken}>
            Farm
            {approving ? (
              <span style={{ lineHeight: "35px" }}>
                <Spinner color="white" size="sm" className="ml-2" />
              </span>
            ) : null}
          </GradientButton>
        )}
      </div>
      <StakeSuccessModal
        modalOpen={showStakeSuccessModal}
        setModalOpen={setShowStakeSuccessModal}
        title="Token staked successfully!"
        itemsList={[
          { label: "Staked", desc: `${fromCurrencyPrice} ${token}` },
          { label: "APY (approx.)", desc: " 13 %" },
        ]}
        resultsList={[{ label: "", desc: "" }]}
        primaryAction={{ label: "Ok", onClick: () => router.push("/farms") }}
        secondaryAction={{
          label: "Withdraw more",
          onClick: () => setShowStakeSuccessModal(false),
        }}
      />
    </>
  );
};

RewardStakePanel.propTypes = {
  type: PropTypes.bool,
};

RewardStakePanel.defaultProps = {
  // If true, it means that it is the buy panel. If false, it is the swap panel.
  type: true,
};

export default RewardStakePanel;
