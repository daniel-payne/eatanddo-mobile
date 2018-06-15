import React, { Component } from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

// import Avatar from "@material-ui/core/Avatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemText from "@material-ui/core/ListItemText";
import Drawer from "@material-ui/core/Drawer";

import CheckIcon from "@material-ui/icons/Check";

import {
  CALORIES,
  // KILOJOULES,
  PROTEIN,
  CARBOHYDRATE,
  SUGAR,
  // STARCH,
  FAT,
  SATURATEDFAT,
  // UNSATURATEDFAT,
  // CHOLESTEROL,
  // TRANSFAT,
  // DIETARYFIBRE,
  // SOLUBLEFIBRE,
  // INSOLUBLEFIBRE,
  SALT,
  // SODIUM,
  // ALCOHOL,
  UK_DATA,
  US_DATA
} from "data/models/Display";

const SettingsOption = props => {
  const { label, value, selected, isSecondary, onSelect } = props;

  return (
    <ListItem button onClick={onSelect}>
      <ListItemText primary={label} inset={isSecondary} />

      {value === selected ? (
        <ListItemIcon>
          <CheckIcon />
        </ListItemIcon>
      ) : null}
    </ListItem>
  );
};

const NUTRITION_OPTIONS = [
  { label: "Calories", value: CALORIES },
  // { label: "KiloJoules", value: KILOJOULES },
  { label: "Protine", value: PROTEIN },
  { label: "Carbohydrate", value: CARBOHYDRATE },
  { label: "Sugar", value: SUGAR, isSecondary: true },
  // { label: "Starch", value: STARCH, isSecondary: true },
  { label: "Fat", value: FAT },
  { label: "Saturated Fat", value: SATURATEDFAT, isSecondary: true },
  // { label: "Unsaturated Fat", value: UNSATURATEDFAT, isSecondary: true },
  // { label: "Cholesterol", value: CHOLESTEROL, isSecondary: true },
  // { label: "Trans Fat", value: TRANSFAT, isSecondary: true },
  // { label: "Fibre", value: DIETARYFIBRE },
  // { label: "Soluble Fibre", value: SOLUBLEFIBRE, isSecondary: true },
  // { label: "Insoluble Fibre", value: INSOLUBLEFIBRE, isSecondary: true },
  { label: "Salt", value: SALT }
  // { label: "Sodium", value: SODIUM, isSecondary: true },
  // { label: "Alcohol", value: ALCOHOL }
];

const SOURCE_OPTIONS = [
  { label: "UK Database", value: UK_DATA },
  { label: "US Database", value: US_DATA }
];

class SettingsDrawer extends Component {
  static propTypes = {
    display: PropTypes.object,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func
  };
  handelSelectNutrition = choice => () => {
    const { display } = this.props;

    display.updateNutrition(choice);
  };
  handelSelectSource = choice => () => {
    const { display } = this.props;

    display.updateSource(choice);
  };
  render() {
    const { display } = this.props;
    const { selectedNutrition, selectedSource } = display || {};

    return (
      <Drawer
        className="SettingsDrawer"
        anchor="left"
        open={this.props.isOpen}
        onClose={this.props.onClose}
      >
        <List component="nav">
          <ListSubheader disableSticky={true} color="primary">
            Display Nutrition
          </ListSubheader>

          {NUTRITION_OPTIONS.map(item => (
            <SettingsOption
              key={item.value}
              label={item.label}
              value={item.value}
              selected={selectedNutrition}
              onSelect={this.handelSelectNutrition(item.value)}
              isSecondary={item.isSecondary}
            />
          ))}

          <ListSubheader disableSticky={true} color="primary">
            Information source
          </ListSubheader>

          {SOURCE_OPTIONS.map(item => (
            <SettingsOption
              key={item.value}
              label={item.label}
              value={item.value}
              selected={selectedSource}
              onSelect={this.handelSelectSource(item.value)}
            />
          ))}
        </List>
      </Drawer>
    );
  }
}

export default observer(SettingsDrawer);
