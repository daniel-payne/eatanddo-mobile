import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";

const DayDisplay = props => {
  // const { entry } = props;

  const dayTitle = "Today";
  const dayInformation = new Date().toDateString();

  return (
    <ListItem button onClick={props.onSelect ? props.onSelect : null}>
      <Avatar>D</Avatar>
      <ListItemText primary={dayTitle} secondary={dayInformation} />
    </ListItem>
  );
};

DayDisplay.propTypes = {
  entry: PropTypes.object.isRequired,

  onSelect: PropTypes.func.isRequired
};

export default observer(DayDisplay);
