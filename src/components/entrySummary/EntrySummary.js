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
// import DialogTitle from "@material-ui/core/DialogTitle";
// import Dialog from "@material-ui/core/Dialog";
// import TextField from "@material-ui/core/TextField";

import ErrorIcon from "@material-ui/icons/Error";
import MicrophoneIcon from "@material-ui/icons/Mic";
// import DoneIcon from "@material-ui/icons/Done";

import WeightDialog from "./weightDialog/WeightDialog";
import MatchesDialog from "./matchesDialog/MatchesDialog";
import ChoiceDialog from "./choiceDialog/ChoiceDialog";
import ScratchPadDialog from "./scratchPadDialog/ScratchPadDialog";
import DayDialog from "./dayDialog/DayDialog";
import MealDialog from "./mealDialog/MealDialog";

import DayDisplay from "./dayDisplay/DayDisplay";
import MealDisplay from "./mealDisplay/MealDisplay";
import LineCreator from "./lineCreator/LineCreator";

import "./EntrySummary.css";

// import { CALCULATION_COMPLETE as ENTRY_CALCULATION_COMPLETE } from "../../data/models/Entry";
import { CALCULATION_COMPLETE as LINE_CALCULATION_COMPLETE } from "../../data/models/EntryLine";

class EntrySummary extends Component {
  static propTypes = {
    entry: PropTypes.object
  };
  state = {
    isChoiceSelectorOpen: false,
    isDaySelectorOpen: false,
    isMealSelectorOpen: false,
    isAmountSelectorOpen: false,
    isScratchPadOpen: false,
    isMatchSelectorOpen: false,
    selectedLine: undefined
  };
  handelDone = () => {
    // this.props.meal.updateMealDescription(this.state.mealDescription);
    // this.setState({ mealDescription: null });
    this.props.history.push(`meal-description`);
  };
  handleOpen = name => () => {
    this.setState({ [name]: true, isChoiceSelectorOpen: false });
  };
  handleClose = name => () => {
    this.setState({ [name]: false });
  };
  handelDaySelect = () => {
    this.setState({ isDaySelectorOpen: true });
  };
  handelMealSelect = () => {
    this.setState({ isMealSelectorOpen: true });
  };
  handelLineSelect = line => () => {
    if (!line.quantity || line.unit === "") {
      this.setState({ selectedLine: line, isAmountSelectorOpen: true });
      // } else if (line.additionalText) {
      //   this.setState({ selectedLine: line, isChoiceSelectorOpen: true });
      // } else {
      //   this.setState({ selectedLine: line, isMatchSelectorOpen: true });
      // }
    } else {
      this.setState({ selectedLine: line, isChoiceSelectorOpen: true });
    }
  };
  render() {
    const { entry } = this.props;

    // const dayInformation = "";
    // const mealInformation = Math.round(entry.energyCaloriesPerEntry);

    if (!entry) {
      return null;
    }

    return (
      <div
        className="EntrySummary"
        style={{ overflowX: "auto", height: "calc(100% - 64px)" }}
      >
        <Button
          variant="fab"
          color="primary"
          aria-label="microphone"
          style={{
            bottom: 0,
            right: 0,
            position: "absolute",
            zIndex: 999,
            margin: 8
          }}
          onClick={this.handleOpen("isScratchPadOpen")}
        >
          <MicrophoneIcon />
        </Button>

        <List>
          <DayDisplay entry={entry} onSelect={this.handelDaySelect} />
          <MealDisplay entry={entry} onSelect={this.handelMealSelect} />
          <Divider />

          <LineCreator entry={entry} />
          <Divider />

          {entry.lines.map((item, i) => {
            let statusMessage = item.selectedFood
              ? item.selectedFood.foodName
              : null;

            if (!item.quantity || !item.unit) {
              statusMessage = `How much does ${item.text} weigh`;
            }

            return (
              <ListItem button key={i} onClick={this.handelLineSelect(item)}>
                <Avatar>{i + 1}</Avatar>

                <ListItemText
                  primary={`${item.text}${
                    item.additionalText ? item.additionalText : ""
                  }`}
                  secondary={statusMessage}
                />
                <ListItemIcon>
                  {item.calculationStatus === LINE_CALCULATION_COMPLETE ? (
                    <Avatar
                      style={{ backgroundColor: "white", color: "black" }}
                    >
                      {Math.round(item.energyCaloriesPerLine)}
                    </Avatar>
                  ) : (
                    <ErrorIcon />
                  )}
                </ListItemIcon>
              </ListItem>
            );
          })}
        </List>

        <div style={{ height: 56 }} />

        <WeightDialog
          isOpen={this.state.isAmountSelectorOpen}
          onClose={this.handleClose("isAmountSelectorOpen")}
          mealItem={this.state.selectedLine}
        />

        <MatchesDialog
          isOpen={this.state.isMatchSelectorOpen}
          onClose={this.handleClose("isMatchSelectorOpen")}
          mealItem={this.state.selectedLine}
          isAllMatches={
            this.state.selectedLine && this.state.selectedLine.search
              ? this.state.selectedLine.search.isAllMatches
              : null
          }
        />

        <ChoiceDialog
          isOpen={this.state.isChoiceSelectorOpen}
          onClose={this.handleClose}
          onOpenChoice={this.handleOpen}
        />

        <ScratchPadDialog
          isOpen={this.state.isScratchPadOpen}
          onClose={this.handleClose("isScratchPadOpen")}
          entry={this.props.entry}
        />

        <DayDialog
          isOpen={this.state.isDaySelectorOpen}
          onClose={this.handleClose("isDaySelectorOpen")}
          entry={this.props.entry}
        />

        <MealDialog
          isOpen={this.state.isMealSelectorOpen}
          onClose={this.handleClose("isMealSelectorOpen")}
          entry={this.props.entry}
        />
      </div>
    );
  }
}

export default withRouter(observer(EntrySummary));
