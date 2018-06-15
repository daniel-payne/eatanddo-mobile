import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";

import ErrorIcon from "@material-ui/icons/Error";

import { CALCULATION_COMPLETE as LINE_CALCULATION_COMPLETE } from "data/models/EntryLine";

import "./LineDisplay.css";

const LineDisplay = props => {
  const { item, no, selectedNutrition, onSelect } = props;

  let statusMessage = item.selectedFood ? item.selectedFood.foodName : null;

  if (!item.quantity || !item.unit) {
    statusMessage = `How much does ${item.text} weigh`;
  }

  let result = item.nutritionPerLine(selectedNutrition);

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

  return (
    <ListItem className="LineDisplay" button onClick={onSelect}>
      <Avatar>{no + 1}</Avatar>

      <ListItemText
        primary={`${item.text}${
          item.additionalText ? item.additionalText : ""
        }`}
        secondary={statusMessage}
      />
      <ListItemIcon>
        {item.calculationStatus === LINE_CALCULATION_COMPLETE ? (
          <Avatar className="data-avatar">{result}</Avatar>
        ) : (
          <ErrorIcon />
        )}
      </ListItemIcon>
    </ListItem>
  );
};

LineDisplay.propTypes = {
  item: PropTypes.object.isRequired,
  no: PropTypes.number.isRequired,
  selectedNutrition: PropTypes.object.isRequired,

  onSelect: PropTypes.func.isRequired
};

export default observer(LineDisplay);
