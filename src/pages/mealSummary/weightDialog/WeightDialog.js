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
  transition = props => {
    return <Slide direction="up" {...props} />;
  };
  onUpdate = amount => () => {
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
  onDone = () => {
    this.props.mealItem.updateWeight(+this.state.weight, "grams");
    this.setState({ weight: "" });
    this.props.onClose();
  };
  render = () => {
    const buttonSize = this.props.width === "lg" ? "large" : "medium";
    const foodTitle = this.props.mealItem ? this.props.mealItem.text : null;
    return (
      <Dialog
        fullScreen
        open={this.props.isOpen}
        onClose={this.props.onClose}
        TransitionComponent={this.transition}
        className="WeightDialog"
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

            <Button color="inherit" onClick={this.props.onClose}>
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
                color="primary"
                variant="outlined"
                size={buttonSize}
                onClick={this.onUpdate("1")}
              >
                1
              </Button>
              <Button
                color="primary"
                variant="outlined"
                size={buttonSize}
                onClick={this.onUpdate("2")}
              >
                2
              </Button>
              <Button
                color="primary"
                variant="outlined"
                size={buttonSize}
                onClick={this.onUpdate("3")}
              >
                3
              </Button>
            </div>
          </div>
          <div>
            <div>
              <Button
                color="primary"
                variant="outlined"
                size={buttonSize}
                onClick={this.onUpdate("4")}
              >
                4
              </Button>
              <Button
                color="primary"
                variant="outlined"
                size={buttonSize}
                onClick={this.onUpdate("5")}
              >
                5
              </Button>
              <Button
                color="primary"
                variant="outlined"
                size={buttonSize}
                onClick={this.onUpdate("6")}
              >
                6
              </Button>
            </div>
          </div>
          <div>
            <div>
              <Button
                color="primary"
                variant="outlined"
                size={buttonSize}
                onClick={this.onUpdate("7")}
              >
                7
              </Button>
              <Button
                color="primary"
                variant="outlined"
                size={buttonSize}
                onClick={this.onUpdate("8")}
              >
                8
              </Button>
              <Button
                color="primary"
                variant="outlined"
                size={buttonSize}
                onClick={this.onUpdate("9")}
              >
                9
              </Button>
            </div>
          </div>
          <div>
            <div>
              <Button
                color="primary"
                variant="outlined"
                size={buttonSize}
                onClick={this.onUpdate("CLEAR")}
              >
                <ClearAllIcon />
              </Button>
              <Button
                color="primary"
                variant="outlined"
                size={buttonSize}
                onClick={this.onUpdate("0")}
              >
                0
              </Button>
              <Button
                color="primary"
                variant="outlined"
                size={buttonSize}
                onClick={this.onUpdate("BACKSPACE")}
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
              onClick={this.onDone}
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
