/*!

=========================================================
* NextJS Argon Dashboard PRO - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-argon-dashboard-pro
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import OverviewIcon from "./assets/img/icons/dashboard.svg";
import StakingIcon from "./assets/img/icons/safe.svg";
import ForumIcon from "./assets/img/icons/messages.svg";
import GovernanceIcon from "./assets/img/icons/governance.svg";
import VotingIcon from "./assets/img/icons/voting.svg";

export const firstRoutes = [
  // {
  //   collapse: false,
  //   name: "How it works",
  //   icon: HomeIcon,
  //   state: "dashboardsCollapse",
  //   path: "/",
  //   layout: "",
  // },
  {
    name: "Overview",
    icon: <OverviewIcon />,
    path: "/",
    layout: "",
  },
  {
    name: "Staking",
    icon: <StakingIcon />,
    path: "/staking",
    layout: "",
  },
  {
    name: "Forum",
    icon: <ForumIcon />,
    path: "https://forum.autonio.io/login",
    layout: "",
    isExternal: true,
  },
  // {
  //   name: "Yield Farming",
  //   icon: FarmsIcon,
  //   path: "/farms",
  //   layout: "",
  // },

  // {
  //   collapse: true,
  //   name: "Farms",
  //   icon: "ni ni-align-left-2 text-default",
  //   state: "tablesCollapse",
  //   views: [
  //     {
  //       path: "/tables",
  //       name: "Tables",
  //       miniName: "T",
  //       layout: "/admin",
  //     }
  //   ],
  // },
];

export const secondRoutes = [
  {
    name: "Governance",
    icon: <GovernanceIcon />,
    path: "/governance",
    layout: "",
  },
  {
    name: "Voting",
    icon: <VotingIcon />,
    path: "/voting",
    layout: "",
  },
];
