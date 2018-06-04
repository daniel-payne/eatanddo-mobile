import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { observer } from "mobx-react";

import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";

import ErrorIcon from "@material-ui/icons/Error";
import DoneIcon from "@material-ui/icons/Done";

import WeightDialog from "./weightDialog/WeightDialog";
import MatchesDialog from "./matchesDialog/MatchesDialog";

import "./MealSummary.css";

class MealSummary extends Component {
  static propTypes = {
    meal: PropTypes.object
  };
  state = {
    isAmountSelectorOpen: false,
    isMatchSelectorOpen: false,
    selectedMealItem: undefined
  };
  handelDone = () => {
    // this.props.meal.updateMealDescription(this.state.mealDescription);
    // this.setState({ mealDescription: null });
    this.props.history.push(`meal-description`);
  };
  handleClose = name => () => {
    this.setState({ [name]: false });

    this.props.meal.updateAllCalculations();
  };
  handelSelect = mealItem => () => {
    if (mealItem.status === "NO_MEASUREMENT") {
      this.setState({ selectedMealItem: mealItem, isAmountSelectorOpen: true });
    } else {
      this.setState({ selectedMealItem: mealItem, isMatchSelectorOpen: true });
    }
  };
  render() {
    return (
      <div
        className="MealSummary"
        style={{ overflowX: "auto", height: "calc(100% - 64px)" }}
      >
        <List>
          <ListItem button>
            <Avatar>D</Avatar>
            <ListItemText
              primary={this.props.meal.mealDay}
              secondary={this.props.meal.mealDayInformation}
            />
            <ListItemIcon>
              {this.props.meal.mealDayStatus === "OK" ? (
                <DoneIcon />
              ) : (
                <ErrorIcon />
              )}
            </ListItemIcon>
          </ListItem>

          <ListItem button>
            <Avatar>M</Avatar>
            <ListItemText
              primary={this.props.meal.mealTime}
              secondary={this.props.meal.mealTimeInformation}
            />
            <ListItemIcon>
              {this.props.meal.mealTimeStatus === "OK" ? (
                <DoneIcon />
              ) : (
                <ErrorIcon />
              )}
            </ListItemIcon>
          </ListItem>

          <Divider />

          {this.props.meal.mealItems.map((item, i) => {
            return (
              <ListItem button key={i} onClick={this.handelSelect(item)}>
                <Avatar>{i + 1}</Avatar>

                <ListItemText
                  primary={`${item.text}${
                    item.additionalText ? item.additionalText : ""
                  }`}
                  secondary={item.information}
                />
                <ListItemIcon>
                  {item.status === "OK" ? <DoneIcon /> : <ErrorIcon />}
                </ListItemIcon>
              </ListItem>
            );
          })}
        </List>

        <hr />

        <Button onClick={this.handelDone}>Save to diary</Button>

        <WeightDialog
          isOpen={this.state.isAmountSelectorOpen}
          onClose={this.handleClose("isAmountSelectorOpen")}
          mealItem={this.state.selectedMealItem}
        />

        <MatchesDialog
          isOpen={this.state.isMatchSelectorOpen}
          onClose={this.handleClose("isMatchSelectorOpen")}
          mealItem={this.state.selectedMealItem}
        />
      </div>
    );
  }
}

export default withRouter(observer(MealSummary));
