import React, { Component } from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

import ListItemIcon from "@material-ui/core/ListItemIcon";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemText from "@material-ui/core/ListItemText";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";

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
} from "data/models/Preference";

class SettingsDrawer extends Component {
  static propTypes = {
    preferences: PropTypes.object,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func
  };

  static NUTRITION_OPTIONS = [
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

  static SOURCE_OPTIONS = [
    { label: "UK Database", value: UK_DATA },
    { label: "US Database", value: US_DATA }
  ];

  handleSelectNutrition = choice => () => {
    this.props.preference.chooseNutrition(choice);
  };
  handleSelectSource = choice => () => {
    this.props.preference.chooseSource(choice);
  };

  SettingsOption = props => {
    const { label, value, selected, isSecondary, onSelect } = props;

    const labelStyle = isSecondary === true ? { paddingLeft: 16 } : null;

    return (
      <ListItem button onClick={onSelect}>
        <ListItemText primary={label} style={labelStyle} />

        {value === selected ? (
          <ListItemIcon>
            <CheckIcon />
          </ListItemIcon>
        ) : null}
      </ListItem>
    );
  };

  render() {
    const { NUTRITION_OPTIONS, SOURCE_OPTIONS } = SettingsDrawer;
    const { SettingsOption, handleSelectNutrition, handleSelectSource } = this;
    const { preference, isOpen, onClose } = this.props;
    const { selectedNutrition, selectedSource } = preference || {};

    return (
      <Drawer
        className="SettingsDrawer"
        anchor="left"
        open={isOpen}
        onClose={onClose}
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
              onSelect={handleSelectNutrition(item.value)}
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
              onSelect={handleSelectSource(item.value)}
            />
          ))}
        </List>
        <div className="version-information">
          <Typography
            className="heading-container"
            variant="caption"
            align="center"
          >
            Version {process.env.REACT_APP_VERSION}
          </Typography>
        </div>
      </Drawer>
    );
  }
}

export default observer(SettingsDrawer);
