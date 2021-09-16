import { useEffect, useState } from "react";
import { ContractAddress } from "../../assets/constants/addresses";
import { CloseIconButton, DefaultButton, PrimaryButton } from "../Buttons";
import Typography from "../Typography";
import { useUser } from "contexts/UserContext";
import Web3 from "web3";
import { ethers } from "ethers";
import { toFraction } from "../../utils/balance";
import { Col, Input, InputGroup, Modal as ReactModal, Row } from "reactstrap";
import styled from "styled-components";
import {
  formatAddress,
  getFormattedNumber,
  getFormattedRemainTime,
} from "../../utils/formatters";
import {
  FormControlLabel as MFormControlLabel,
  Checkbox,
  FormGroup,
} from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import TooltipComponent from "../Tooltip";
import { useEthereum } from "../../contexts/EthereumContext";
import { getAddress } from "ethers/lib/utils";
import { ZERO_ADDRESS } from "../../utils/constants";
import { fetchUserRewardLockPeriod } from "../../utils/ethereum";
import { useRouter } from 'next/router';

const Modal = styled(ReactModal)`
  > .modal-content {
    background: ${({ theme }) => theme.color.monoGrey1};
    box-shadow: 0px 2px 2px rgba(6, 19, 36, 0.24);
  }
`;

const GreenCheckbox = withStyles({
  root: {
    color: "#7E848F",
    "&$checked": {
      color: "#27C29D",
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const FormControlLabel = styled(MFormControlLabel)`
  & .MuiTypography-root {
    color: ${({ activated, theme }) =>
      activated ? theme.color.white : theme.color.textGrey};
    font-size: 12px;
    font-weight: 400;
  }

  margin-bottom: 0;
`;

const ClaimRewards = () => {
  const { asPath } = useRouter();
  const { account, library } = useUser();
  const [stakedBalance, setStakedBalance] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAutocompound, setIsAutocompound] = useState(false);
  const { stakingContract, blockNumber } = useEthereum();
  const [claimPeriod, setClaimPeriod] = useState(null);

  useEffect(() => {
    if (!library || !account) return;

    fetchBalance();
    checkIfEnrolledCompounding();
    fetchClaimRewardPeriod();
  }, [account, library, stakingContract, blockNumber]);

  const fetchBalance = async () => {
    if (!stakingContract) return;

    const stakedBalance = await stakingContract.earned(account);

    setStakedBalance(toFraction(stakedBalance, 4));
  };

  const checkIfEnrolledCompounding = async () => {
    if (!stakingContract) return;
    const user = await stakingContract.checkUser(account);

    if (user !== ZERO_ADDRESS) setIsAutocompound(true);
  };

  const fetchClaimRewardPeriod = async () => {
    let period = await fetchUserRewardLockPeriod(account, library);
    // Convert to milliseconds
    period = period * 1000;

    const now = Date.now();

    if (now > period) setClaimPeriod(null);
    else setClaimPeriod(getFormattedRemainTime((period - now) / 1000));
  };

  const claimRewards = async () => {
    if (!stakingContract) return;

    const tx = await stakingContract.getReward();

    fetchBalance();

    console.log("Transaction:", tx);
  };

  const handleClaim = async () => {
    await claimRewards();
    setIsDialogOpen(false);
  };

  const handleAutocompound = async () => {
    if (!stakingContract) return;

    if (isAutocompound) {
      // Leave compounding
      try {
        const tx = await stakingContract.leaveComponding();
        console.log("Transaction:", tx);
        const receipt = await tx.wait();
        console.log("Receipt:", receipt);
      } catch {
        console.log("error");
        return;
      }
    } else {
      // Enroll compouding
      try {
        const tx = await stakingContract.enrollComponding();
        const receipt = await tx.wait();
        console.log("Receipt:", receipt);
      } catch {
        console.log("error");
        return;
      }
    }
    setIsAutocompound(!isAutocompound);
  };

  return (
    <div>
      <Row>
        <Col md={6} sm={6} xs={6}>
          <Typography
            color="monoWhite"
            size={14}
            weight={600}
            transform="uppercase"
          >
            {asPath === "/"
              ? "Overview"
              : asPath === "/staking"
              ? "Staking"
              : "title"}
          </Typography>
        </Col>
        {account && (
          <>
            <Col md={2} sm={4} xs={6} style={{paddingLeft: "2%"}}>
              <div className="mr-5">
                <Typography color="textGrey" size={12} weight={600}>
                  Current staking reward
                </Typography>
                <Typography color="monoWhite" size={14} weight={600}>
                  {getFormattedNumber(stakedBalance)} NIOX
                </Typography>
              </div>
            </Col>
            {/* )} */}
            {/* {account && (
                  <> */}
            <Col md={2} sm={4} xs={6} style={{paddingLeft: "4%"}}>
              <div className="d-flex align-items-center">
                <FormControlLabel
                  control={
                    <GreenCheckbox
                      checked={isAutocompound}
                      onChange={handleAutocompound}
                      name="checkedAutocompound"
                      color="primary"
                    />
                  }
                  activated={isAutocompound}
                  label="Autocompound"
                  className="mr-2"
                />
                <TooltipComponent title="When clicked, your staking rewards are automatically locked for further staking" />
              </div>
            </Col>
            <Col md={2} sm={4} xs={6} style={{display: "flex", flexDirection: "column"}}>
              <PrimaryButton
                onClick={() => setIsDialogOpen(true)}
                disabled={claimPeriod ? true : false}
              >
                {"Claim " + (claimPeriod ? "in " + claimPeriod : "Rewards")}
              </PrimaryButton>
            </Col>
          </>
        )}
      </Row>

      <Modal
        className="modal-dialog-centered"
        isOpen={isDialogOpen}
        toggle={() => setIsDialogOpen(false)}
      >
        <div className="modal-body p-3">
          <div className="d-flex justify-content-between">
            <Typography size={20} weight={600} color="monoWhite">
              Overview
            </Typography>
            <CloseIconButton onClick={() => setIsDialogOpen(false)} />
          </div>
          <Typography color="textGrey" size={14} weight={400} className="mt-3">
            Please check the information below
          </Typography>
          <div className="d-flex mt-3">
            <Typography
              color="textGrey"
              size={12}
              weight={600}
              className="mr-1"
            >
              Amount to claim:
            </Typography>
            <Typography color="monoWhite" size={12} weight={600}>
              {getFormattedNumber(stakedBalance)} NIOX
            </Typography>
          </div>
          <div className="d-flex mt-1">
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
              <PrimaryButton onClick={handleClaim} className="w-100">
                Claim
              </PrimaryButton>
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
};

export default ClaimRewards;
