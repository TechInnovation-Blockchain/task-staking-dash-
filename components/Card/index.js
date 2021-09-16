import styled from "styled-components";

export default styled.div`
  background-color: ${({ theme }) => theme.color.monoGrey1};
  box-shadow: 0px 2px 2px rgba(6, 19, 36, 0.24);
  border-radius: 4px;
  padding: 16px;
  text-align: ${({ align }) => (align ? align : "initial")};
  position: relative;
`;
