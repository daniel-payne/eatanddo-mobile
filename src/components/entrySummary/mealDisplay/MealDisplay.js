import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";

import ErrorIcon from "@material-ui/icons/Error";

import { CALCULATION_COMPLETE as ENTRY_CALCULATION_COMPLETE } from "data/models/Entry";

const MealDisplay = props => {
  const { entry } = props;

  let mealTitle;
  let mealInformation;
  let mealData;

  if (entry && entry.mealtime && entry.mealtime.length > 0) {
    mealTitle = entry.mealtime;
    mealData = Math.round(entry.energyCaloriesPerEntry);
  } else {
    mealInformation = "Select a mealtime";
  }

  return (
    <ListItem button onClick={props.onSelect ? props.onSelect : null}>
      <Avatar>M</Avatar>
      <ListItemText primary={mealTitle} secondary={mealInformation} />
      <ListItemIcon>
        {entry.calculationStatus === ENTRY_CALCULATION_COMPLETE ? (
          <Avatar style={{ backgroundColor: "white", color: "black" }}>
            {mealData}
          </Avatar>
        ) : (
          <ErrorIcon />
        )}
      </ListItemIcon>
    </ListItem>
  );
};

MealDisplay.propTypes = {
  entry: PropTypes.object.isRequired,

  onSelect: PropTypes.func.isRequired
};

export default observer(MealDisplay);
