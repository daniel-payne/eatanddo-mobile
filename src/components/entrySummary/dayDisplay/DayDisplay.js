import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";

import "./DayDisplay.css";

const DayDisplay = props => {
  const { day, onSelect } = props;

  let dayTitle;
  let dayInformation;

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
  } else {
    dayInformation = "Select a day";
  }

  return (
    <ListItem
      className="DayDisplay"
      button
      onClick={onSelect ? onSelect : null}
    >
      <Avatar>D</Avatar>
      <ListItemText primary={dayTitle} secondary={dayInformation} />
    </ListItem>
  );
};

DayDisplay.propTypes = {
  day: PropTypes.object.isRequired,

  onSelect: PropTypes.func.isRequired
};

const DAYS = 86400000;

export default observer(DayDisplay);
