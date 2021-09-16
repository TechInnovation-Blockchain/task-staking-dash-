import { Button } from "reactstrap";
import styled from "styled-components";
import CloseIcon from "@material-ui/icons/Close";

export const PrimaryButton = styled(Button)`
  padding: 10px 33px;
  border-radius: 4px;
  color: ${({ theme }) => `${theme.color.monoBlack} !important`};
  filter: drop-shadow(0px 4px 6px rgba(50, 50, 93, 0.11));
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  background: ${({ theme }) => theme.color.greenMain};
  text-transform: uppercase;

  &:disabled {
    background: ${({ theme }) => theme.color.monoGrey1};
    color: ${({ theme }) => `${theme.color.monoWhite} !important`};
    opacity: 1;
  }
`;

PrimaryButton.defaultProps = {
  color: "",
};

export const SecondaryButton = styled(Button)`
  padding: 10px 33px;
  border-radius: 4px;
  color: ${({ theme }) => `${theme.color.monoWhite} !important`};
  filter: drop-shadow(0px 4px 6px rgba(50, 50, 93, 0.11));
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  background: ${({ theme }) => theme.color.monoGrey2};
  text-transform: uppercase;
`;

SecondaryButton.defaultProps = {
  color: "",
};

export const GradientButton = styled(Button)`
  background: #7800ff;
  color: ${({ theme }) => `${theme.color.white} !important`};
  font-weight: 600;
  font-size: 16px;
  padding: 5px 36px;
  border-radius: 8px;
`;

GradientButton.defaultProps = {
  color: "",
};

export const AirdropButton = styled(Button)`
  justify-content: center;
  align-items: center;
  padding: 20px 44px;
  position: static;
  color: #ffff;
  width: 243px;
  height: 56px;
  background: #7800ff;
  border-radius: 4px;
`;

export const DefaultButton = styled(Button)`
  background: ${({ theme, background }) =>
    background ? theme.color[background] : "transparent"};
  color: ${({ theme, color }) =>
    `${color ? theme.color[color] : theme.color.monoBlack} !important`};
  border-color: ${({ theme, borderColor }) =>
    `${borderColor ? theme.color[borderColor] : "none"} !important`};
  border-radius: 4px;
  font-weight: ${({ weight }) => (weight ? weight : "600")};
  font-size: ${({ size }) => (size ? size + "px" : "initial")};
  margin: 0;
  text-transform: ${({ transform }) => (transform ? transform : "uppercase")};
  opacity: ${({ opacity }) => (opacity ? opacity : 1)};
  text-decoration: ${({ decoration }) =>
    `${decoration ? decoration : "initial"} !important`};
`;

DefaultButton.defaultProps = {
  color: "",
};

export const OutlinedButton = styled(Button)`
  border: ${({ theme, color }) =>
    ` 1px solid ${color ? theme.color[color] : theme.color.default}`};
  border-radius: 8px;
  padding: 10px 36px;
  color: ${({ theme, color }) =>
    color ? theme.color[color] : theme.color.default};
  font-size: 14px;

  &:hover {
    color ${({ theme, color }) =>
      color ? theme.color[color] : theme.color.default};
  }
`;

OutlinedButton.defaultProps = {
  color: "",
  outline: true,
};

export const BlueButton = styled(Button)`
  background: ${({ theme }) => theme.color.secondary1};
  color: ${({ theme }) => `${theme.color.white} !important`};
  font-weight: 600;
  font-size: 16px;
  padding: 10px 36px;
`;

BlueButton.defaultProps = {
  color: "",
};

export const LinkButton = styled(Button)`
  background: none !important;
  padding: 0px;
  color: ${({ theme, color }) =>
    `${color ? theme.color[color] : theme.color.monoBlack} !important`};
  font-size: ${({ size }) => (size ? size + "px" : "initial")};
  font-weight: ${({ weight }) => (weight ? weight : "600")};
  z-index: 2;
`;

export const IconButton = styled.button`
  flex: 0 0 auto;
  color: rgba(0, 0, 0, 0.54);
  padding: 12px;
  overflow: visible;
  font-size: 1.5rem;
  text-align: center;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  border-radius: 50%;
  justify-content: center;
  text-decoration: none;
  background-color: transparent;
  -webkit-appearance: none;
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
`;

export const CloseIconButton = styled(CloseIcon)`
  &:hover {
    cursor: pointer;
  }
`;
