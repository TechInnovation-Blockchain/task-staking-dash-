import { CloseIconButton, DefaultButton, PrimaryButton } from "../Buttons";
import Typography from "../Typography";
import styled from "styled-components";
import Card from "../Card";
import {
  formatAddress,
  getFormattedDateMonthAndYear,
  getFormattedNumber,
} from "../../utils/formatters";
import { stakingPlans } from "../../utils/constants";
import { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { TextField as MTextField } from "@material-ui/core";
import { Col, Row } from "reactstrap";
import DefaultModal from "../Modals/DefaultModal";
import {
  defaultGasLimit,
  fetchLockedBalance,
  getGasPrice,
} from "../../utils/ethereum";
import { ethers } from "ethers";
import { ContractAddress } from "../../assets/constants/addresses";
import { useEthereum } from "../../contexts/EthereumContext";
import { fromFraction } from "../../utils/balance";

const SummaryWrapper = styled.div`
  border: ${({ theme }) => `1px solid ${theme.color.monoGrey2}`};
  padding: 12px;
  border-radius: 4px;
`;

const TextField = styled(MTextField)`
  margin-top: -2px !important;
  margin-bottom: -5px !important;
  width: 100%;

  & .MuiInputBase-input {
    color: #fff;
    font-size: 12px;
  }
  & label {
    color: #888a8f;
  }
  & label.Mui-focused {
    color: #888a8f;
  }

  & .MuiInput-underline:after {
    border-bottom-color: green;
  }

  & .MuiOutlinedInput-root {
    & fieldset {
      border-color: #2f3641;
    }
    &:hover fieldset {
      border-color: #2f3641;
    }
    &.Mui-focused fieldset {
      border-color: #2f3641;
    }
  }
`;

const StakingSummary = ({
  currentTier,
  currentAPY,
  lockPeriod,
  currentStakedBalance,
  currentStakingRewardBalance,
}) => {
  const { library, account } = useUser();
  const [tokenAmount, setTokenAmount] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [unStakeAmount, setUnStakeAmount] = useState(0);
  const { stakingContract } = useEthereum();

  const handleUnlock = async () => {
    if (!stakingContract) return;

    const gasPrice = await getGasPrice();

    const lockedAmount = fromFraction(unStakeAmount);

    const tx = await stakingContract.withdraw(lockedAmount, {
      gasLimit: defaultGasLimit,
      gasPrice,
    });

    console.log(`Transaction hash: ${tx.hash}`);

    const receipt = await tx.wait();
    console.log(`Transaction was mined in block ${receipt.blockNumber}`);

    setIsDialogOpen(false);
  };

  useEffect(() => {
    const fetchBalance = async () => {
      if (!library || !account) return;

      const amount = await fetchLockedBalance(account, library);

      setTokenAmount(amount);
      setUnStakeAmount(amount);
    };

    fetchBalance();
  }, [account, library]);

  const handleInputChange = (event) => {
    setUnStakeAmount(event.target.value);
  };

  return (
    <>
      <div className="d-flex justify-content-between">
        <Typography color="monoWhite" size={20}>
          Staking Summary
        </Typography>
        <DefaultButton
          size={10}
          background="monoGrey2"
          color="monoWhite"
          onClick={() => setIsDialogOpen(true)}
        >
          Unstake
        </DefaultButton>
      </div>
      <Row className="mt-3">
        <Col lg={4}>
          <SummaryWrapper>
            <Typography size={12} color="textGrey">
              Currently in staking
            </Typography>
            <Typography size={20} color="monoWhite">
              {getFormattedNumber(currentStakedBalance)} NIOX
            </Typography>
            <Typography size={10} color="textGrey" weight={400}>
              In staking till {getFormattedDateMonthAndYear(lockPeriod)}
            </Typography>
          </SummaryWrapper>
        </Col>
        <Col lg={4}>
          <SummaryWrapper>
            <Typography size={12} color="textGrey">
              Current APY
            </Typography>
            <Typography size={20} color="monoWhite">
              {getFormattedNumber(currentAPY)}%
            </Typography>
            <Typography size={10} color="textGrey" weight={400}>
              Reward multiplier: {stakingPlans[currentTier].multiplier}x
            </Typography>
          </SummaryWrapper>
        </Col>
        <Col lg={4}>
          <SummaryWrapper>
            <Typography size={12} color="textGrey">
              Current Staking Reward
            </Typography>
            <Typography
              size={20}
              color="monoWhite"
              className="d-flex align-items-center"
            >
              {currentStakingRewardBalance ? (
                <Typography color="greenBuy" className="mr-1">
                  +
                </Typography>
              ) : (
                ""
              )}
              {getFormattedNumber(currentStakingRewardBalance)} NIOX
            </Typography>
            <Typography size={10} color="textGrey" weight={400}>
              Since 20.06.2021
            </Typography>
          </SummaryWrapper>
        </Col>
      </Row>

      <DefaultModal
        className="modal-dialog-centered"
        isOpen={isDialogOpen}
        toggle={() => setIsDialogOpen(false)}
      >
        <div className="modal-body p-3">
          <div className="d-flex justify-content-between">
            <Typography size={20} weight={600} color="monoWhite">
              Unstake NIOX
            </Typography>
            <CloseIconButton onClick={() => setIsDialogOpen(false)} />
          </div>
          <Typography
            color="textGrey"
            size={14}
            weight={400}
            className="mt-3 mb-3"
          >
            Please check the information below
          </Typography>
          <TextField
            id="standard-read-only-input"
            label="Amount to unstake"
            defaultValue={tokenAmount}
            required
            variant="outlined"
            onChange={handleInputChange}
          />
          <div className="d-flex mt-3">
            <Typography
              color="textGrey"
              size={12}
              weight={600}
              className="mr-1"
            >
              Receiving address:
            </Typography>
            <Typography color="monoWhite" size={12} weight={600}>
              {formatAddress(account)}
            </Typography>
          </div>

          <Row className="mt-3">
            <Col>
              <DefaultButton
                className="w-100"
                color="greenMain"
                size={12}
                weight={600}
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </DefaultButton>
            </Col>
            <Col>
              <PrimaryButton onClick={handleUnlock} className="w-100">
                Unstake
              </PrimaryButton>
            </Col>
          </Row>
        </div>
      </DefaultModal>
    </>
  );
};

export default StakingSummary;
