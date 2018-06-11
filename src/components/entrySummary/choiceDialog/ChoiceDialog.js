import React from "react";
// import PropTypes from "prop-types";
// import { withRouter } from "react-router";
import { observer } from "mobx-react";

// import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
// import Slide from "@material-ui/core/Slide";
// import AppBar from "@material-ui/core/AppBar";
// import Toolbar from "@material-ui/core/Toolbar";
// import IconButton from "@material-ui/core/IconButton";
// import Typography from "@material-ui/core/Typography";
// import withWidth from "@material-ui/core/withWidth";

// import BackspaceIcon from "@material-ui/icons/Backspace";
// import ClearAllIcon from "@material-ui/icons/ClearAll";

const ChoiceDialog = props => {
  return (
    <Dialog open={props.isOpen} onClose={props.onClose("isChoiceelectorOpen")}>
      <DialogTitle id="simple-dialog-title">
        Which Do you want to change
      </DialogTitle>
      <div style={{ textAlign: "center", padding: 8 }}>
        <Button onClick={props.onOpenChoice("isAmountSelectorOpen")}>
          Weight
        </Button>
        <br />
        <Button onClick={props.onOpenChoice("isMatchSelectorOpen")}>
          Source of Nutritional Information
        </Button>
      </div>
    </Dialog>
  );
};

export default observer(ChoiceDialog);
