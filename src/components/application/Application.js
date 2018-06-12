import React, { Component } from "react";
// import PropTypes from "prop-types";
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
  openDraw = () => {
    this.setState({ isDrawOpen: true });
  };
  closeDraw = () => {
    this.setState({ isDrawOpen: false });
  };
  openLogin = () => {
    this.setState({ isLoginOpen: true });
  };
  closeLogin = () => {
    this.setState({ isLoginOpen: false });
  };

  render() {
    const { store } = this.props;
    const { entry, display } = store;
    return (
      <div className="App" style={{ height: "100%" }}>
        <Router>
          <React.Fragment>
            <CssBaseline />
            <AppBar position="static">
              <Toolbar>
                <IconButton
                  style={{
                    marginRLeft: -12,
                    marginRight: -48,
                    zIndex: 99
                  }}
                  color="inherit"
                  aria-label="Menu"
                  onClick={this.openDraw}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  variant="title"
                  color="inherit"
                  style={{
                    flex: 1
                  }}
                >
                  <Title />
                </Typography>
                {/* <Button color="inherit" onClick={this.openLogin}>
                  Login
                </Button> */}
              </Toolbar>
              <SettingsDrawer
                isOpen={this.state.isDrawOpen}
                onClose={this.closeDraw}
                display={display}
              />
            </AppBar>
            <Dialog
              open={this.state.isLoginOpen}
              onClose={this.closeLogin}
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
                <Button onClick={this.closeLogin} color="primary">
                  Just Start Using
                </Button>
                <Button onClick={this.closeLogin} color="primary">
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
                    render={() => <EntrySummary entry={entry} />}
                  />
                )}
              />

              <Route path="/" render={() => <EntrySummary entry={entry} />} />
            </Switch>
          </React.Fragment>
        </Router>
        <Button
          variant="fab"
          color="primary"
          aria-label="microphone"
          style={{
            bottom: 0,
            right: 0,
            position: "absolute",
            zIndex: 999,
            margin: 8,
            display: "none"
          }}
        >
          <MicrophoneIcon />
        </Button>
      </div>
    );
  }
}

export default inject("store")(observer(Application));
