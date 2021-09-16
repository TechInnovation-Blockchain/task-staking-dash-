import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@material-ui/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { stakingPlans } from "../../utils/constants";
import { formatAddress } from "../../utils/formatters";
import Typography from "../Typography";
import { DefaultButton } from "../Buttons";
import { getCurrentTier } from "../../utils/ethereum";
import { NavItem, NavLink } from "reactstrap";
import DocumentIcon from "../../assets/img/icons/documents.svg";
import LogoutIcon from "../../assets/img/icons/log_out.svg";
import CopyIcon from "../../assets/img/icons/copy.svg";
import LogoIcon from "../../assets/img/icons/logo.svg";

const SidebarMobile = ({ open, setOpen }) => {
  const { account, library, disconnect } = useUser();
  const [currentTier, setCurrentTier] = useState(0);
  const nextRouter = useRouter();

  useEffect(() => {
    if (!account || !library) return;

    const loadInfo = async () => {
      const currentTier = await getCurrentTier(null, account, library);

      setCurrentTier(currentTier);
    };

    loadInfo();
  }, [account, library]);

  return (
    <div>
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <div
          role="presentation"
          onClick={() => setOpen(false)}
          onKeyDown={() => setOpen(false)}
          style={{
            width: "250px",
            background: "#1a1f28",
            height: "100%",
            color: "#fff",
          }}
        >
          <List>
            <div className="text-align-left" style={{ padding: "1rem" }}>
              <Typography color="textGrey" size={12} weight={400}>
                My account
              </Typography>
              <div className="d-flex align-items-center">
                <Typography color="monoWhite" size={14} weight={600}>
                  {formatAddress(account)}
                </Typography>
                <IconButton aria-label="delete">
                  <CopyIcon />
                </IconButton>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <Typography
                  color="textGrey"
                  size={12}
                  weight={400}
                  className="d-flex align-items-center"
                >
                  Plan:
                  <Typography
                    color="monoWhite"
                    size={14}
                    weight={600}
                    className="ml-2"
                  >
                    {stakingPlans[currentTier].name}
                  </Typography>
                </Typography>
                <DefaultButton
                  size={12}
                  weight={600}
                  background="monoGrey2"
                  color="monoWhite"
                  className="px-2 py-1"
                  onClick={() => nextRouter.push("/staking")}
                >
                  upgrade
                </DefaultButton>
              </div>
            </div>

            <hr
              style={{
                background: "white",
                opacity: "0.35",
                margin: 0,
                marginBottom: "1rem",
              }}
            />

            <CustomItem title="Overview" link="/">
              <svg
                width="24"
                height="24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g
                  opacity=".48"
                  stroke="#fff"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M8 20H6a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2ZM8 11H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2ZM18 20h-2a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2ZM18 9h-2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2Z"></path>
                </g>
              </svg>
            </CustomItem>

            <CustomItem title="Staking" link="/staking">
              <svg
                width="24"
                height="24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity=".48">
                  <rect
                    x="4"
                    y="4"
                    width="16"
                    height="16"
                    rx="2"
                    stroke="#fff"
                  ></rect>
                  <path
                    d="M8.354 7.646a.5.5 0 1 0-.708.708l.708-.708Zm8 .708a.5.5 0 0 0-.708-.708l.708.708Zm-.708 8a.5.5 0 0 0 .708-.708l-.708.708Zm-8-.708a.5.5 0 0 0 .708.708l-.708-.708ZM14.5 12a2.5 2.5 0 0 1-2.5 2.5v1a3.5 3.5 0 0 0 3.5-3.5h-1ZM12 14.5A2.5 2.5 0 0 1 9.5 12h-1a3.5 3.5 0 0 0 3.5 3.5v-1ZM9.5 12A2.5 2.5 0 0 1 12 9.5v-1A3.5 3.5 0 0 0 8.5 12h1ZM12 9.5a2.5 2.5 0 0 1 2.5 2.5h1A3.5 3.5 0 0 0 12 8.5v1Zm-1.646.146-2-2-.708.708 2 2 .708-.708Zm4 .708 2-2-.708-.708-2 2 .708.708Zm-.708 4 2 2 .708-.708-2-2-.708.708Zm-4-.708-2 2 .708.708 2-2-.708-.708Z"
                    fill="#fff"
                  ></path>
                </g>
              </svg>
            </CustomItem>

            <CustomItem title="Forum" link="https://forum.autonio.io/login">
              <svg
                width="24"
                height="24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g
                  opacity=".48"
                  stroke="#fff"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m21 14-3-3h-7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v10ZM14 15v2a1 1 0 0 1-1 1H6l-3 3V11a1 1 0 0 1 1-1h2"></path>
                </g>
              </svg>
            </CustomItem>

            <CustomItem title="Governance">
              <svg
                width="24"
                height="24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g
                  opacity=".48"
                  stroke="#fff"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"></path>
                </g>
              </svg>
            </CustomItem>

            <CustomItem title="Voting">
              <svg
                width="24"
                height="24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g
                  opacity=".48"
                  stroke="#fff"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path>
                  <path d="M13 3h-2a2 2 0 1 0 0 4h2a2 2 0 1 0 0-4ZM9 14l2 2 4-4"></path>
                </g>
              </svg>
            </CustomItem>
          </List>

          {/* doc link */}
          <CustomItem
            title="Documentation"
            link="https://app.gitbook.com/@autonio/s/autonio-foundation"
            // style={{ opacity: "0.8" }}
          >
            <DocumentIcon />
          </CustomItem>

          {/* logo */}
          <ListItem
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              position: "absolute",
              bottom: 0,
            }}
          >
            {account && (
              <NavLink
                onClick={disconnect}
                style={{ padding: 0, paddingBottom: "2rem" }}
              >
                <ListItem button className="activated" style={{ padding: 0 }}>
                  <LogoutIcon style={{ minWidth: "56px" }} />
                  <ListItemText
                    primary="Log Out"
                    style={{
                      color: "#fff",
                      opacity: "1",
                    }}
                  />
                </ListItem>
              </NavLink>
            )}
            <LogoIcon />
            <p
              style={{
                fontWeight: "600",
                fontSize: "10px",
                color: "#888A8F",
                margin: "0",
                textTransform: "initial",
                opacity: "1",
                marginTop: "1.5rem",
              }}
            >
              Version 2.0
            </p>
          </ListItem>
        </div>
      </Drawer>
    </div>
  );
};

const CustomItem = ({ title, link, style, children }) => (
  <Link href={link || "#"}>
    <ListItem button>
      <ListItemIcon>{children}</ListItemIcon>
      <ListItemText
        primary={title}
        style={{
          color: "#fff",
          opacity: window.location.pathname === link ? "1" : "0.35",
          ...style,
        }}
      />
      {!link && (
        <div
          style={{
            background: "#2F3641",
            padding: "2px 4px",
            color: "#7E848F",
            borderRadius: "10px",
            fontSize: "11px",
          }}
        >
          Soon
        </div>
      )}
    </ListItem>
  </Link>
);

export default SidebarMobile;
