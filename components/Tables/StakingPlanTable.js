import { Table as RTable } from "reactstrap";
import Typography from "../Typography";
import styled from "styled-components";
import {
  stakingPlanFeatures,
  stakingPlanInfos,
  stakingPlans,
} from "../../utils/constants";
import CheckIcon from "../../assets/img/icons/check.svg";
import DoubleCheckIcon from "../../assets/img/icons/double-check.svg";
import CloseIcon from "../../assets/img/icons/close.svg";
import TripleCheckIcon from "../../assets/img/icons/triple-check.svg";
import TooltipComponent from "../Tooltip";
import StakingModal from "../Modals/StakingModal";
import { DefaultButton, PrimaryButton } from "../Buttons";
import { useState } from "react";
import BigNumber from "bignumber.js";
import WalletModal from "../WalletModal";
import { useUser } from "../../contexts/UserContext";

const Table = styled(RTable)`
  background-color: transparent;

  th {
    border: none !important;
  }

  td {
    /* border-top: ${({ theme }) => `1px dashed ${theme.color.monoGrey2}`}; */
    border-top: 1px dashed #2f364159;
  }
`;

const StyledFeatureLabel = styled(Typography)`
  background: ${({ theme, isActive }) =>
    isActive ? theme.color.greenMain08 : theme.color.monoWhite08};
  color: ${({ theme, isActive }) =>
    isActive ? theme.color.greenMain : theme.color.monoWhite68};
  padding: ${({ iconIndex }) =>
    iconIndex == 0
      ? "2px 9px"
      : iconIndex == 1
      ? "2px 5px"
      : iconIndex == 2
      ? "2px 5px"
      : iconIndex == 3
      ? "2px 3px"
      : "2px 14px"};
  display: inline-block;
  border-radius: ${({ iconIndex }) => (iconIndex >= 0 ? "50%" : "20px")};
  font-size: 14px;
  font-weight: 400;
`;

const ModelLabel = styled.div`
  background: ${({ theme }) => theme.color.monoGrey2};
  border-radius: 10px;
  font-size: 10px;
  font-weight: 400;
  color: ${({ theme }) => theme.color.textGrey};
  padding: 2px 4px;
`;
const stautsIcons = [
  <CloseIcon />,
  <CheckIcon />,
  <DoubleCheckIcon />,
  <TripleCheckIcon />,
];

const StakingPlanTable = ({
  currentTier,
  currentAPY,
  currentStakedBalance,
  lockPeriod,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(currentTier);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const { account } = useUser();

  const FormattedLabel = ({ feature }) => {
    const iconPatterns = ["no", "yes", "double-yes", "triple-yes"];
    let iconIndex = -1;

    for (let i = 0; i < iconPatterns.length; i++) {
      if (feature.value == iconPatterns[i]) {
        iconIndex = i;
        break;
      }
    }

    return (
      <StyledFeatureLabel
        isActive={feature.active}
        className="mt-1"
        iconIndex={iconIndex}
      >
        {iconIndex >= 0 ? stautsIcons[iconIndex] : feature.value}
      </StyledFeatureLabel>
    );
  };

  const handleDialogOpen = (index) => {
    if (index <= currentTier) return;

    setSelectedTier(index);
    setIsDialogOpen(true);
  };

  return (
    <>
      <Table className="align-items-center table-flush" responsive>
        <thead>
          <tr>
            <th scope="col"></th>
            {stakingPlanInfos.map((info, index) => (
              <th scope="col" className="text-align-center" key={index}>
                <Typography size={18} color="greenMain">
                  {info.name}
                </Typography>
                <Typography size={12} color="textGrey">
                  {info.pricing}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stakingPlanFeatures.map((feature, featureIndex) => (
            <tr key={featureIndex}>
              <td>
                <div className="d-flex align-items-center">
                  <Typography color="monoWhite" size={18} className="mr-2">
                    {feature.name}
                  </Typography>
                  <TooltipComponent title={feature.tooltip} />
                  <ModelLabel>{feature.model}</ModelLabel>
                </div>
              </td>
              {stakingPlanInfos.map((info, index) => (
                <td className="text-align-center" key={index}>
                  <FormattedLabel
                    feature={stakingPlanInfos[index]["features"][featureIndex]}
                  />
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td />
            {stakingPlanInfos.map((info, index) => (
              <td key={index}>
                {!account ? (
                  <PrimaryButton
                    className="mt-3 w-100"
                    onClick={() => setWalletModalOpen(true)}
                  >
                    Connect Wallet
                  </PrimaryButton>
                ) : (
                  <DefaultButton
                    className="w-100 mt-3"
                    size={12}
                    weight={600}
                    background={
                      index < currentTier
                        ? "monoGrey2"
                        : index == currentTier
                        ? ""
                        : "greenMain"
                    }
                    color={index <= currentTier ? "monoWhite" : "monoBlack"}
                    borderColor={index == currentTier ? "monoGrey2" : ""}
                    onClick={() => handleDialogOpen(index)}
                  >
                    {index < currentTier
                      ? "Unlocked"
                      : index === currentTier
                      ? "Current Tier"
                      : "Unlock"}
                  </DefaultButton>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </Table>
      <StakingModal
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        currentAPY={currentAPY}
        lockPeriod={lockPeriod}
        tier={selectedTier}
        stakingBalance={BigNumber(
          stakingPlans[selectedTier].unlockAmount
        ).minus(BigNumber(currentStakedBalance.toString()))}
      />
      <WalletModal open={walletModalOpen} setOpen={setWalletModalOpen} />
    </>
  );
};

export default StakingPlanTable;
