import { Modal as ReactModal } from "reactstrap";
import styled from "styled-components";

const Modal = styled(ReactModal)`
  > .modal-content {
    background: ${({ theme }) => theme.color.monoGrey1};
    box-shadow: 0px 2px 2px rgba(6, 19, 36, 0.24);
  }
`;

export default Modal;
