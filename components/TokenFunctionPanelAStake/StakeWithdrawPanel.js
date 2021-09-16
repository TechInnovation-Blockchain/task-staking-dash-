import { useState, useEffect } from "react";
import styled from "styled-components";
import { Row } from "reactstrap";
import CurrencyInputPanelSDAOLP from "../CurrencyInputPanelLP";
// import CurrencyInputPanelSDAO from "../CurrencyInputPanelSDAO";

import arrowDownIcon from "../../assets/img/icons/arrow-down.png";
import Typography from "../Typography";

import { DefaultButton, GradientButton } from "../Buttons";
import PropTypes from "prop-types";
import { useUser } from "contexts/UserContext";
import web3 from "web3";

import { ethers } from "ethers";
import SDAOTokenStakingABI from "../../assets/constants/abi/SDAOTokenStaking.json";
import {
  defaultGasLimit,
  getGasPrice,
  unitBlockTime,
} from "../../utils/ethereum";
import { ContractAddress } from "../../assets/constants/addresses";
import StakeSuccessModal from "./StakeSuccessModal";
import { useRouter } from "next/router";
import { Currencies } from "../../utils/currencies";
import { toast } from "react-toastify";

const FeeBlock = styled(Row)`
  border-top: ${({ theme }) => `1px solid ${theme.color.grayLight}`};
  border-bottom: ${({ theme }) => `1px solid ${theme.color.grayLight}`};
  justify-content: space-between;
  width: 100%;
  margin: 20px 0;
  padding: 8px 0;
`;

const StakeWithdrawPanel = ({ type, token, dynasetid }) => {
  const [toCurrencyPrice, setToCurrencyPrice] = useState(0);
  const [approved, setApproved] = useState(undefined);

  // const [fee, setFee] = useState(0);
  const [amount, setAmount] = useState("0");
  const [balance, setBalance] = useState("0");
  const { library, account } = useUser();
  const [showStakeSuccessModal, setShowStakeSuccessModal] = useState(false);
  const [pendingRewards, setPendingRewards] = useState("0");
  const router = useRouter();

  const withdrawAndHarvest = async () => {
    const signer = await library.getSigner(account);
    const stakingContract = new ethers.Contract(
      ContractAddress.STAKING_REWARDS,
      SDAOTokenStakingABI,
      signer
    );
    const poolId = 0;
    const withdrawAmount = parseFloat(amount.toString());
    const withdraw = web3.utils.toWei(amount.toString());
    console.log("withdrawAmount", withdrawAmount);
    const gasPrice = await getGasPrice();

    const rewards = await stakingContract.pendingRewards("0", account, {
      gasLimit: defaultGasLimit,
      gasPrice,
    });

    console.log(web3.utils.fromWei(rewards.toString()));

    if (
      web3.utils.fromWei(rewards.toString()) >= withdrawAmount ||
      web3.utils.fromWei("0") >= withdrawAmount
    ) {
      toast("issuficient withdraw amount");
    } else {
      const tx = await stakingContract.withdrawAndHarvest(
        "0",
        withdraw,
        account,
        {
          gasLimit: defaultGasLimit,
          gasPrice,
        }
      );

      console.log(`Transaction hash: ${tx.hash}`);
      const receipt = await tx.wait();
      console.log(`Transaction was mined in block ${receipt.blockNumber}`);
    }
  };

  const handleSubmit = async () => {
    // TODO: Validation
    try {
      await withdrawAndHarvest();
    } catch (error) {
      console.log("error", error);
      alert("error: look console for details");
    }
    // return await getPendingRewards();
    // if (typeof approved === "undefined") {
    //   try {
    //     await approveTokens();
    //     setApproved(toCurrencyPrice);
    //   } catch (error) {
    //     console.log("error", error);
    //     alert("error: look console for details");
    //   }
    // } else {
    //   await stakeToken();
    //   setShowStakeSuccessModal(true);
    // }
  };

  return (
    <>
      <div className="d-flex justify-content-between"></div>
      <CurrencyInputPanelSDAOLP
        balance={balance}
        amount={amount}
        onAmountChange={setAmount}
        selectedCurrency={Currencies.SDAO.id}
        label="SDAO"
      />
      <div className="d-flex justify-content-center">
        <DefaultButton
          background="white"
          color="black"
          borderColor="black"
          onClick={() => router.push("/staking")}
        >
          Cancel
        </DefaultButton>
        <GradientButton onClick={handleSubmit}>Withdraw</GradientButton>
      </div>
      <StakeSuccessModal
        modalOpen={showStakeSuccessModal}
        setModalOpen={setShowStakeSuccessModal}
        title="Withdraw done successfully!"
        itemsList={[
          { label: "", desc: "" },
          { label: "", desc: "" },
        ]}
        resultsList={[{ label: "Withdrawn", desc: "" }]}
        primaryAction={{ label: "Ok", onClick: () => router.push("/") }}
        secondaryAction={{
          label: "Withdraw more",
          onClick: () => setShowStakeSuccessModal(false),
        }}
      />
    </>
  );
};

StakeWithdrawPanel.propTypes = {
  type: PropTypes.bool,
};

StakeWithdrawPanel.defaultProps = {
  // If true, it means that it is the buy panel. If false, it is the swap panel.
  type: true,
};

export default StakeWithdrawPanel;
