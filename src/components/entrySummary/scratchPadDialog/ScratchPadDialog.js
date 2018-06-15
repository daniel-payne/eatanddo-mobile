import React, { Component } from "react";
import { observer } from "mobx-react";
import SpeechRecognition from "react-speech-recognition";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import "./ScratchPadDialog.css";

class ScratchPadDialog extends Component {
  handelEntered = () => {
    this.props.resetTranscript();
    this.props.startListening();
  };
  handelExited = () => {
    this.props.abortListening();
  };
  handelDone = () => {
    this.props.onClose();
  };
  handelUpdate = () => {
    const { finalTranscript } = this.props;

    let displayArray = finalTranscript.split(" ");

    displayArray = Array.from(new Set(displayArray));

    const displayText = displayArray.join(" ");

    this.props.entry.addEntryDescription(displayText);

    this.handelDone();
  };

  Transition = props => <Slide direction="up" {...props} />;

  render = () => {
    const { Transition, handelEntered, handelExited } = this;
    const { finalTranscript, isOpen, onClose } = this.props;

    const warningText =
      this.props.browserSupportsSpeechRecognition === true
        ? "The microphone is listing, describe your meal, then Say 'DONE' when finished"
        : "This browser can't listen to you, please use the 'Add item' box on the main screen or view the page with Chrome browser";

    let showWarning = true;
    let displayArray = finalTranscript.split(" ");

    displayArray = Array.from(new Set(displayArray));

    const displayText = displayArray.join(" ");

    if (finalTranscript.length > 0) {
      showWarning = false;
    }

    return (
      <Dialog
        className="ScratchPadDialog"
        open={isOpen}
        onClose={onClose}
        fullScreen
        TransitionComponent={Transition}
        onEntered={handelEntered}
        onExited={handelExited}
      >
        <AppBar className="title_bar">
          <Toolbar>
            <div className="title__container" variant="title" color="inherit">
              <Typography
                className="title__text"
                variant="title"
                color="inherit"
              />
            </div>

            <Button color="inherit" onClick={this.handelDone}>
              Close
            </Button>
          </Toolbar>
        </AppBar>
        <Typography className="title__info" variant="display1">
          {showWarning === true ? warningText : displayText}
        </Typography>
        <Button color="inherit" onClick={this.handelUpdate}>
          Done
        </Button>
      </Dialog>
    );
  };
}

const speechRecognitionOptions = {
  autoStart: false,
  continuous: true,
  lang: "en-US"
};

export default SpeechRecognition(speechRecognitionOptions)(
  observer(ScratchPadDialog)
);
