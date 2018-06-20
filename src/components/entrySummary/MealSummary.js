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
// import ScratchPadDialog from "./scratchPadDialog/ScratchPadDialog";
import DayDialog from "./dayDialog/DayDialog";
import MealDialog from "./mealDialog/MealDialog";

import DayDisplay from "./dayDisplay/DayDisplay";
import MealDisplay from "./mealDisplay/MealDisplay";
import LineDisplay from "./lineDisplay/LineDisplay";

import LineCreator from "./lineCreator/LineCreator";

import "./MealSummary.css";

class MealSummary extends Component {
  static propTypes = {
    meal: PropTypes.object,
    preference: PropTypes.object
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
    this.state.selectedLine.meal.removeItem(this.state.selectedLine);
    this.setState({ selectedLine: null, isChoiceSelectorOpen: false });
  };
  handleDaySelect = () => {
    this.setState({ isDaySelectorOpen: true });
  };
  handleMealSelect = () => {
    this.setState({ isMealSelectorOpen: true });
  };
  handleLineSelect = item => () => {
    item.meal.day.store.chooseSearch(item).then(() => {
      if (!item.quantity || item.unit === "") {
        this.setState({ selectedLine: item, isAmountSelectorOpen: true });
      } else {
        this.setState({ selectedLine: item, isChoiceSelectorOpen: true });
      }
    });
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
    const { meal, preference } = this.props;
    const {
      isAmountSelectorOpen,
      isMatchSelectorOpen,
      isChoiceSelectorOpen,
      // isScratchPadOpen,
      isDaySelectorOpen,
      isMealSelectorOpen,
      selectedLine
    } = this.state;
    const { selectedNutrition } = preference || {};
    const { day } = meal || {};

    if (!meal) {
      return null;
    }

    return (
      <div
        className="MealSummary"
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
            margin: 8,
            display: "none"
          }}
          onClick={handleOpen("isScratchPadOpen")}
        >
          <MicrophoneIcon />
        </Button>
        <List>
          <DayDisplay
            day={day}
            selectedNutrition={selectedNutrition}
            onSelect={handleDaySelect}
          />
          <MealDisplay
            meal={meal}
            selectedNutrition={selectedNutrition}
            onSelect={handleMealSelect}
          />
          <Divider />
          <LineCreator meal={meal} />
          <Divider />
          {meal.items.map((item, i) => (
            <LineDisplay
              item={item}
              no={i}
              onSelect={handleLineSelect(item)}
              key={i}
              selectedNutrition={selectedNutrition}
            />
          ))}
        </List>

        <div className="bottom-seperator" />

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
        {/* <ScratchPadDialog
          isOpen={isScratchPadOpen}
          onClose={handleClose("isScratchPadOpen")}
          meal={meal}
        /> */}
        <DayDialog
          isOpen={isDaySelectorOpen}
          onClose={handleClose("isDaySelectorOpen")}
          day={day}
        />
        <MealDialog
          isOpen={isMealSelectorOpen}
          onClose={handleClose("isMealSelectorOpen")}
          meal={meal}
        />
      </div>
    );
  }
}

export default withRouter(observer(MealSummary));
