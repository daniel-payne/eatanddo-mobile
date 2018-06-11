import React, { Component } from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";

class DayDialog extends Component {
  static propTypes = {
    entry: PropTypes.object.isRequired,

    onClose: PropTypes.func.isRequired
  };

  handelDone = () => {
    this.props.onClose();
  };
  handelUpdate = selection => () => {
    const { entry } = this.props;

    const now = new Date();

    const TODAYS_DATE = now.toISOString().substr(0, 10);
    const YESTERDAYS_DATE = new Date(now - 1 * DAYS)
      .toISOString()
      .substr(0, 10);

    let dayDate;

    if (selection === TODAY) {
      dayDate = TODAYS_DATE;
    } else if (selection === YESTERDAY) {
      dayDate = YESTERDAYS_DATE;
    }

    entry.updateDay(dayDate);

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
        <Typography
          variant="title"
          color="inherit"
          style={{
            padding: 16,
            margin: "0 auto"
          }}
        >
          Which day to add food entries to
        </Typography>

        <List>
          <ListItem button onClick={this.handelUpdate(TODAY)}>
            <Avatar>T</Avatar>
            <ListItemText primary="Today" secondary={null} />
          </ListItem>

          <ListItem button onClick={this.handelUpdate(YESTERDAY)}>
            <Avatar>Y</Avatar>
            <ListItemText primary="Yesterday" secondary={null} />
          </ListItem>
        </List>
      </Dialog>
    );
  };
}

const transition = props => <Slide direction="up" {...props} />;

const TODAY = "TODAY";
const YESTERDAY = "YESTERDAY";
const DAYS = 86400000;

export default observer(DayDialog);
