import {
  formatAddress,
  getFormattedDateMonthAndYear,
  getFormattedNumber,
} from "../../utils/formatters";
import Card from "../Card";
import Typography from "../Typography";
import UpIcon from "../../assets/img/icons/up.svg";
import styled from "styled-components";
import {
  CloseIconButton,
  DefaultButton,
  LinkButton,
  PrimaryButton,
} from "../Buttons";
import { useUser } from "contexts/UserContext";
import { ContractAddress } from "../../assets/constants/addresses";
import StakingRewardsABI from "../../assets/constants/abi/StakingRewards.json";
import {
  defaultGasLimit,
  fetchLockedBalance,
  fetchUserLockPeriod,
  getGasPrice,
} from "../../utils/ethereum";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Col, Modal as ReactModal, Row } from "reactstrap";
import { fromFraction } from "../../utils/balance";
import { TextField as MTextField } from "@material-ui/core";
import WalletModal from "../WalletModal";
import { useEthereum } from "../../contexts/EthereumContext";
import RightArrowIcon from "../../assets/img/icons/right-arrow.svg";

const LabelWrapper = styled.div`
  background: ${({ theme }) => theme.color.greenBuy10};
  border-radius: 20px;
  padding: 3px 8px 3px 6px;
  color: ${({ theme, active }) =>
    active ? theme.color.greenMain : theme.color.monoWhite};
  font-size: 10px;
`;

const Modal = styled(ReactModal)`
  > .modal-content {
    background: ${({ theme }) => theme.color.monoGrey1};
    box-shadow: 0px 2px 2px rgba(6, 19, 36, 0.24);
  }
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

const GreyRightArrowIcon = styled(RightArrowIcon)`
  & path {
    fill: #888a8f;
  }
`;

export const LockedCard = ({ blockNumber }) => {
  const { library, account } = useUser();
  const [tokenAmount, setTokenAmount] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [unStakeAmount, setUnStakeAmount] = useState(0);
  const [openWalletModal, setOpenWalletModal] = useState(false);
  const { stakingContract } = useEthereum();
  const [lockPeriod, setLockPeriod] = useState(null);

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

      const lockPeriod = await fetchUserLockPeriod(account, library);

      const now = Date.now();
      if (lockPeriod && now < lockPeriod * 1000)
        setLockPeriod(lockPeriod * 1000);
      else setLockPeriod(null);
    };

    fetchBalance();
  }, [account, library, blockNumber]);

  const handleInputChange = (event) => {
    setUnStakeAmount(event.target.value);
  };
  return (
    <>
      <Card>
        <Typography color="monoWhite" opacity={0.5} size={12}>
          Staked
        </Typography>
        <div className="d-flex mt-2">
          <Typography
            transform="uppercase"
            color="monoWhite"
            size={24}
            weight={600}
          >
            {getFormattedNumber(tokenAmount)} NIOX
          </Typography>
          {/* {changedAmount && (
          <div className="ml-2">
            <Typography
              color={changedAmount > 0 ? "greenBuy" : "greenBuy"}
              size={10}
            >
              {(changedAmount > 0 ? "+" : "-") + changedAmount} NIOX
            </Typography>
            <Typography color="monoWhite" opacity={0.5} size={10}>
              24h change
            </Typography>
          </div>
        )} */}
        </div>
        {/* <div className="d-flex">
          <Typography color="textGrey" size={14}>
            {currencyName === "bitcoin" ? "₿" : "$"} {currencyAmount}
          </Typography>
          <LabelWrapper className="ml-2">
            <Typography size={10} color="greenBuy">
              <img src={UpIcon} /> {changedPercent} %
            </Typography>
          </LabelWrapper>
        </div> */}

        <div className="d-flex justify-content-between mt-4">
          {account ? (
            <>
              <LinkButton
                color="textGrey"
                size={11}
                weight={700}
                onClick={() => setIsDialogOpen(true)}
              >
                Unstake <GreyRightArrowIcon />
              </LinkButton>
              {lockPeriod && (
                <Typography color="textGrey" size={11} weight={400}>
                  Locked till {getFormattedDateMonthAndYear(lockPeriod)}
                </Typography>
              )}
            </>
          ) : (
            <LinkButton
              color="greenMain"
              size={11}
              weight={700}
              onClick={() => setOpenWalletModal(true)}
            >
              Connect wallet <RightArrowIcon />
            </LinkButton>
          )}
        </div>
      </Card>
      <Modal
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
          {/* <div className="d-flex mt-3">
            <Typography
              color="textGrey"
              size={12}
              weight={600}
              className="mr-1"
            >
              Amount to unstake:
            </Typography>
            <Typography color="monoWhite" size={12} weight={600}>
              {tokenAmount} NIOX
            </Typography>
          </div> */}
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
      </Modal>

      <WalletModal open={openWalletModal} setOpen={setOpenWalletModal} />
    </>
  );
};

export default LockedCard;
