import React, { Component } from "react";
// import PropTypes from "prop-types";
import { observer, inject } from "mobx-react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import CssBaseline from "@material-ui/core/CssBaseline";

import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemText from "@material-ui/core/ListItemText";

import MenuIcon from "@material-ui/icons/Menu";
import MicrophoneIcon from "@material-ui/icons/Mic";

import EntrySummary from "../entrySummary/EntrySummary";

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
    const { entry } = store;
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
              <Drawer
                anchor="left"
                open={this.state.isDrawOpen}
                onClose={this.closeDraw}
              >
                <List component="nav">
                  <ListSubheader disableSticky={true} color="primary">
                    Display Nutrition
                  </ListSubheader>
                  <ListItem button>
                    <ListItemText primary="Calories" />
                  </ListItem>
                  <ListItem button>
                    <ListItemText primary="Protine" />
                  </ListItem>
                  <ListItem button>
                    <ListItemText primary="Carbohydrate" />
                  </ListItem>
                  <ListItem button>
                    <ListItemText primary="Sugar" inset={true} />
                  </ListItem>
                  <ListItem button>
                    <ListItemText primary="Starch" inset={true} />
                  </ListItem>
                  <ListItem button>
                    <ListItemText primary="Fat" />
                  </ListItem>
                  <ListItem button>
                    <ListItemText primary="Saturated Fat" inset={true} />
                  </ListItem>
                  <ListItem button>
                    <ListItemText primary="Unsaturated Fat" inset={true} />
                  </ListItem>
                  <ListItem button>
                    <ListItemText primary="Cholesterol" inset={true} />
                  </ListItem>
                  <ListItem button>
                    <ListItemText primary="Trans Fat" inset={true} />
                  </ListItem>
                  <ListItem button>
                    <ListItemText primary="Fibre" />
                  </ListItem>
                  <ListItem button>
                    <ListItemText primary="Soluble Fibre" inset={true} />
                  </ListItem>
                  <ListItem button>
                    <ListItemText primary="Insoluble Fibre" inset={true} />
                  </ListItem>
                  <ListItem button>
                    <ListItemText primary="Salt" />
                  </ListItem>

                  <ListSubheader disableSticky={true} color="primary">
                    Information source
                  </ListSubheader>
                  <ListItem button>
                    <ListItemText primary="UK Database" />
                  </ListItem>
                  <ListItem button>
                    <ListItemText primary="US Database" />
                  </ListItem>
                </List>
              </Drawer>
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
