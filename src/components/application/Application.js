import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import CssBaseline from "@material-ui/core/CssBaseline";

import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";

import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import MenuIcon from "@material-ui/icons/Menu";
import MicrophoneIcon from "@material-ui/icons/Mic";

import EntrySummary from "../entrySummary/EntrySummary";

import SettingsDrawer from "./settingsDrawer/SettingsDrawer";
import Title from "./title/Title";

import "./Application.css";

class Application extends Component {
  state = {
    mealDescription:
      "today's breakfast two eggs 35grams of cheese 30 grams of tinned tuna 50g of asparagus half a tomato",
    isDrawOpen: false,
    isLoginOpen: false
  };

  handleOpenDraw = () => {
    this.setState({ isDrawOpen: true });
  };
  handleCloseDraw = () => {
    this.setState({ isDrawOpen: false });
  };
  handleOpenLogin = () => {
    this.setState({ isLoginOpen: true });
  };
  handleCloseLogin = () => {
    this.setState({ isLoginOpen: false });
  };

  render() {
    const { handleOpenDraw, handleCloseDraw, handleCloseLogin } = this;
    const { isDrawOpen, isLoginOpen } = this.state;
    const { store } = this.props;
    const { entry, display } = store;

    return (
      <div className="Application">
        <Router>
          <React.Fragment>
            <CssBaseline />
            <AppBar position="static">
              <Toolbar>
                <IconButton
                  className="menu-icon"
                  color="inherit"
                  aria-label="Menu"
                  onClick={handleOpenDraw}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  className="heading-container"
                  variant="title"
                  color="inherit"
                >
                  <Title />
                </Typography>
                {/* <Button color="inherit" onClick={openLogin}>
                  Login
                </Button> */}
              </Toolbar>
              <SettingsDrawer
                isOpen={isDrawOpen}
                onClose={handleCloseDraw}
                display={display}
              />
            </AppBar>
            <Dialog
              open={isLoginOpen}
              onClose={handleCloseLogin}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Login</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  When you logn to this website, you can view your saved data on
                  other devices.
                </DialogContentText>
                <TextField
                  margin="dense"
                  id="email"
                  label="Email Address"
                  type="email"
                  fullWidth
                />
                <TextField
                  margin="dense"
                  id="password"
                  label="Password"
                  type="password"
                  fullWidth
                />
                <Button color="default" fullWidth>
                  New User
                </Button>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseLogin} color="primary">
                  Just Start Using
                </Button>
                <Button onClick={handleCloseLogin} color="primary">
                  Login
                </Button>
              </DialogActions>
            </Dialog>
            <Switch>
              <Route
                path="/entry-summary"
                render={() => (
                  <Route
                    path="/"
                    render={() => (
                      <EntrySummary entry={entry} display={display} />
                    )}
                  />
                )}
              />

              <Route
                path="/"
                render={() => <EntrySummary entry={entry} display={display} />}
              />
            </Switch>
          </React.Fragment>
        </Router>
        <Button
          className="scratchpad-option"
          variant="fab"
          color="primary"
          aria-label="microphone"
        >
          <MicrophoneIcon />
        </Button>
      </div>
    );
  }
}

export default inject("store")(observer(Application));
