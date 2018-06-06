import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { observer } from "mobx-react";

import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";

import ErrorIcon from "@material-ui/icons/Error";
import DoneIcon from "@material-ui/icons/Done";

import WeightDialog from "./weightDialog/WeightDialog";
import MatchesDialog from "./matchesDialog/MatchesDialog";

import "./EntrySummary.css";

class EntrySummary extends Component {
  static propTypes = {
    entry: PropTypes.object
  };
  state = {
    isChoiceelectorOpen: false,
    isAmountSelectorOpen: false,
    isMatchSelectorOpen: false,
    selectedMealItem: undefined
  };
  handelDone = () => {
    // this.props.meal.updateMealDescription(this.state.mealDescription);
    // this.setState({ mealDescription: null });
    this.props.history.push(`meal-description`);
  };
  handleOpen = name => () => {
    this.setState({ [name]: true, isChoiceelectorOpen: false });
  };
  handleClose = name => () => {
    this.setState({ [name]: false });

    this.props.entry.updateAllCalculations();
  };
  handelSelect = mealItem => () => {
    if (mealItem.status === "NO_MEASUREMENT") {
      this.setState({ selectedMealItem: mealItem, isAmountSelectorOpen: true });
    } else {
      this.setState({ selectedMealItem: mealItem, isMatchSelectorOpen: true });
    }
  };
  render() {
    const { entry } = this.props;

    if (!entry) {
      return null;
    }

    return (
      <div
        className="EntrySummary"
        style={{ overflowX: "auto", height: "calc(100% - 64px)" }}
      >
        <List>
          <ListItem button>
            <Avatar>D</Avatar>
            <ListItemText
              primary={entry.mealDay}
              secondary={entry.mealDayInformation}
            />
            <ListItemIcon>
              {entry.mealDayStatus === "OK" ? <DoneIcon /> : <ErrorIcon />}
            </ListItemIcon>
          </ListItem>

          <ListItem button>
            <Avatar>M</Avatar>
            <ListItemText
              primary={entry.mealTime}
              secondary={entry.mealTimeInformation}
            />
            <ListItemIcon>
              {entry.mealTimeStatus === "OK" ? <DoneIcon /> : <ErrorIcon />}
            </ListItemIcon>
          </ListItem>

          <Divider />

          {entry.lines.map((item, i) => {
            return (
              <ListItem button key={i} onClick={this.handelSelect(item)}>
                <Avatar>{i + 1}</Avatar>

                <ListItemText
                  primary={`${item.text}${
                    item.additionalText ? item.additionalText : ""
                  }`}
                  secondary={item.information}
                />
                <ListItemIcon>
                  {item.status === "OK" ? <DoneIcon /> : <ErrorIcon />}
                </ListItemIcon>
              </ListItem>
            );
          })}
        </List>

        <hr />

        <Button onClick={this.handelDone}>Save to diary</Button>

        <WeightDialog
          isOpen={this.state.isAmountSelectorOpen}
          onClose={this.handleClose("isAmountSelectorOpen")}
          mealItem={this.state.selectedMealItem}
        />

        <MatchesDialog
          isOpen={this.state.isMatchSelectorOpen}
          onClose={this.handleClose("isMatchSelectorOpen")}
          mealItem={this.state.selectedMealItem}
        />

        <Dialog
          open={this.state.isChoiceelectorOpen}
          onClose={this.handleClose("isChoiceelectorOpen")}
        >
          <DialogTitle id="simple-dialog-title">
            Which Do you want to change
          </DialogTitle>
          <div style={{ textAlign: "center", padding: 8 }}>
            <Button onClick={this.handleOpen("isAmountSelectorOpen")}>
              Weight
            </Button>
            <br />
            <Button onClick={this.handleOpen("isMatchSelectorOpen")}>
              Nutritional Information
            </Button>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default withRouter(observer(EntrySummary));
