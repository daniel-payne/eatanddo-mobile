import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { observer } from "mobx-react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import withWidth from "@material-ui/core/withWidth";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";

import SearchIcon from "@material-ui/icons/Search";

import "./MatchesDialog.css";

class MatchesDialog extends Component {
  static propTypes = {
    mealItem: PropTypes.object,

    onClose: PropTypes.func.isRequired
  };

  state = {
    searchFor: ""
  };
  // static getDerivedStateFromProps = (props, state) => {
  //   if (state.searchFor === null) {
  //     console.log(state.searchFor);
  //     return {
  //       searchFor:
  //         props.mealItem && props.mealItem.selectedFood
  //           ? props.mealItem.selectedFood.foodName
  //           : ""
  //     };
  //   }
  //   return null;
  // };

  Transition = props => {
    return <Slide direction="up" {...props} />;
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleSelect = item => () => {
    this.props.mealItem.chooseMatch(item);

    this.handelDone();
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
  handleEntering = () => {
    const { mealItem } = this.props;
    const { selectedFood } = mealItem || {};

    this.setState({
      searchFor: mealItem && selectedFood ? selectedFood.foodName : ""
    });
  };

  render = () => {
    const { Transition, handleEntering } = this;
    const { mealItem, isOpen, onClose } = this.props;
    const { text, search } = mealItem || {};
    const { matches, isAllMatches } = search || {};

    const showMore = matches && matches.length > 9 ? true : false;

    return (
      <Dialog
        className="MatchesDialog"
        fullScreen
        open={isOpen}
        onClose={onClose}
        onEntering={handleEntering}
        TransitionComponent={Transition}
      >
        <AppBar className="title_bar">
          <Toolbar>
            <div className="title__container" variant="title" color="inherit" />

            <Button color="inherit" onClick={onClose}>
              Not Sure
            </Button>
          </Toolbar>
        </AppBar>
        <Typography
          variant="title"
          color="inherit"
          className="options_information"
        >
          {`Which nutritional information to use for '${text}' `}
        </Typography>

        <ListItem>
          <TextField
            className="title__search"
            value={this.state.searchFor}
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

        {isAllMatches === false &&
          showMore === true && (
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
