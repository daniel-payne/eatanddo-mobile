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

import "./MealDialog.css";

class MealDialog extends Component {
  handelDone = () => {
    this.props.onClose();
  };
  handelUpdate = selection => () => {
    const { entry } = this.props;

    entry.updateMealtime(selection);

    this.handelDone();
  };

  Transition = props => <Slide direction="up" {...props} />;

  render = () => {
    const { Transition, handelDone, handelUpdate } = this;
    const { isOpen, onClose } = this.props;

    return (
      <Dialog
        className="MealDialog"
        open={isOpen}
        onClose={onClose}
        fullScreen
        TransitionComponent={Transition}
      >
        <AppBar className="title_bar">
          <Toolbar>
            <div variant="title" color="inherit" className="title__container">
              <Typography
                variant="title"
                color="inherit"
                className="title__text"
              />
            </div>

            <Button color="inherit" onClick={handelDone}>
              Dont know
            </Button>
          </Toolbar>
        </AppBar>

        <List>
          <ListItem button onClick={handelUpdate("Breakfast")}>
            <Avatar>B</Avatar>
            <ListItemText primary="Breakfast" secondary={null} />
          </ListItem>
          <ListItem button onClick={handelUpdate("Lunch")}>
            <Avatar>L</Avatar>
            <ListItemText primary="Lunch" secondary={null} />
          </ListItem>
          <ListItem button onClick={handelUpdate("Dinner")}>
            <Avatar>D</Avatar>
            <ListItemText primary="Dinner" secondary={null} />
          </ListItem>
          <ListItem button onClick={handelUpdate("Snacks")}>
            <Avatar>S</Avatar>
            <ListItemText primary="Snacks" secondary={null} />
          </ListItem>
        </List>
      </Dialog>
    );
  };
}

export default observer(MealDialog);
