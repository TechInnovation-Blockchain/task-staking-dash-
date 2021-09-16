import { useEffect, useState } from "react";
import { Col, Container, Row, FormGroup, InputGroup, Input } from "reactstrap";
import Admin from "layouts/Admin.js";
import Typography from "../components/Typography";
import { LinkButton, PrimaryButton } from "../components/Buttons";
import Card from "../components/Card";
import { getFormattedNumber } from "../utils/formatters";
import styled from "styled-components";
import {
  ACTIVE_CURRENCIES,
  CARD_PERIODS,
  stakingModels,
  stakingTabs,
} from "../utils/constants";
import { DefaultButton } from "../components/Buttons";
import UpIcon from "../assets/img/icons/up.svg";
import EyeIcon from "../assets/img/icons/eye.svg";
import ClaimRewards from "../components/ClaimRewards";
import AvailableCard from "../components/FunctionalCards/AvailableCard";
import LockedCard from "../components/FunctionalCards/LockedCard";
import StakingRewardsCard from "../components/FunctionalCards/StakingRewardsCard";
import DropdownMenu from "../components/DropdownMenu";
import TokenCard from "../components/FunctionalCards/TokenCard";
import { useEthereum } from "../contexts/EthereumContext";
import { useUser } from "../contexts/UserContext";
import Tabs from "../components/Tabs/DefaultTabs";
import { useRouter } from "next/router";
import {
  fetchRewardsDayDatas,
  fetchSmartdexFactory,
  fetchSwarmData,
  fetchTotalLockedBalance,
  fetchTotalStakersCount,
  fetchTotalTokenHoldersCount,
  getAPY,
  getTokenPrice,
} from "../utils/ethereum";
import RecentTransactionsPanel from "../components/RecentTransactionsPanel";
import PriceChart from "../components/PriceChart";
import { useWeb3React } from "@web3-react/core";
import SidebarMobile from "../components/Sidebar/SidebarMobile";
import { Button } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import WalletModal from "../components/WalletModal";
import SidebarLayout from "../components/Sidebar/SidebarLayout";
import RightArrowIcon from "../assets/img/icons/right-arrow.svg";

const modelDetails = [
  {
    name: "Maker",
    details: [
      {
        name: "Active users",
        value: "Soon",
      },

      {
        name: "Total sessions",
        value: "Soon",
      },
    ],
  },
  {
    name: "Smartdex",
    details: [
      {
        name: "Generated volume",
        value: "$201,345.78",
      },
      {
        name: "Total value locked",
        value: "$34.63",
      },
    ],
  },
  {
    name: "Swarm",
    details: [
      {
        name: "Rewards distributed",
        value: "$1,150,000",
      },
      {
        name: "Generated volume",
        value: "$5,543,345.56",
      },
    ],
  },
];

const LabelWrapper = styled.div`
  background: ${({ theme, active }) =>
    active ? theme.color.greenBuy10 : theme.color.monoGrey2};
  border-radius: 20px;
  padding: 4px 13px;
  color: ${({ theme, active }) =>
    active ? theme.color.greenMain : theme.color.monoWhite};
  font-size: 10px;
`;

const StatisticsLabelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: ${({ theme }) => `1px solid ${theme.color.monoGrey2}`};
  padding-bottom: 10px;
  margin-bottom: 10px;
`;

// const ChartWrapper = styled.div`
//   // height: 100%;
//   // padding-top: 40px;
// `;

const OverviewTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  min-height: 43px;
`;

const CustomCard = styled.div`
  // overflow-x: scroll;

  @media (max-width: 768px) {
    overflow-x: scroll;
  }

  @media (max-width: 1024px) {
    display: flex;
    justify-content: space-between;
  }

  @media (min-width: 1025px) {
    display: none;
  }
`;

const CustomCardItem1 = styled.div`
  @media (max-width: 1024px) {
    width: 24%;
  }

  @media (max-width: 768px) {
    width: 285px;
    margin-right: 1rem;
  }

  > div {
    @media (max-width: 768px) {
      width: 285px;
    }
  }
`;

const CustomCardItem2 = styled.div`
  @media (max-width: 1024px) {
    width: 32%;
  }

  @media (max-width: 425px) {
    width: 285px;
    margin-right: 1rem;
  }

  > div {
    @media (max-width: 425px) {
      width: 285px;
    }
  }

  @media (max-width: 1024px) and (min-width: 800px) {
    width: 300px;
    margin-right: 2rem;
  }

  > div {
    @media (max-width: 1024px) and (min-width: 800px) {
      width: 300px;
    }
  }
`;

const CustomCardPc = styled.div`
  @media (max-width: 1024px) {
    display: none;
  }
`;

const CustomCardSection = styled.div`
  @media (max-width: 1024px) {
    display: none;
  }
`;

const ModelCard = ({ title, details }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const router = useRouter();
  return (
    <Card>
      <div className="d-flex align-items-center justify-content-between mb-2">
        <Typography color="monoWhite" size={14} weight={600}>
          {title}
        </Typography>

        {/* <DropdownMenu
          menus={CARD_PERIODS}
          selected={selectedPeriod}
          setSelected={setSelectedPeriod}
        /> */}
      </div>
      {details.map((detail, index) => (
        <div className="d-flex justify-content-between" key={index}>
          <Typography color="textGrey" size={12} weight={400}>
            {detail.name}
          </Typography>
          <Typography
            color={index === 0 ? "monoWhite" : "greenBuy"}
            size={12}
            weight={400}
          >
            {detail.value}
          </Typography>
        </div>
      ))}

      <LinkButton
        color="greenMain"
        size={11}
        weight={700}
        onClick={() => router.push("/staking")}
        className="mt-2"
      >
        Visit App <RightArrowIcon />
      </LinkButton>
    </Card>
  );
};

const StatisticsContainer = ({ title, value }) => (
  <StatisticsLabelWrapper>
    <div className="d-flex">
      <Typography color="monoWhite" size={12} weight={400}>
        {title}
      </Typography>
      {/* <img src={EyeIcon} className="ml-2" /> */}
    </div>
    <Typography color="monoWhite" size={12} weight={600}>
      {value}
    </Typography>
  </StatisticsLabelWrapper>
);

const OverviewPage = () => {
  const { blockNumber } = useEthereum();
  const [dailyRewardsDatas, setDailyRewardsDatas] = useState([]);
  const [activeCurrency, setActiveCurrency] = useState(0);
  const [info, setInfo] = useState({
    totalLockedBalance: 0,
    tokenPrice: 0,
    totalHoldersCount: 0,
    totalStakersCount: 0,
    currentAPY: 0,
  });

  const [smartdexInfo, setSmartdexInfo] = useState({
    totalLiquidityUSD: 0,
    totalVolumeUSD: 0,
  });

  const [swarmInfo, setSwarmInfo] = useState({
    campaignsCount: 0,
    rewardsDistributed: 0,
  });

  const [makerInfo, setMakerInfo] = useState({
    volumeGenerated: 0,
    registeredUsers: 0,
  });

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    const dailyRewardsDatas = await fetchRewardsDayDatas();
    setDailyRewardsDatas(dailyRewardsDatas);
    const totalLockedBalance = await fetchTotalLockedBalance();
    const tokenPrice = await getTokenPrice();
    const totalHoldersCount = await fetchTotalTokenHoldersCount();
    const totalStakersCount = await fetchTotalStakersCount();
    const currentAPY = await getAPY();

    setInfo({
      totalLockedBalance,
      tokenPrice,
      totalHoldersCount,
      totalStakersCount,
      currentAPY,
    });

    const res = await fetchSmartdexFactory();
    setSmartdexInfo({
      totalLiquidityUSD: res.totalLiquidityUSD,
      totalVolumeUSD: res.totalVolumeUSD,
    });

    const swarmData = await fetchSwarmData();
    setSwarmInfo({
      campaignsCount: swarmData.campaignsCount,
      rewardsDistributed: swarmData.rewardsDistributed,
    });

    setMakerInfo({
      volumeGenerated: swarmData.rewardsVolume * 2,
      registeredUsers: 0,
    });
  };

  return (
    <div>
      {/* navbar */}
      <SidebarLayout />

      {/* <OverviewTitleWrapper> */}
      {/* <Typography
          color="monoWhite"
          size={14}
          weight={600}
          transform="uppercase"
        >
          Overview
        </Typography> */}
      <ClaimRewards />
      {/* </OverviewTitleWrapper> */}

      <div className="py-4">
        {/* pc */}
        <CustomCardSection>
          <Row>
            <Col lg={3}>
              <AvailableCard blockNumber={blockNumber} />
            </Col>
            <Col lg={3}>
              <LockedCard blockNumber={blockNumber} />
            </Col>
            <Col lg={3}>
              <StakingRewardsCard blockNumber={blockNumber} />
            </Col>
            <Col lg={3}>
              <TokenCard blockNumber={blockNumber} />
            </Col>
          </Row>
        </CustomCardSection>

        {/* mobile */}
        <CustomCard>
          <CustomCardItem1>
            <AvailableCard blockNumber={blockNumber} />
          </CustomCardItem1>
          <CustomCardItem1>
            <LockedCard blockNumber={blockNumber} />
          </CustomCardItem1>
          <CustomCardItem1>
            <StakingRewardsCard blockNumber={blockNumber} />
          </CustomCardItem1>
          <CustomCardItem1>
            <TokenCard blockNumber={blockNumber} />
          </CustomCardItem1>
        </CustomCard>
      </div>

      <Row>
        <Col lg={8}>
          <Card className="mb-4 h-statistics">
            <Row>
              <Col lg={4}>
                <Typography
                  color="monoWhite"
                  weight={600}
                  size={20}
                  // className="mb-4"
                >
                  Staking Statistics
                </Typography>
                {/* {account ? ( */}
                <div className="d-flex justify-content-between align-items-center">
                  <Typography size={12} color="monoWhite48" weight={600}>
                    Total Staked
                  </Typography>
                  <Tabs
                    setActiveTab={setActiveCurrency}
                    activeTab={activeCurrency}
                    tabs={ACTIVE_CURRENCIES}
                  />
                </div>
                <Typography
                  color="white"
                  size={20}
                  weight={600}
                  className="mt-2"
                >
                  {getFormattedNumber(
                    1 === activeCurrency
                      ? info.totalLockedBalance * info.tokenPrice
                      : info.totalLockedBalance,
                    activeCurrency
                  )}
                </Typography>
                {/* <div className="mt-11"> */}
                <div className="adminCal">
                  <StatisticsContainer
                    title="Current APY"
                    value={getFormattedNumber(info.currentAPY) + "%"}
                  />
                  <StatisticsContainer
                    title="Stakers"
                    value={getFormattedNumber(info.totalStakersCount)}
                  />
                  <StatisticsContainer
                    title="NIOX addresses"
                    value={getFormattedNumber(info.totalHoldersCount)}
                  />
                </div>
              </Col>
              <Col lg={8}>
                {dailyRewardsDatas.length > 0 && (
                  // <ChartWrapper>
                  <PriceChart
                    snapshots={dailyRewardsDatas}
                    activeCurrency={activeCurrency}
                    tokenPrice={info.tokenPrice}
                  />
                  // </ChartWrapper>
                )}
              </Col>
            </Row>
          </Card>
          <CustomCardPc>
            <Row>
              <Col lg={4}>
                <ModelCard
                  title="Maker"
                  details={[
                    {
                      name: "Volume generated",
                      value: `$${getFormattedNumber(
                        makerInfo.volumeGenerated
                      )}`,
                    },

                    {
                      name: "Registered users",
                      value: "1000",
                    },
                  ]}
                />
              </Col>
              <Col lg={4}>
                <ModelCard
                  title="Smartdex"
                  details={[
                    {
                      name: "Value locked",
                      value: `$${getFormattedNumber(
                        smartdexInfo.totalLiquidityUSD
                      )}`,
                    },

                    {
                      name: "Volume generated",
                      value: `$${getFormattedNumber(
                        smartdexInfo.totalVolumeUSD
                      )}`,
                    },
                  ]}
                />
              </Col>
              <Col lg={4}>
                <ModelCard
                  title="Swarm"
                  details={[
                    {
                      name: "Campaigns executed",
                      value: swarmInfo.campaignsCount,
                    },

                    {
                      name: "Rewards distributed",
                      value: `$${getFormattedNumber(
                        swarmInfo.rewardsDistributed
                      )}`,
                    },
                  ]}
                />
              </Col>
            </Row>
          </CustomCardPc>

          <CustomCard style={{ marginBottom: "1rem" }}>
            <CustomCardItem2>
              <ModelCard
                title="Maker"
                details={[
                  {
                    name: "Active users",
                    value: "Soon",
                  },

                  {
                    name: "Total sessions",
                    value: "Soon",
                  },
                ]}
              />
            </CustomCardItem2>
            <CustomCardItem2>
              <ModelCard
                title="Smartdex"
                details={[
                  {
                    name: "Value locked",
                    value: `$${getFormattedNumber(
                      smartdexInfo.totalLiquidityUSD
                    )}`,
                  },

                  {
                    name: "Volume generated",
                    value: `$${getFormattedNumber(
                      smartdexInfo.totalVolumeUSD
                    )}`,
                  },
                ]}
              />
            </CustomCardItem2>
            <CustomCardItem2>
              <ModelCard
                title="Swarm"
                details={[
                  {
                    name: "Campaigns executed",
                    value: "159",
                  },

                  {
                    name: "Rewards distributed",
                    value: "$4,474.34",
                  },
                ]}
              />
            </CustomCardItem2>
          </CustomCard>
        </Col>
        <Col lg={4} className="h-transactions">
          <RecentTransactionsPanel />
        </Col>
      </Row>
    </div>
  );
};

OverviewPage.layout = Admin;

export default OverviewPage;
