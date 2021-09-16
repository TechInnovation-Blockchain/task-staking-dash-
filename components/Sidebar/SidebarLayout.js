import { useState } from "react";
import styled from "styled-components";
import MenuIcon from "@material-ui/icons/Menu";
import WalletModal from "../WalletModal";
import { PrimaryButton } from "../Buttons";
import SidebarMobile from "./SidebarMobile";

const NavMobile = styled.div`
  display: none;

  // @media (max-width: 1024px) {
  //   display: flex;
  //   margin-bottom: 2rem;
  // }
  @media (max-width: 1199px) {
    display: flex;
    // margin-bottom: 2rem;
    padding-bottom: 2rem;
  }
`;

const ToggleIconMobile = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem;
`;

const SidebarLayout = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openWalletModal, setOpenWalletModal] = useState(false);

  return (
    <>
      <NavMobile>
        <ToggleIconMobile>
          <MenuIcon
            style={{ color: "#fff" }}
            onClick={() => setOpenSidebar(true)}
          />
        </ToggleIconMobile>

        <PrimaryButton
          onClick={() => setOpenWalletModal(true)}
          className="w-100"
        >
          Connect Wallet
        </PrimaryButton>
      </NavMobile>

      <SidebarMobile open={openSidebar} setOpen={setOpenSidebar} />
      <WalletModal open={openWalletModal} setOpen={setOpenWalletModal} />
    </>
  );
};

export default SidebarLayout;
