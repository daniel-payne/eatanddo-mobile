import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";

import ErrorIcon from "@material-ui/icons/Error";

import { CALCULATION_COMPLETE as ENTRY_CALCULATION_COMPLETE } from "data/models/Day";

import "./DayDisplay.css";

const DayDisplay = props => {
  const { day, selectedNutrition, onSelect } = props;

  let dayTitle;
  let dayInformation;
  let dayData;

  let dataStyle = {};

  if (day && day.isoDate) {
    const now = new Date();
    const entryDate = new Date(day.isoDate);

    const ENTRYS_DATE = entryDate.toISOString().substr(0, 10);
    const TODAYS_DATE = now.toISOString().substr(0, 10);
    const YESTERDAYS_DATE = new Date(now - 1 * DAYS)
      .toISOString()
      .substr(0, 10);

    if (ENTRYS_DATE === TODAYS_DATE) {
      dayTitle = "Today";
      dayInformation = entryDate.toDateString();
    } else if (ENTRYS_DATE === YESTERDAYS_DATE) {
      dayTitle = "Yesterday";
      dayInformation = entryDate.toDateString();
    } else {
      dayTitle = entryDate.toDateString();

      dayInformation = dayTitle.substr(4);
      dayTitle = dayTitle.substr(0, 3);
    }

    let result = day.nutritionPerDay(selectedNutrition);

    if (result && !Number.isNaN(result)) {
      if (result > 99.9) {
        result = result.toFixed(0);
      } else if (
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

    dayData = result;
  } else {
    dayInformation = "Select a day";
  }

  if (dayData && dayData.length > 2) {
    dataStyle = { fontSize: "smaller" };
  }

  return (
    <ListItem
      className="DayDisplay"
      button
      onClick={onSelect ? onSelect : null}
    >
      <Avatar>D</Avatar>
      <ListItemText primary={dayTitle} secondary={dayInformation} />
      <ListItemIcon>
        {day.calculationStatus === ENTRY_CALCULATION_COMPLETE ? (
          <Avatar className="data-avatar" style={dataStyle}>
            {dayData}
          </Avatar>
        ) : (
          <ErrorIcon />
        )}
      </ListItemIcon>
    </ListItem>
  );
};

DayDisplay.propTypes = {
  day: PropTypes.object.isRequired,
  selectedNutrition: PropTypes.string.isRequired,

  onSelect: PropTypes.func.isRequired
};

const DAYS = 86400000;

export default observer(DayDisplay);
