import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";

import ErrorIcon from "@material-ui/icons/Error";
// import DoneIcon from "@material-ui/icons/Done";

import { CALCULATION_COMPLETE as ENTRY_CALCULATION_COMPLETE } from "data/models/Entry";

const MealDisplay = props => {
  const { entry } = props;
  const mealInformation = Math.round(entry.energyCaloriesPerEntry);

  return (
    <ListItem button>
      <Avatar>M</Avatar>
      <ListItemText primary="Calories" secondary="Select a mealtime" />
      <ListItemIcon>
        {entry.calculationStatus === ENTRY_CALCULATION_COMPLETE ? (
          <Avatar style={{ backgroundColor: "white", color: "black" }}>
            {mealInformation}
          </Avatar>
        ) : (
          <ErrorIcon />
        )}
      </ListItemIcon>
    </ListItem>
  );
};

MealDisplay.propTypes = {
  entry: PropTypes.object.isRequired
};

export default observer(MealDisplay);
