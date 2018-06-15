import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";

import "./ChoiceDialog.css";

const ChoiceDialog = props => {
  return (
    <Dialog
      className="ChoiceDialog"
      open={props.isOpen}
      onBackdropClick={props.onClose}
      onEscapeKeyDown={props.onClose}
    >
      <DialogTitle id="simple-dialog-title">
        Which Do you want to change
      </DialogTitle>
      <div className="actions--centered">
        <Button onClick={props.onOpenChoice("isAmountSelectorOpen")}>
          Weight
        </Button>
        <br />
        <Button onClick={props.onOpenChoice("isMatchSelectorOpen")}>
          Nutritional Information
        </Button>
      </div>
      <div className="actions--centered">
        <Button onClick={props.onDeleteChoice}>Delete Item</Button>
      </div>
    </Dialog>
  );
};

ChoiceDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,

  onClose: PropTypes.func.isRequired,
  onOpenChoice: PropTypes.func.isRequired,
  onDeleteChoice: PropTypes.func.isRequired
};

export default observer(ChoiceDialog);
