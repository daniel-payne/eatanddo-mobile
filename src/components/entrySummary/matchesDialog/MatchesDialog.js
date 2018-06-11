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
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// import TextField from "@material-ui/core/TextField";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import withWidth from "@material-ui/core/withWidth";

import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
// import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
// import FormHelperText from '@material-ui/core/FormHelperText';
// import FormControl from "@material-ui/core/FormControl";
// import TextField from "@material-ui/core/TextField";
// import MenuItem from '@material-ui/core/MenuItem';
import Visibility from "@material-ui/icons/Search";
// import VisibilityOff from "@material-ui/icons/VisibilityOff";

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
  handleSelect = item => () => {
    this.props.mealItem.chooseMatch(item);

    this.onDone();
  };
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };
  handleShowMore = () => {
    if (this.props.mealItem && this.props.mealItem.search) {
      this.props.mealItem.search.loadAllMatches();
    }
  };
  handelDone = () => {
    this.props.onClose();
  };
  render = () => {
    // const foodTitle = this.props.mealItem ? this.props.mealItem.text : null;
    // const matches =
    //   this.props.mealItem && this.props.mealItem.search
    //     ? this.props.mealItem.search.matches
    //     : [];
    // const isAllMatches =
    //   this.props.mealItem && this.props.mealItem.search
    //     ? this.props.mealItem.search.isAllMatches
    //     : false;
    const { mealItem } = this.props;
    const { text, search } = mealItem || {};
    const { matches, isAllMatches } = search || {};

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
          {`Which nutritional information to use for '${text}' `}
        </Typography>

        {/* <form noValidate autoComplete="off" style={{ padding: 24 }}>
          <FormControl style={{ width: "100%", padding: 24 }}>
            <InputLabel htmlFor="adornment-searchfor">Search For</InputLabel> */}
        <Input
          id="adornment-searchfor"
          type="text"
          value={this.state.password}
          onChange={this.handleChange("password")}
          style={{ width: "100%", padding: 24 }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="Toggle password visibility"
                onClick={null}
              >
                <Visibility />
              </IconButton>
            </InputAdornment>
          }
        />
        {/* </FormControl>
        </form> */}

        {matches && (
          <List>
            {matches.map((item, i) => {
              return (
                <ListItem
                  button
                  key={item.foodId}
                  onClick={this.handleSelect(item)}
                >
                  <Avatar>{i + 1}</Avatar>
                  <ListItemText primary={item.foodName} />
                </ListItem>
              );
            })}
          </List>
        )}

        {isAllMatches === false && (
          <React.Fragment>
            <Divider />
            <Button onClick={this.handleShowMore}>Show More</Button>
          </React.Fragment>
        )}
      </Dialog>
    );
  };
}

export default withWidth()(withRouter(observer(MatchesDialog)));
