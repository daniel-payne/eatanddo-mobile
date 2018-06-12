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
// import Input from "@material-ui/core/Input";
// import InputLabel from "@material-ui/core/InputLabel";
// import InputAdornment from "@material-ui/core/InputAdornment";
// import FormHelperText from '@material-ui/core/FormHelperText';
// import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
// import ListItem from "@material-ui/core/ListItem";
// import Visibility from "@material-ui/icons/Search";
// import VisibilityOff from "@material-ui/icons/VisibilityOff";

// import BackspaceIcon from "@material-ui/icons/Backspace";
import SearchIcon from "@material-ui/icons/Search";

import "./MatchesDialog.css";

class MatchesDialog extends Component {
  state = {
    searchFor: ""
  };
  static getDerivedStateFromProps = (props, state) => {
    if (!state.searchFor) {
      return {
        searchFor: props.mealItem ? props.mealItem.foodName : undefined
      };
    }
    return null;
  };

  transition = props => {
    return <Slide direction="up" {...props} />;
  };
  handleSelect = item => () => {
    this.props.mealItem.chooseMatch(item);

    this.handelDone();
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

  handleKeyPress = event => {
    if (event.key === "Enter") {
      this.handleSearch();
    }
  };
  handleSearch = () => {
    this.props.mealItem.updateSearch(this.state.searchFor);
  };
  handelDone = () => {
    this.props.onClose();
  };
  render = () => {
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

        <ListItem>
          <TextField
            value={this.state.searchFor}
            style={{ marginLeft: 54 }}
            InputLabelProps={{
              shrink: true
            }}
            fullWidth
            margin="normal"
            onKeyPress={this.handleKeyPress}
            onChange={this.handleChange("searchFor")}
          />
          <IconButton onClick={this.handleSearch}>
            <SearchIcon />
          </IconButton>
        </ListItem>

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
