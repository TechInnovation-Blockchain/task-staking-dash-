import { useEffect, useState } from "react";
import { Input } from "reactstrap";
import styled from "styled-components";
import { client_staking, client_token } from "../../apollo/client";
import {
  USER_STAKING_TRANSACTION,
  USER_TOKEN_TRANSACTION,
} from "../../apollo/queries";
import { ContractAddress } from "../../assets/constants/addresses";
import { useUser } from "../../contexts/UserContext";
import { DefaultButton } from "../Buttons";
import Card from "../Card";
import Typography from "../Typography";
import ArrowUpIcon from "../../assets/img/icons/arrow_bar_up.svg";
import ArrowDownIcon from "../../assets/img/icons/arrow_bar_down.svg";
import LockIcon from "../../assets/img/icons/lock.svg";
import UnLockIcon from "../../assets/img/icons/unlock.svg";
import {
  getFormattedNumber,
  getFormattedTime,
  getFormattedMonthAndDate,
} from "../../utils/formatters";
import WalletModal from "../WalletModal";
import { fromFraction, toFraction } from "../../utils/balance";

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 96px - 93px - 142px);
`;

const SearchInput = styled(Input)`
  background-color: transparent !important;
  border: 1px solid #2f3641 !important;
  color: ${({ theme }) => `${theme.color.monoWhite} !important`};
  font-weight: 600;
  box-shadow: none !important;

  &::-webkit-input-placeholder {
    color: ${({ theme }) => theme.color.textGrey};
    font-weight: 600;
    font-size: 14px;
  }
`;

const TransactionLabel = ({ data }) => {
  const getIcon = () => {
    if (
      data.from.toLowerCase() === ContractAddress.STAKING_REWARDS.toLowerCase()
    ) {
      if (data.amount > 0) return <UnLockIcon />;
      else return <LockIcon />;
    } else {
      if (data.amount > 0) return <ArrowDownIcon />;
      else return <ArrowUpIcon />;
    }
  };

  return (
    <div className="d-flex justify-content-between">
      <div className="d-flex my-1">
        {getIcon()}
        <Typography color="monoWhite" size={12} weight={400} className="ml-3">
          NIOX
        </Typography>
        <Typography
          color={data.amount > 0 ? "greenBuy" : "monoWhite"}
          size={12}
          weight={400}
          className="ml-4"
        >
          {(data.amount > 0 ? "+" : "") +
            getFormattedNumber(toFraction(data.amount))}
        </Typography>
      </div>
      <Typography color="monoWhite" size={12} weight={400}>
        {getFormattedTime(data.timestamp)}
      </Typography>
    </div>
  );
};

const DateLabel = ({ timestamp }) => (
  <Typography
    color="textGrey"
    size={10}
    weight={600}
    transform="uppercase"
    className="text-align-center mt-2 mb-1"
  >
    {getFormattedMonthAndDate(timestamp)}
  </Typography>
);

const RecentTransactionsPanel = () => {
  const { account, library } = useUser();
  const [transactions, setTransactions] = useState([]);
  const [dates, setDates] = useState([]);
  const [openWalletModal, setOpenWalletModal] = useState(false);

  useEffect(() => {
    if (!account || !library) return;
    fetchInfo();
  }, [account, library]);

  const fetchInfo = async () => {
    let res = await client_token.query({
      query: USER_TOKEN_TRANSACTION,
      variables: {
        user: account,
      },
    });

    let userTransactions = res.data.userTransactions;
    console.log("transactions:", userTransactions);
    setTransactions(userTransactions);

    let currentDate;
    let dates = [];
    for (let i = 0; i < userTransactions.length; i++) {
      const date = parseInt(userTransactions[i].timestamp / 86400) * 86400;
      if (i == 0 || currentDate > date) {
        currentDate = date;
        dates[i] = date;
      } else dates[i] = null;
    }

    setDates(dates);
  };

  return (
    <StyledCard>
      <div className="overflow-hidden d-flex flex-direction-column h-100">
        <Typography size={20} weight={600} color="monoWhite" className="mb-3">
          Recent Transactions
        </Typography>

        {account ? (
          <div>
            {/* <SearchInput
                  placeholder="Search"
                  type="text"
                  className="border rounded mt-3"
                /> */}
            {transactions.map((transaction, index) => {
              return (
                <div key={index}>
                  {dates[index] && (
                    <DateLabel timestamp={transaction.timestamp} />
                  )}
                  <TransactionLabel data={transaction} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="my-auto text-align-center">
            <Typography color="textGrey" size={12} weight={500}>
              Log in via your wallet to see your
              <br /> recent transactions
            </Typography>

            <DefaultButton
              className="w-100 mt-3"
              size={12}
              weight={600}
              background="monoGrey2"
              color="monoWhite"
              onClick={() => setOpenWalletModal(true)}
            >
              Connect Wallet
            </DefaultButton>
          </div>
        )}
      </div>

      <WalletModal open={openWalletModal} setOpen={setOpenWalletModal} />
    </StyledCard>
  );
};

export default RecentTransactionsPanel;
