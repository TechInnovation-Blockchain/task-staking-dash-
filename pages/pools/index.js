import { Col, Container, Row } from "reactstrap";
import Admin from "layouts/Admin.js";
import Typography from "../../components/Typography";
import ForgeBasket from "../../components/PoolBasket";
import React, { useEffect, useState } from "react";
import SidebarLayout from "../../components/Sidebar/SidebarLayout";

const baskets = [
  {
    poolId: "SDAO-ETH",
    apy: "13",
    tokens: {
      1: [
        "0x993864e43caa7f7f12953ad6feb1d1ca635b875f",
        "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      ],
      3: [
        "0x5e94577b949a56279637ff74dfcff2c28408f049",
        "0xc778417e063141139fce010982780140aa0cd5ab",
      ],
    },
  },
  {
    poolId: "AGIX-ETH",
    apy: "4.82",
    tokens: {
      1: [
        "0x5b7533812759b45c2b44c19e320ba2cd2681b542",
        "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      ],
      3: [
        "0xA1e841e8F770E5c9507E2f8cfd0aA6f73009715d",
        "0xc778417e063141139fce010982780140aa0cd5ab",
      ],
    },
  },
];

function ForgePage() {
  return (
    <>
      <SidebarLayout />
      <Container className="my-4">
        <Typography color="text1" size={32} weight={600}>
          Liquidity
        </Typography>
        <br />
        <Typography color="gray80" size={14}>
          Select one of the liquidity pools available, then add liquidity and
          start to earn fees.
        </Typography>
        <br />
        <div className="py-4 mt-5">
          <Row className="my-3">
            {baskets.map((basket) => (
              <Col lg={4} key={basket.poolId}>
                <ForgeBasket
                  title={basket.poolId}
                  apy={basket.apy}
                  tokens={basket.tokens}
                />
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </>
  );
}

ForgePage.layout = Admin;

export default ForgePage;
