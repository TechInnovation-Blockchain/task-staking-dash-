import { Row, Col, CardHeader, CardBody } from "reactstrap";
import styled from "styled-components";
import Typography from "../Typography";
import CheckIcon from "../../assets/img/icons/tab-check.svg";

const TabLabel = styled(Typography)`
  color: ${({ theme }) => theme.color.monoWhite};
  font-weight: 600;
  font-size: 10px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1.5px;
`;

const TabWrapper = styled.div`
  padding: 5px 14px;
  border-radius: 20px;
  border: ${({ theme }) => `1px solid ${theme.color.monoGrey2}`};
  background: ${({ theme, active }) =>
    active ? theme.color.monoGrey2 : "transparent"};
  display: flex;
`;

const Tabs = ({ activeTab, setActiveTab, tabs }) => {
  return (
    <Row className="justify-content-center">
      {tabs.map((tab, index) => (
        <Col className="col-auto" key={index}>
          <TabWrapper
            active={activeTab === index}
            onClick={() => setActiveTab(index)}
          >
            {activeTab === index && <CheckIcon className="mr-1" />}
            <TabLabel>{tab}</TabLabel>
          </TabWrapper>
        </Col>
      ))}
    </Row>
  );
};

export default Tabs;
