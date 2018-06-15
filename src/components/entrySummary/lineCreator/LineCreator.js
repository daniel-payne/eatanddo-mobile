import React, { Component } from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

import Button from "@material-ui/core/Button";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";

import "./LineCreator.css";

class LineCreator extends Component {
  static propTypes = {
    entry: PropTypes.object.isRequired
  };

  onKeyPress = event => {
    if (event.key === "Enter") {
      this.onDone();
    }
  };

  onDone = event => {
    const { entry } = this.props;
    //cant use refs with materal-ui, its the way they wrote it
    const element = document.querySelector(".LineCreator .new-line-data input");

    if (element && element.value && element.value.length > 0) {
      entry.addEntryDescription(element.value);

      element.value = null;
    }
  };

  render = () => {
    const { onKeyPress, onDone } = this;

    return (
      <ListItem className="LineCreator">
        <TextField
          className="new-line-data"
          InputLabelProps={{
            shrink: true
          }}
          placeholder="Add item to food diary"
          helperText="Type an amount and name, eg 20 grams of cheddar cheese"
          fullWidth
          margin="normal"
          onKeyPress={onKeyPress}
        />
        <Button onClick={onDone}>Add</Button>
      </ListItem>
    );
  };
}

export default observer(LineCreator);
