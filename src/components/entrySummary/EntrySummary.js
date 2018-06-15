import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { observer } from "mobx-react";

import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";

import MicrophoneIcon from "@material-ui/icons/Mic";

import WeightDialog from "./weightDialog/WeightDialog";
import MatchesDialog from "./matchesDialog/MatchesDialog";
import ChoiceDialog from "./choiceDialog/ChoiceDialog";
import ScratchPadDialog from "./scratchPadDialog/ScratchPadDialog";
import DayDialog from "./dayDialog/DayDialog";
import MealDialog from "./mealDialog/MealDialog";

import DayDisplay from "./dayDisplay/DayDisplay";
import MealDisplay from "./mealDisplay/MealDisplay";
import LineDisplay from "./lineDisplay/LineDisplay";

import LineCreator from "./lineCreator/LineCreator";

import "./EntrySummary.css";

class EntrySummary extends Component {
  static propTypes = {
    entry: PropTypes.object,
    display: PropTypes.object
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
    this.props.history.push(`meal-description`);
  };
  handleOpen = name => () => {
    this.setState({ [name]: true, isChoiceSelectorOpen: false });
  };
  handleClose = name => () => {
    this.setState({ [name]: false });
  };
  handleDelete = () => {
    this.props.entry.removeLine(this.state.selectedLine);
    this.setState({ selectedLine: null, isChoiceSelectorOpen: false });
  };
  handleDaySelect = () => {
    this.setState({ isDaySelectorOpen: true });
  };
  handleMealSelect = () => {
    this.setState({ isMealSelectorOpen: true });
  };
  handleLineSelect = line => () => {
    if (!line.quantity || line.unit === "") {
      this.setState({ selectedLine: line, isAmountSelectorOpen: true });
    } else {
      this.setState({ selectedLine: line, isChoiceSelectorOpen: true });
    }
  };

  render() {
    const {
      handleOpen,
      handleDaySelect,
      handleMealSelect,
      handleLineSelect,
      handleClose,
      handleDelete
    } = this;
    const { entry, display } = this.props;
    const {
      isAmountSelectorOpen,
      isMatchSelectorOpen,
      isChoiceSelectorOpen,
      isScratchPadOpen,
      isDaySelectorOpen,
      isMealSelectorOpen,
      selectedLine
    } = this.state;
    const { selectedNutrition } = display || {};

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
          onClick={handleOpen("isScratchPadOpen")}
        >
          <MicrophoneIcon />
        </Button>

        <List>
          <DayDisplay entry={entry} onSelect={handleDaySelect} />
          <MealDisplay
            entry={entry}
            onSelect={handleMealSelect}
            selectedNutrition={selectedNutrition}
          />
          <Divider />

          <LineCreator entry={entry} />
          <Divider />

          {entry.lines.map((item, i) => (
            <LineDisplay
              item={item}
              no={i}
              onSelect={handleLineSelect(item)}
              key={i}
              selectedNutrition={selectedNutrition}
            />
          ))}
        </List>

        <div style={{ height: 56 }} />

        <WeightDialog
          isOpen={isAmountSelectorOpen}
          onClose={handleClose("isAmountSelectorOpen")}
          mealItem={selectedLine}
        />

        <MatchesDialog
          isOpen={isMatchSelectorOpen}
          onClose={handleClose("isMatchSelectorOpen")}
          mealItem={selectedLine}
          isAllMatches={
            selectedLine && selectedLine.search
              ? selectedLine.search.isAllMatches
              : null
          }
        />

        <ChoiceDialog
          isOpen={isChoiceSelectorOpen}
          onClose={handleClose("isChoiceSelectorOpen")}
          onOpenChoice={handleOpen}
          onDeleteChoice={handleDelete}
        />

        <ScratchPadDialog
          isOpen={isScratchPadOpen}
          onClose={handleClose("isScratchPadOpen")}
          entry={entry}
        />

        <DayDialog
          isOpen={isDaySelectorOpen}
          onClose={handleClose("isDaySelectorOpen")}
          entry={entry}
        />

        <MealDialog
          isOpen={isMealSelectorOpen}
          onClose={handleClose("isMealSelectorOpen")}
          entry={entry}
        />
      </div>
    );
  }
}

export default withRouter(observer(EntrySummary));
