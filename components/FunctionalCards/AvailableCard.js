import styled from "styled-components";
import { getFormattedNumber } from "../../utils/formatters";
import { LinkButton } from "../Buttons";
import Card from "../Card";
import Typography from "../Typography";
import { useUser } from "contexts/UserContext";
import UpIcon from "../../assets/img/icons/up.svg";
import { useEffect, useState } from "react";
import { fetchAvailableBalance, getAPY } from "../../utils/ethereum";
import { useRouter } from "next/router";
import UpArrowIcon from "../../assets/img/icons/up-arrow.svg";
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

export const AvailableCard = ({ blockNumber }) => {
  const changedAmount = 4;
  const currencyName = "usd";
  const currencyAmount = 1279.83;
  const changedPercent = 3.14;
  //   const tokenAmount = 12500;

  const { library, account } = useUser();
  const router = useRouter();
  const [info, setInfo] = useState({ tokenAmount: 0, currentAPY: 0 });
  const [openWalletModal, setOpenWalletModal] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!library || !account) return;

      const tokenAmount = await fetchAvailableBalance(account, library);
      const currentAPY = await getAPY(library);

      setInfo({ tokenAmount, currentAPY });
    };

    fetchBalance();
  }, [library, account, blockNumber]);

  return (
    <Card>
      <Typography color="monoWhite" opacity={0.5} size={12}>
        NIOX Balance
      </Typography>
      <div className="d-flex mt-2 align-items-center">
        <Typography
          transform="uppercase"
          color="monoWhite"
          size={24}
          weight={600}
        >
          {getFormattedNumber(info.tokenAmount)}
        </Typography>
        {/* {changedAmount && (
          <div className="ml-2">
            <Typography
              color={changedAmount > 0 ? "greenBuy" : "greenBuy"}
              size={10}
            >
              <img src={UpArrowIcon} />
              {(changedAmount > 0 ? "+" : "-") + changedAmount} NIOX
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
              Stake <RightArrowIcon />
            </LinkButton>
            {/* <Typography color="textGrey" size={11}>
              Current APY: {getFormattedNumber(info.currentAPY)}%
            </Typography> */}
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

export default AvailableCard;
