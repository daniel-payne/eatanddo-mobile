import React, { Component } from "react";
// import PropTypes from "prop-types";
// import { withRouter } from "react-router";
import { observer } from "mobx-react";

// import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
// import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
// import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
// import withWidth from "@material-ui/core/withWidth";

// import BackspaceIcon from "@material-ui/icons/Backspace";
// import ClearAllIcon from "@material-ui/icons/ClearAll";

const transition = props => <Slide direction="up" {...props} />;

class ScratchPadDialog extends Component {
  handelDone = () => {
    this.props.onClose();
  };
  handelUpdate = () => {
    this.props.entry.addEntryDescription(
      "today's breakfast two eggs 35 grams of cheese 30g of tinned tuna half a tomato and 75g of fresh asparagus"
    );

    this.handelDone();
  };
  render = () => {
    const { props } = this;
    return (
      <Dialog
        className="ScratchPadDialog"
        open={props.isOpen}
        onClose={props.onClose}
        fullScreen
        TransitionComponent={transition}
      >
        <AppBar
          style={{
            position: "relative"
          }}
        >
          <Toolbar>
            <div
              variant="title"
              color="inherit"
              style={{
                flex: 1
              }}
            >
              <Typography
                variant="title"
                color="inherit"
                style={{
                  padding: 16,
                  margin: "0 auto"
                }}
              />
            </div>

            <Button color="inherit" onClick={this.handelDone}>
              Close
            </Button>
          </Toolbar>
        </AppBar>
        <Typography
          variant="display1"
          style={{
            padding: 16,
            margin: "0 auto"
          }}
        >
          <div>
            The microphone is listing, describe your meal, then Say 'DONE' when
            finished
          </div>
        </Typography>
        <Button color="inherit" onClick={this.handelUpdate}>
          Done
        </Button>
      </Dialog>
    );
  };
}

export default observer(ScratchPadDialog);
