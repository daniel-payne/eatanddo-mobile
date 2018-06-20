import React, { Component } from "react";
// import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { observer } from "mobx-react";

// import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
// import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import withWidth from "@material-ui/core/withWidth";

import BackspaceIcon from "@material-ui/icons/Backspace";
import ClearAllIcon from "@material-ui/icons/ClearAll";

import "./WeightDialog.css";

class WeightDialog extends Component {
  state = {
    weight: ""
  };

  Transition = props => <Slide direction="up" {...props} />;

  handleUpdate = amount => () => {
    let newWeight = null;

    if (amount === "CLEAR") {
      newWeight = "";
    } else if (amount === "BACKSPACE") {
      const oldWeight = this.state.weight;
      if (oldWeight.length > 0) {
        newWeight = oldWeight.substring(0, oldWeight.length - 1);
      } else {
        newWeight = oldWeight;
      }
      newWeight = oldWeight.substring(0, oldWeight.length - 1);
    } else {
      newWeight = this.state.weight + amount;
    }

    this.setState({ weight: newWeight });
  };
  handleDone = () => {
    const { mealItem, onClose } = this.props;

    mealItem.updateWeight(+this.state.weight, "grams");

    this.setState({ weight: "" });

    onClose();
  };

  render = () => {
    const { Transition } = this;
    const { width, mealItem, isOpen, onClose } = this.props;

    const buttonSize = width === "lg" ? "large" : "medium";
    const foodTitle = mealItem ? mealItem.text : null;

    return (
      <Dialog
        className="WeightDialog"
        fullScreen
        open={isOpen}
        onClose={onClose}
        TransitionComponent={Transition}
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
            />

            <Button color="inherit" onClick={onClose}>
              Not Sure
            </Button>
          </Toolbar>
        </AppBar>
        <Typography
          variant="title"
          color="inherit"
          style={{
            padding: 16,
            margin: "0 auto"
          }}
        >
          {`How many grams does '${foodTitle}' weigh?`}
        </Typography>
        <div style={{ margin: "0 auto", padding: 16 }}>
          <Typography
            variant="title"
            color="inherit"
            style={{
              padding: 16,
              margin: "0 auto"
            }}
          >
            {this.state.weight}{" "}
            {this.state.weight.length === 0 ? "Enter a weight" : "grams"}
          </Typography>
        </div>
        <div style={{ margin: "0 auto", padding: 16 }}>
          <div>
            <div>
              <Button
                variant="outlined"
                size={buttonSize}
                onClick={this.handleUpdate("1")}
              >
                1
              </Button>
              <Button
                variant="outlined"
                size={buttonSize}
                onClick={this.handleUpdate("2")}
              >
                2
              </Button>
              <Button
                variant="outlined"
                size={buttonSize}
                onClick={this.handleUpdate("3")}
              >
                3
              </Button>
            </div>
          </div>
          <div>
            <div>
              <Button
                variant="outlined"
                size={buttonSize}
                onClick={this.handleUpdate("4")}
              >
                4
              </Button>
              <Button
                variant="outlined"
                size={buttonSize}
                onClick={this.handleUpdate("5")}
              >
                5
              </Button>
              <Button
                variant="outlined"
                size={buttonSize}
                onClick={this.handleUpdate("6")}
              >
                6
              </Button>
            </div>
          </div>
          <div>
            <div>
              <Button
                variant="outlined"
                size={buttonSize}
                onClick={this.handleUpdate("7")}
              >
                7
              </Button>
              <Button
                variant="outlined"
                size={buttonSize}
                onClick={this.handleUpdate("8")}
              >
                8
              </Button>
              <Button
                variant="outlined"
                size={buttonSize}
                onClick={this.handleUpdate("9")}
              >
                9
              </Button>
            </div>
          </div>
          <div>
            <div>
              <Button
                variant="outlined"
                size={buttonSize}
                onClick={this.handleUpdate("CLEAR")}
              >
                <ClearAllIcon />
              </Button>
              <Button
                variant="outlined"
                size={buttonSize}
                onClick={this.handleUpdate("0")}
              >
                0
              </Button>
              <Button
                variant="outlined"
                size={buttonSize}
                onClick={this.handleUpdate("BACKSPACE")}
              >
                <BackspaceIcon />
              </Button>
            </div>
          </div>
        </div>
        <div style={{ margin: "0 auto", padding: 16 }}>
          <div>
            <Button
              variant="raised"
              color="primary"
              disabled={this.state.weight.length === 0}
              onClick={this.handleDone}
            >
              Done
            </Button>
          </div>
        </div>
      </Dialog>
    );
  };
}

export default withWidth()(withRouter(observer(WeightDialog)));
