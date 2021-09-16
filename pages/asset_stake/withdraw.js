import React from "react";
import { Container } from "reactstrap";
import Admin from "layouts/Admin.js";

import TokenFunctionPanel, {
  PanelTypes,
} from "../../components/TokenFunctionPanelAStake/index.js";
import SidebarLayout from "../../components/Sidebar/SidebarLayout.js";
function StakeWithdraw() {
  return (
    <Container className="my-4">
      <SidebarLayout />
      <TokenFunctionPanel panelType={PanelTypes.WITHDRAW} />
    </Container>
  );
}

StakeWithdraw.layout = Admin;

export default StakeWithdraw;
