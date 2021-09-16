import styled from "styled-components";
import Typography from "../Typography";
import Card from "../Card";
import CheckIcon from "../../assets/img/icons/check.svg";
import DoubleCheckIcon from "../../assets/img/icons/double-check.svg";
import CloseIcon from "../../assets/img/icons/close.svg";
import UnlimitedIcon from "../../assets/img/icons/unlimited.svg";
import { CloseIconButton, DefaultButton, PrimaryButton } from "../Buttons";
import { useState } from "react";
import { Col, Modal as ReactModal, Row } from "reactstrap";
import { stakingPlans } from "../../utils/constants";
import StakingModal from "../Modals/StakingModal";
import BigNumber from "bignumber.js";

const Modal = styled(ReactModal)`
  > .modal-content {
    background: ${({ theme }) => theme.color.monoGrey1};
    box-shadow: 0px 2px 2px rgba(6, 19, 36, 0.24);
  }
`;

const stautsIcons = [
  <CheckIcon />,
  <DoubleCheckIcon />,
  <CloseIcon />,
  <UnlimitedIcon />,
];

const StyledFeatureLabel = styled(Typography)`
  background: ${({ theme, status }) =>
    status === 1
      ? theme.color.greenMain08
      : status === 2
      ? theme.color.monoWhite08
      : "transparent"};
  color: ${({ theme, status }) =>
    status === 1
      ? theme.color.greenMain
      : status === 2
      ? theme.color.monoWhite68
      : theme.color.monoWhite};
  padding: ${({ status, icon }) =>
    icon === 3 ? "2px 9px" : icon ? "2px 5px" : status ? "2px 14px" : 0};
  display: inline-block;
  border-radius: ${({ icon }) => (icon ? "50%" : "20px")};
  font-size: 14px;
  font-weight: 400;
`;

const FeatureWrapper = styled.div`
  height: ${({ large }) => (large ? "70px" : "42px")};
`;

const StakingPlanCard = ({
  plan,
  lockedStatus,
  tier,
  currentAPY,
  currentStakedBalance,
  lockPeriod,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const FeatureValueLabel = ({ value }) => {
    const activePatterns = [
      "yes",
      "double-yes",
      "%",
      "round",
      "presale",
      "Detailed",
      "vote",
      "max",
      "unlimited",
    ];
    const inactivePatterns = ["no", "Demo"];
    const iconPatterns = ["yes", "double-yes", "no", "unlimited"];

    let activeStatus = 0;
    let icon = 0;
    let i;

    for (i = 0; i < activePatterns.length; i++) {
      if (value.includes(activePatterns[i])) {
        activeStatus = 1;
        break;
      }
    }

    if (!activeStatus) {
      for (i = 0; i < inactivePatterns.length; i++) {
        if (value.includes(inactivePatterns[i])) {
          activeStatus = 2;
          break;
        }
      }
    }

    for (i = 0; i < iconPatterns.length; i++) {
      if (value === iconPatterns[i]) {
        icon = i + 1;
        break;
      }
    }

    return (
      <StyledFeatureLabel status={activeStatus} className="mt-1" icon={icon}>
        {icon ? stautsIcons[icon - 1] : value}
      </StyledFeatureLabel>
    );
  };

  return (
    <>
      <Card align="center">
        <Typography color="greenMain" size={20} weight={600}>
          {plan.name}
        </Typography>
        <Typography color="textGrey" size={12} weight={600} className="mb-4">
          {plan.pricing}
        </Typography>
        {plan.features.map((feature, index) => (
          <FeatureWrapper large={feature.name ? true : false} key={index}>
            {feature.name && (
              <Typography color="monoWhite" size={14} weight={400}>
                {feature.name}
              </Typography>
            )}
            <FeatureValueLabel value={feature.value} />
          </FeatureWrapper>
        ))}
        <DefaultButton
          className="w-100 mt-3"
          size={12}
          weight={600}
          background={lockedStatus < 2 ? "monoGrey2" : "greenMain"}
          color={lockedStatus < 2 ? "monoWhite" : "monoBlack"}
          disabled={lockedStatus < 2}
          onClick={() => setIsDialogOpen(true)}
        >
          {lockedStatus === 0
            ? "Unlocked"
            : lockedStatus === 1
            ? "Current Tier"
            : "Unlock"}
        </DefaultButton>
        <DefaultButton
          color="monoWhite"
          opacity={0.48}
          size={12}
          weight={400}
          decoration="underline"
          transform="none"
        >
          Details
        </DefaultButton>
      </Card>

      <StakingModal
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        currentAPY={currentAPY}
        lockPeriod={lockPeriod}
        tier={tier}
        stakingBalance={BigNumber(stakingPlans[tier].unlockAmount).minus(
          BigNumber(currentStakedBalance.toString())
        )}
      />
    </>
  );
};

export default StakingPlanCard;
