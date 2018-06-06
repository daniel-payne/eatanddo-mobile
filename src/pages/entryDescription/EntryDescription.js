import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { observer } from "mobx-react";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import "./EntryDescription.css";

class EntryDescription extends Component {
  static propTypes = {
    entry: PropTypes.object
  };
  static getDerivedStateFromProps = (props, state) => {
    if (!state.mealDescription) {
      return {
        mealDescription: props.entry ? props.entry.mealDescription : undefined
      };
    }
    return null;
  };
  state = {
    mealDescription: undefined
  };
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };
  handelDone = () => {
    this.props.entry.updateMealDescription(this.state.mealDescription);

    this.setState({ mealDescription: null });

    this.props.history.push(`meal-summary`);
  };
  render() {
    return (
      <div className="EntryDescription">
        <form noValidate autoComplete="off">
          <TextField
            id="multiline-flexible"
            label="Describe your meal"
            multiline
            rows="10"
            value={this.state.mealDescription}
            onChange={this.handleChange("mealDescription")}
            margin="normal"
            fullWidth
          />
          <Button onClick={this.handelDone}>Done</Button>
        </form>
      </div>
    );
  }
}

export default withRouter(observer(EntryDescription));
