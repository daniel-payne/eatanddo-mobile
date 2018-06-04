import React, { Component } from "react";
// import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { observer } from "mobx-react";

// import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
// import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import withWidth from "@material-ui/core/withWidth";

// import BackspaceIcon from "@material-ui/icons/Backspace";
// import ClearAllIcon from "@material-ui/icons/ClearAll";

import "./MatchesDialog.css";

class MatchesDialog extends Component {
  state = {
    searchFor: ""
  };
  transition = props => {
    return <Slide direction="up" {...props} />;
  };
  handelSelect = item => () => {
    this.props.mealItem.chooseMatch(item);

    this.onDone();
  };
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };
  onDone = () => {
    this.props.onClose();
  };
  render = () => {
    const foodTitle = this.props.mealItem ? this.props.mealItem.text : null;
    const matches = this.props.mealItem ? this.props.mealItem.matches : [];

    return (
      <Dialog
        fullScreen
        open={this.props.isOpen}
        onClose={this.props.onClose}
        TransitionComponent={this.transition}
        className="MatchesDialog"
      >
        <AppBar
          style={{
            position: "relative"
          }}
        >
          <Toolbar>
            <div
              variant="title"
              color="inherit"
              style={{
                flex: 1
              }}
            />

            <Button color="inherit" onClick={this.props.onClose}>
              Not Sure
            </Button>
          </Toolbar>
        </AppBar>
        <Typography
          variant="title"
          color="inherit"
          style={{
            padding: 16,
            margin: "0 auto"
          }}
        >
          {`Which nutritional information to use for '${foodTitle}' `}
        </Typography>

        <List>
          {matches.map((item, i) => {
            return (
              <ListItem button key={i} onClick={this.handelSelect(item)}>
                <Avatar>{i + 1}</Avatar>
                <ListItemText primary={item.foodName} />
              </ListItem>
            );
          })}
        </List>
      </Dialog>
    );
  };
}

export default withWidth()(withRouter(observer(MatchesDialog)));
