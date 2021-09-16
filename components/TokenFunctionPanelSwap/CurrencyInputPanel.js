import {
  FormGroup,
  Input as DefaultInput,
  InputGroup as DefaultInputGroup,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
} from "reactstrap";
import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Typography from "../Typography";
import {
  Currencies,
  getBalance,
  getCurrencyById,
} from "../../utils/currencies";
import { useUser } from "contexts/UserContext";
import useDebounce from "../../utils/hooks/useDebounce";
import { toast } from "react-toastify";

const Input = styled(DefaultInput)`
  color: ${({ theme }) => `${theme.color.default} !important`};
  font-weight: 600;
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
  border: none;
  padding: 28px 26px 35px;
  border-radius: 10px;
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
`;

const CurrencyContainer = styled.div`
  position: absolute;
  right: 12px;
  top: 9px;
`;

const CurrencyItem = styled.div`
  display: flex;
  background: ${({ theme }) => theme.color.bg10};
  color: ${({ theme }) => theme.color.text10};
  padding: 7px 21px;
  border-radius: 12px;
  cursor: pointer;
  &:hover {
    background: #eeeeee;
  }
`;

const InputGroup = styled(DefaultInputGroup)`
  background: ${({ theme }) => `${theme.color.violet0} !important`};
  position: relative;
  border-radius: 10px;
`;

const CurrencyInputPanel = ({
  onAmountChange,
  label,
  amount,
  selectedCurrency,
  setSelectedCurrency,
  disabled,
  USDValue,
}) => {
  const [dropdownOpen, setOpen] = useState(false);
  const [balance, setBalance] = useState("0");
  const { library, account, network, chainId } = useUser();
  const debouncedAmount = useDebounce(amount);

  useEffect(() => updateBalance(selectedCurrency), [account, selectedCurrency]);

  useEffect(() => {
    if (debouncedAmount) updateBalance(selectedCurrency);
  }, [debouncedAmount]);

  const toggle = () => setOpen(!dropdownOpen);

  const getCurrency = useCallback(
    () => getCurrencyById(selectedCurrency),
    [selectedCurrency]
  );

  const getIcon = useCallback(() => {
    const currency = getCurrency();
    return currency ? currency.icon : "'";
  }, [selectedCurrency]);

  const getName = useCallback(() => {
    const currency = getCurrency();
    return currency ? currency.name : "'";
  }, [selectedCurrency]);

  const changeprice = async (e) => {
    onAmountChange(e.target.value);
  };

  const updateBalance = async (currencyId) => {
    try {
      if (!library) return;
      const signer = await library.getSigner(account);
      const balance = await getBalance(currencyId, account, {
        chainId,
        signer,
      });
      setBalance(balance);
    } catch (error) {
      toast(
        `unable to fetch the latest balance of ${currencyId.toUpperCase()}`,
        {
          type: "error",
          toastId: `balance-${currencyId}`,
        }
      );
      console.log("error", error);
    }
  };

  const handleCurrencyChange = (currencyId) => {
    setSelectedCurrency(currencyId);
    updateBalance(currencyId);
  };

  const handleMaxClick = () => {
    if (!balance) return;
    onAmountChange(balance);
  };

  return (
    <FormGroup className="my-4 w-100">
      <Typography size={12} weight={300} className="pl-1">
        {label}
      </Typography>
      <InputGroup>
        <Input
          placeholder={balance}
          onChange={changeprice}
          value={amount}
          type="text"
          disabled={disabled}
        />
        <CurrencyContainer>
          <ButtonDropdown
            isOpen={dropdownOpen}
            toggle={toggle}
            disabled={disabled}
          >
            <DropdownToggle type="button" color="secondary" caret>
              <img
                alt="..."
                src={getIcon()}
                style={{ width: "15px" }}
                className="mr-2"
              />
              {getName()}
            </DropdownToggle>
            <DropdownMenu>
              {Object.values(Currencies).map((value) =>
                value.allowInDropdown ? (
                  <DropdownItem
                    onClick={() => handleCurrencyChange(value.id)}
                    key={value.id}
                  >
                    {value.name}
                  </DropdownItem>
                ) : null
              )}
            </DropdownMenu>
          </ButtonDropdown>
        </CurrencyContainer>
      </InputGroup>
      <div className="d-flex justify-content-between">
        <Typography size={16} weight={400} color="text5">
          {USDValue ? `~ $ ${USDValue}` : null}
        </Typography>
        <div className="d-flex">
          <Typography size={16} color="text1">
            Balance: {balance}
          </Typography>
          <Typography
            size={16}
            color="link1"
            weight={600}
            className="ml-2"
            onClick={handleMaxClick}
            role="button"
          >
            MAX
          </Typography>
        </div>
      </div>
    </FormGroup>
  );
};

CurrencyInputPanel.defaultProps = {
  selectedCurrency: Currencies.ETH.id,
  setSelectedCurrency: () => console.log("Currency change is not handled"),
};

export default CurrencyInputPanel;
