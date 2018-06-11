import React, { Component } from "react";
// import PropTypes from "prop-types";
// import { withRouter } from "react-router";
import { observer } from "mobx-react";

// import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
// import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
// import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
// import withWidth from "@material-ui/core/withWidth";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
// import Divider from "@material-ui/core/Divider";

// import BackspaceIcon from "@material-ui/icons/Backspace";
// import ClearAllIcon from "@material-ui/icons/ClearAll";

const transition = props => <Slide direction="up" {...props} />;

class MealDialog extends Component {
  handelDone = () => {
    this.props.onClose();
  };
  handelUpdate = selection => () => {
    const { entry } = this.props;

    entry.updateMealtime(selection);

    this.handelDone();
  };
  render = () => {
    const { props } = this;
    return (
      <Dialog
        className="ScratchPadDialog"
        open={props.isOpen}
        onClose={props.onClose}
        fullScreen
        TransitionComponent={transition}
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
            >
              <Typography
                variant="title"
                color="inherit"
                style={{
                  padding: 16,
                  margin: "0 auto"
                }}
              />
            </div>

            <Button color="inherit" onClick={this.handelDone}>
              Dont know
            </Button>
          </Toolbar>
        </AppBar>

        <List>
          <ListItem button onClick={this.handelUpdate("Breakfast")}>
            <Avatar>B</Avatar>
            <ListItemText primary="Breakfast" secondary={null} />
          </ListItem>
          <ListItem button onClick={this.handelUpdate("Lunch")}>
            <Avatar>L</Avatar>
            <ListItemText primary="Lunch" secondary={null} />
          </ListItem>
          <ListItem button onClick={this.handelUpdate("Dinner")}>
            <Avatar>D</Avatar>
            <ListItemText primary="Dinner" secondary={null} />
          </ListItem>
          <ListItem button onClick={this.handelUpdate("Snacks")}>
            <Avatar>S</Avatar>
            <ListItemText primary="Snacks" secondary={null} />
          </ListItem>
        </List>
      </Dialog>
    );
  };
}

export default observer(MealDialog);
