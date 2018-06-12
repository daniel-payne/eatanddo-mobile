import React, { Component } from "react";
// import PropTypes from "prop-types";
// import { withRouter } from "react-router";
import { observer } from "mobx-react";
import SpeechRecognition from "react-speech-recognition";

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

// var recognition = new (window.SpeechRecognition ||
//   window.webkitSpeechRecognition ||
//   window.mozSpeechRecognition ||
//   window.msSpeechRecognition)();

// recognition.lang = "en-US";
// recognition.interimResults = true;
// recognition.continuous = true;
// // recognition.maxAlternatives = 5;
// // recognition.start();

// recognition.onerror = function(event) {
//   alert(event.error);
// };

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
  render = () => {
    const { props } = this;
    const { finalTranscript } = props;

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
        open={props.isOpen}
        onClose={props.onClose}
        fullScreen
        TransitionComponent={transition}
        onEntered={this.handelEntered}
        onExited={this.handelExited}
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
          {showWarning === true ? warningText : displayText}
        </Typography>
        <Button color="inherit" onClick={this.handelUpdate}>
          Done
        </Button>
      </Dialog>
    );
  };
}

const transition = props => <Slide direction="up" {...props} />;

const speechRecognitionOptions = {
  autoStart: false,
  continuous: true,
  lang: "en-US"
};

export default SpeechRecognition(speechRecognitionOptions)(
  observer(ScratchPadDialog)
);
