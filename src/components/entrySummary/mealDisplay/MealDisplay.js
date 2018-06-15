import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";

import ErrorIcon from "@material-ui/icons/Error";

import { CALCULATION_COMPLETE as ENTRY_CALCULATION_COMPLETE } from "data/models/Entry";

import "./MealDisplay.css";

const MealDisplay = props => {
  const { entry, selectedNutrition, onSelect } = props;

  let mealTitle;
  let mealInformation;
  let mealData;

  if (entry && entry.mealtime && entry.mealtime.length > 0) {
    mealTitle = entry.mealtime;
    let result = entry.nutritionPerEntry(selectedNutrition);

    if (result && !Number.isNaN(result)) {
      if (
        selectedNutrition === "energyCalories" ||
        selectedNutrition === "energyKiloJoules"
      ) {
        result = result.toFixed(0);
      } else if (
        selectedNutrition === "saltGrams" ||
        selectedNutrition === "sodiumGrams"
      ) {
        result = result.toFixed(2);
      } else {
        result = result.toFixed(1);
      }
    }

    mealData = result;
  } else {
    mealInformation = "Select a mealtime";
  }

  return (
    <ListItem button onClick={onSelect ? onSelect : null}>
      <Avatar>M</Avatar>
      <ListItemText primary={mealTitle} secondary={mealInformation} />
      <ListItemIcon>
        {entry.calculationStatus === ENTRY_CALCULATION_COMPLETE ? (
          <Avatar className="data-avatar">{mealData}</Avatar>
        ) : (
          <ErrorIcon />
        )}
      </ListItemIcon>
    </ListItem>
  );
};

MealDisplay.propTypes = {
  entry: PropTypes.object.isRequired,
  selectedNutrition: PropTypes.object.isRequired,

  onSelect: PropTypes.func.isRequired
};

export default observer(MealDisplay);
