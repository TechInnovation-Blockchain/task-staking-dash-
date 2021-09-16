import GasIcon from "../../assets/img/icons/gas-icon.svg";
import { Col, Row, Modal as ReactModal } from "reactstrap";
import Typography from "../Typography";
import {
  CloseIconButton,
  DefaultButton,
  LinkButton,
  PrimaryButton,
} from "../Buttons";
import styled from "styled-components";
import {
  getFormattedDate,
  getFormattedDateMonthAndYear,
  getFormattedNumber,
  getUnformattedNumber,
} from "../../utils/formatters";
import { ethers } from "ethers";
import { useUser } from "../../contexts/UserContext";
import BigNumber from "bignumber.js";
import { BigNumberComparision, fromFraction } from "../../utils/balance";
import { ContractAddress } from "../../assets/constants/addresses";
import ERC20ABI from "../../assets/constants/abi/ERC20ABI.json";
import StakingRewardsABI from "../../assets/constants/abi/StakingRewards.json";

import {
  defaultGasLimit,
  getApproximateStakingRewards,
  getGasPrice,
} from "../../utils/ethereum";
import { useEffect, useState } from "react";
import {
  CircularProgress,
  makeStyles,
  Step,
  StepConnector as MStepConnector,
  StepLabel,
  Stepper as MStepper,
  withStyles,
} from "@material-ui/core";
import { Check } from "@material-ui/icons";
import clsx from "clsx";
import ArrowUpIcon from "../../assets/img/icons/arrow_up_right.svg";
import EllipseIcon from "../../assets/img/icons/Ellipse 96.svg";
import { useRouter } from "next/router";
import { stakingPlans } from "../../utils/constants";

const steps = ["Approve", "Confirmed", "Completed"];
const transactionUrlPrefix = "https://kovan.etherscan.io/tx/";
const CheckIcon = styled(Check)`
  margin-bottom: 3px;
  margin-left: 3px;
`;

const Stepper = styled(MStepper)`
  background: transparent !important;
`;

const Modal = styled(ReactModal)`
  > .modal-content {
    background: ${({ theme }) => theme.color.monoGrey1};
    box-shadow: 0px 2px 2px rgba(6, 19, 36, 0.24);
  }
`;

const StepConnector = withStyles({
  alternativeLabel: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  active: {
    "& $line": {
      borderColor: "#27C29D",
    },
  },
  completed: {
    "& $line": {
      borderColor: "#27C29D",
    },
  },
  line: {
    borderColor: "#2F3641",
    borderTopWidth: 1,
    borderRadius: 1,
  },
})(MStepConnector);

const useStepIconStyles = makeStyles({
  root: {
    color: "#2F3641",
    display: "flex",
    height: 22,
    alignItems: "center",
  },
  active: {
    color: "#27C29D",
  },
  circle: {
    width: 25,
    height: 25,
    borderRadius: "50%",
    backgroundColor: "transparent",
    border: "1px solid #2F3641",
  },
  completed: {
    color: "#fff",
    zIndex: 1,
    fontSize: 18,
  },
  completedBackground: {
    backgroundColor: "#27C29D",
    border: "1px solid #27C29D",
  },
  activeCircle: {
    border: "1px solid #27C29D",
  },
  label: {
    "& .MuiStepLabel-label": {
      color: "#888A8F",
    },
    "& .MuiStepLabel-active, & .MuiStepLabel-completed": {
      color: "#27C29D",
    },
  },
});

function StepIconComponent(props) {
  const classes = useStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? (
        <div className={clsx(classes.circle, classes.completedBackground)}>
          <CheckIcon className={classes.completed} />
        </div>
      ) : (
        <div
          className={clsx(classes.circle, {
            [classes.activeCircle]: active,
          })}
        />
      )}
    </div>
  );
}
// Inspired by the former Facebook spinners.
const useStylesFacebook = makeStyles((theme) => ({
  root: {
    position: "relative",
  },
  bottom: {
    color: "#27C29D",
  },
}));

function FacebookCircularProgress(props) {
  const classes = useStylesFacebook();

  return (
    <div className={classes.root}>
      <CircularProgress
        className={classes.bottom}
        size={30}
        thickness={4}
        {...props}
        value={100}
      />
    </div>
  );
}

const StakingModal = ({
  isDialogOpen,
  setIsDialogOpen,
  stakingBalance,
  tier,
  currentAPY,
  lockPeriod,
}) => {
  const { account, library } = useUser();
  const [currentTab, setCurrentTab] = useState(0);
  const classes = useStepIconStyles();
  const [transactionHash, setTransactionHash] = useState("");
  const router = useRouter();
  const [approximateStakingRewards, setApproximateStakingRewards] = useState(0);

  useEffect(() => {
    if (isDialogOpen) setCurrentTab(0);
  }, [isDialogOpen]);

  useEffect(() => {
    setApproximateStakingRewards(
      getApproximateStakingRewards(stakingBalance, currentAPY)
    );
  }, [stakingBalance]);

  const checkIfAllowanceIsGood = async () => {
    let allowance = await getAllowance();
    allowance = BigNumber(allowance.toString());
    console.log("allowance:", allowance);

    const _stakingBalance = fromFraction(stakingBalance);

    if (
      allowance.comparedTo(BigNumber(_stakingBalance)) ==
      BigNumberComparision.LESSER
    ) {
      // If the allowance is lesser than the staking balance, should increase it before.
      return false;
    }

    return true;
  };

  const approveStaking = async () => {
    if (!library || !account) return;

    const _stakingBalance = fromFraction(stakingBalance);

    const signer = await library.getSigner(account);
    const stakingContract = new ethers.Contract(
      ContractAddress.STAKING_REWARDS,
      StakingRewardsABI,
      signer
    );

    const gasPrice = await getGasPrice();

    try {
      const tx = await stakingContract.stake(_stakingBalance, {
        gasLimit: defaultGasLimit,
        gasPrice,
      });

      console.log(`Transaction hash: ${tx.hash}`);

      setTransactionHash(tx.hash);

      const receipt = await tx.wait();
      console.log(`Transaction was mined in block ${receipt.blockNumber}`);

      setCurrentTab(4);
    } catch {
      setCurrentTab(2);
    }
  };

  const getAllowance = async () => {
    const signer = await library.getSigner(account);
    const tokenContract = new ethers.Contract(
      ContractAddress.DEV,
      ERC20ABI,
      signer
    );
    const allowance = await tokenContract.allowance(
      account,
      ContractAddress.STAKING_REWARDS
    );

    return allowance;
  };

  const approveTokens = async () => {
    console.log("approving");
    const signer = await library.getSigner(account);
    const tokenContract = new ethers.Contract(
      ContractAddress.DEV,
      ERC20ABI,
      signer
    );
    const gasPrice = await getGasPrice();
    const allowance = BigNumber(fromFraction(stakingBalance, 4)).plus(
      5000000000
    );

    try {
      const tx = await tokenContract.approve(
        ContractAddress.STAKING_REWARDS,
        allowance.toString(),
        {
          gasLimit: defaultGasLimit,
          gasPrice,
        }
      );
      console.log(`Transaction hash: ${tx.hash}`);
      setTransactionHash(tx.hash);

      const receipt = await tx.wait();
      console.log(`Transaction was mined in block ${receipt.blockNumber}`);

      setCurrentTab(2);
    } catch (error) {
      setCurrentTab(0);
    }
  };

  const handleNextStep = async () => {
    setCurrentTab(currentTab + 1);

    if (currentTab === 0) {
      await approveTokens();
    } else if (currentTab === 2) {
      await approveStaking();
    }
  };

  const openTransaction = () => {
    window.open(transactionUrlPrefix + transactionHash, "_blank");
  };

  return (
    <Modal
      className="modal-dialog-centered"
      isOpen={isDialogOpen}
      toggle={() => setIsDialogOpen(false)}
    >
      <div className="modal-body p-3">
        <div className="d-flex justify-content-between">
          <Typography size={20} weight={600} color="monoWhite">
            {currentTab === 0
              ? "Staking Overview"
              : currentTab != 4
              ? "Transaction in process"
              : ""}
          </Typography>
          <CloseIconButton onClick={() => setIsDialogOpen(false)} />
        </div>
        {currentTab === 0 && (
          <div>
            <div className="text-align-center mt-4 mb-3">
              <GasIcon />
              <Typography color="white" size={14} weight={600} className="mt-3">
                Deposits process consists of two transcations
              </Typography>
              <Typography color="textGrey" size={14} weight={400}>
                Please check the information below
              </Typography>
            </div>
            <div className="d-flex mt-3 justify-content-between">
              <Typography
                color="textGrey"
                size={12}
                weight={600}
                className="mr-1"
              >
                Approve deposit:
              </Typography>
              <Typography color="monoWhite" size={12} weight={600}>
                {getFormattedNumber(stakingBalance)} NIOX
              </Typography>
            </div>

            <div className="d-flex mt-2 justify-content-between">
              <Typography color="textGrey" size={12} weight={600}>
                Approximate APY:
              </Typography>
              <div className="d-flex">
                <Typography
                  color="greenMain"
                  size={12}
                  weight={600}
                  className="ml-2"
                >
                  {getFormattedNumber(currentAPY)}%
                </Typography>
                <Typography
                  color="monoWhite"
                  size={12}
                  weight={600}
                  className="ml-1"
                >
                  (~{getFormattedNumber(approximateStakingRewards)} NIOX)
                </Typography>
              </div>
            </div>

            <div className="d-flex mt-1 justify-content-between">
              <Typography
                color="textGrey"
                size={12}
                weight={600}
                className="mr-1"
              >
                Tier:
              </Typography>
              <Typography color="greenMain" size={12} weight={600}>
                {stakingPlans[tier]?.name}
              </Typography>
            </div>

            <div className="d-flex mt-1 justify-content-between">
              <Typography
                color="textGrey"
                size={12}
                weight={600}
                className="mr-1"
              >
                Niox locked until:
              </Typography>
              <Typography color="monoWhite" size={12} weight={600}>
                {getFormattedDateMonthAndYear(lockPeriod)}
              </Typography>
            </div>

            <div className="d-flex mt-6 justify-content-between">
              <Typography
                color="textGrey"
                size={12}
                weight={600}
                className="mr-1"
              >
                Network Fees:
              </Typography>
              <Typography color="monoWhite" size={12} weight={600}>
                ~0.00058544 Ether
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
                <PrimaryButton onClick={handleNextStep} className="w-100">
                  Continue
                </PrimaryButton>
              </Col>
            </Row>
          </div>
        )}
        {currentTab !== 0 && currentTab !== 4 && (
          <Stepper
            alternativeLabel
            activeStep={currentTab - 1}
            connector={<StepConnector />}
          >
            {steps.map((label) => (
              <Step key={label} key={label}>
                <StepLabel
                  StepIconComponent={StepIconComponent}
                  classes={{
                    labelContainer: classes.label,
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        )}
        {currentTab == 1 || currentTab == 3 ? (
          <div className="text-align-center">
            <div className="my-8">
              <FacebookCircularProgress />
              <Typography size={20} color="monoWhite">
                Preparing an order
              </Typography>
            </div>
            {transactionHash && (
              <div>
                <LinkButton
                  color="monoGrey4"
                  size={14}
                  weight={400}
                  onClick={openTransaction}
                >
                  View Transaction
                  <ArrowUpIcon />
                </LinkButton>
              </div>
            )}
          </div>
        ) : currentTab == 2 ? (
          <div>
            <div className="text-align-center my-6">
              <Typography size={20} color="monoWhite">
                Confirm the Deposit
              </Typography>
              <Typography size={14} color="textGrey">
                You need to confirm one more step to complete the depost
                transaction.
              </Typography>
            </div>

            <div className="d-flex justify-content-between">
              <Typography
                color="textGrey"
                size={12}
                weight={600}
                className="mr-1"
              >
                Network Fees:
              </Typography>
              <Typography color="monoWhite" size={12} weight={600}>
                ~0.00211504 Ether
              </Typography>
            </div>

            <PrimaryButton onClick={handleNextStep} className="w-100 mt-3">
              Continue
            </PrimaryButton>
          </div>
        ) : currentTab == 4 ? (
          <div>
            <div className="text-align-center my-8">
              <EllipseIcon />
              <Typography
                size={12}
                weight={400}
                color="monoGrey4"
                className="mt-2"
              >
                You just staked {getFormattedNumber(stakingBalance)} NIOX
              </Typography>
              <Typography
                size={20}
                color="monoWhite"
                weight={600}
                className="mt-3"
              >
                Transaction is successfully completed!
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
                  Close
                </DefaultButton>
              </Col>
              <Col>
                <PrimaryButton
                  onClick={() => setIsDialogOpen(false)}
                  className="w-100"
                >
                  Stake More
                </PrimaryButton>
              </Col>
            </Row>
          </div>
        ) : (
          <></>
        )}
      </div>
    </Modal>
  );
};

export default StakingModal;
