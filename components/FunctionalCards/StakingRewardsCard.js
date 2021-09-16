import { getFormattedNumber } from "../../utils/formatters";
import Card from "../Card";
import Typography from "../Typography";
import UpIcon from "../../assets/img/icons/up.svg";
import styled from "styled-components";
import { LinkButton } from "../Buttons";
import { useUser } from "contexts/UserContext";
import { ContractAddress } from "../../assets/constants/addresses";
import StakingRewardsABI from "../../assets/constants/abi/StakingRewards.json";
import {
  defaultGasLimit,
  fetchLockedBalance,
  fetchRewardRate,
  fetchStakingRewardsBalance,
  fetchTotalLockedBalance,
  getGasPrice,
} from "../../utils/ethereum";
import { ethers } from "ethers";
import DropdownMenu from "../DropdownMenu";
import { useEffect, useState } from "react";
import { CARD_PERIODS } from "../../utils/constants";
import WalletModal from "../WalletModal";
import { useRouter } from "next/router";
import DropdownIcon from "../../assets/img/icons/dropdown.svg";
import { toFraction } from "../../utils/balance";
import BigNumber from "bignumber.js";
import RightArrowIcon from "../../assets/img/icons/right-arrow.svg";

const LabelWrapper = styled.div`
  background: ${({ theme }) => theme.color.greenBuy10};
  border-radius: 20px;
  padding: 3px 8px 3px 6px;
  color: ${({ theme, active }) =>
    active ? theme.color.greenMain : theme.color.monoWhite};
  font-size: 10px;
`;

export const StakingRewardsCard = ({ blockNumber }) => {
  const { library, account } = useUser();
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const [openWalletModal, setOpenWalletModal] = useState(false);
  const router = useRouter();
  const [info, setInfo] = useState({
    rewardRate: 0,
    stakedBalance: 0,
    totalStakedBalance: 0,
  });

  useEffect(() => {
    const fetchBalance = async () => {
      if (!library || !account) return;

      const rewardRate = await fetchRewardRate(account);
      const stakedBalance = await fetchLockedBalance(account, library);
      const totalStakedBalance = await fetchTotalLockedBalance();
      setInfo({ rewardRate, stakedBalance, totalStakedBalance });
    };

    fetchBalance();
  }, [account, library, blockNumber]);

  const calcRewardRate = () => {
    if (!info.totalStakedBalance) return 0;

    let seconds = 1;
    if (selectedPeriod === 0) seconds = 16;
    else if (selectedPeriod === 1) seconds = 3600 * 24;
    else if (selectedPeriod === 2) seconds = 3600 * 24 * 30;
    else if (selectedPeriod === 3) seconds = 3600 * 24 * 30 * 12;

    return getFormattedNumber(
      toFraction(
        BigNumber(info.rewardRate)
          .multipliedBy(seconds)
          .multipliedBy(info.stakedBalance)
          .dividedBy(info.totalStakedBalance),
        4
      )
    );
  };

  return (
    <Card>
      <div className="d-flex justify-content-between">
        <Typography color="monoWhite" opacity={0.5} size={12}>
          Reward Rate
        </Typography>

        <DropdownMenu
          menus={CARD_PERIODS}
          selected={selectedPeriod}
          setSelected={setSelectedPeriod}
        />
      </div>

      <div className="d-flex mt-2">
        <Typography
          transform="uppercase"
          color="monoWhite"
          size={24}
          weight={600}
        >
          {calcRewardRate() + " NIOX"}
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
              color="greenMain"
              size={11}
              weight={700}
              onClick={() => router.push("/staking")}
            >
              Staking Calculator <RightArrowIcon />
            </LinkButton>
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
      <WalletModal open={openWalletModal} setOpen={setOpenWalletModal} />
    </Card>
  );
};

export default StakingRewardsCard;
