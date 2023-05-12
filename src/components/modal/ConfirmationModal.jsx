import React from "react";
import "./ConfirmationModal.scss";
import CloseIcon from "@mui/icons-material/Close";
import TrashCanIcon from "../../images/trash-can.png";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
const ConfirmationModal = ({ closeConfirmationModal, handleDelete }) => {
  const handleDeleteClick = () => {
    handleDelete();
    closeConfirmationModal();
  };

  return (
    <>
      <div className="confirmationModalWrapper">
        <div className="confirmationModalContainer">
          <div className="confirmationModalCloseBtn">
            <button onClick={closeConfirmationModal}>
              <CloseIcon style={{ fontSize: 15 }} />
            </button>
          </div>
          <div className="confirmationModalHeader">
            <h6>Confirm Deletion</h6>
          </div>

          <div className="confirmationModalContent">
            <DeleteForeverIcon className="deleteForeverIcon" />
            <p>Are you sure you want to delete the data?</p>
            <div className="confirmationModalActions">
              <button onClick={handleDeleteClick}>Yes</button>
              <button onClick={closeConfirmationModal}>No</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;
