import React from "react";
import { observer } from "mobx-react";

import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";

import ErrorIcon from "@material-ui/icons/Error";
import { CALCULATION_COMPLETE as LINE_CALCULATION_COMPLETE } from "data/models/EntryLine";

const LineDisplay = props => {
  const { item, no, onSelect } = props;

  let statusMessage = item.selectedFood ? item.selectedFood.foodName : null;

  if (!item.quantity || !item.unit) {
    statusMessage = `How much does ${item.text} weigh`;
  }

  return (
    <ListItem button onClick={onSelect}>
      <Avatar>{no + 1}</Avatar>

      <ListItemText
        primary={`${item.text}${
          item.additionalText ? item.additionalText : ""
        }`}
        secondary={statusMessage}
      />
      <ListItemIcon>
        {item.calculationStatus === LINE_CALCULATION_COMPLETE ? (
          <Avatar style={{ backgroundColor: "white", color: "black" }}>
            {Math.round(item.energyCaloriesPerLine)}
          </Avatar>
        ) : (
          <ErrorIcon />
        )}
      </ListItemIcon>
    </ListItem>
  );
};

export default observer(LineDisplay);
