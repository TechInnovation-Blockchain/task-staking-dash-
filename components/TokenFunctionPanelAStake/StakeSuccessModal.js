import React from "react";

// reactstrap components
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { GradientButton, OutlinedButton } from "../Buttons";
import { ResultLabel, DetailLabel } from "./Label";

function StakeSuccessModal({ modalOpen, setModalOpen, title, itemsList, resultsList, primaryAction, secondaryAction }) {
  return (
    <>
      <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen}>
        <div className=" modal-header">
          <h5 className=" modal-title " id="exampleModalLabel">
            {title}
          </h5>
          <button aria-label="Close" className=" close" type="button" onClick={() => setModalOpen(!modalOpen)}>
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <ModalBody>
          {itemsList.map((item, index) => (
            <DetailLabel key={index} title={item.label} desc={item.desc} />
          ))}
          {/* <DetailLabel title="Staked" desc="960.0000 SDAO LP" />
          <DetailLabel title="APY (approx.)" desc="34.74 %" /> */}
          <hr />
          {resultsList.map((result, index) => (
            <ResultLabel key={index} title={result.label} desc={result.desc} />
          ))}
        </ModalBody>
        <ModalFooter className="d-flex justify-content-center">
          <OutlinedButton color="interactive2" type="button" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </OutlinedButton>
          <GradientButton type="button" className="py-2" onClick={primaryAction.onClick}>
            {primaryAction.label}
          </GradientButton>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default StakeSuccessModal;
