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
  getGasPrice,
  getTokenPrice,
} from "../../utils/ethereum";
import { ethers } from "ethers";
import DropdownMenu from "../DropdownMenu";
import { CARD_PERIODS } from "../../utils/constants";
import { useEffect, useState } from "react";
import WalletModal from "../WalletModal";
import RightArrowIcon from "../../assets/img/icons/right-arrow.svg";

const LabelWrapper = styled.div`
  background: ${({ theme }) => theme.color.greenBuy10};
  border-radius: 20px;
  padding: 3px 8px 3px 6px;
  color: ${({ theme, active }) =>
    active ? theme.color.greenMain : theme.color.monoWhite};
  font-size: 10px;
`;

export const TokenCard = () => {
  const changedAmount = 4;
  const bitcoinPrice = 0.0005123;
  const changedPercent = 3.14;
  const usdPrice = 0.1565;
  const { library, account } = useUser();
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const [tokenPrice, setTokenPrice] = useState(0);
  const [openWalletModal, setOpenWalletModal] = useState(false);

  useEffect(() => {
    loadTokenPrice();
  }, []);

  const loadTokenPrice = async () => {
    const tokenPrice = await getTokenPrice();
    setTokenPrice(tokenPrice);
  };

  const openSmartdexSwap = () => {
    window.open("https://swap.smartdex.app/#/swap", "_blank");
  };

  return (
    <Card>
      <div className="d-flex justify-content-between">
        <Typography color="monoWhite" opacity={0.5} size={12}>
          NIOX Price
        </Typography>
        {/* <DropdownMenu
          menus={CARD_PERIODS}
          selected={selectedPeriod}
          setSelected={setSelectedPeriod}
        /> */}
      </div>

      <div className="d-flex mt-2">
        <Typography
          transform="uppercase"
          color="monoWhite"
          size={24}
          weight={600}
        >
          ${getFormattedNumber(tokenPrice)}
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
          ₿ {bitcoinPrice}
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
              onClick={openSmartdexSwap}
            >
              Trade <RightArrowIcon />
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

export default TokenCard;
