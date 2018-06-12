import React, { Component } from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

import Button from "@material-ui/core/Button";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
// import ListItemText from "@material-ui/core/ListItemText";

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

    const element = document.querySelector(".LineCreator .new-line-data input");

    if (element && element.value && element.value.length > 0) {
      entry.addEntryDescription(element.value);

      element.value = null;
    }
  };

  render = () => {
    // const { entry } = this.props;

    return (
      <ListItem className="LineCreator">
        <TextField
          // id="full-width"
          className="new-line-data"
          // ref={this.inputReference}
          // label="Add item to food diary"
          InputLabelProps={{
            shrink: true
          }}
          placeholder="Add item to food diary"
          helperText="Type an amount and name, eg 20 grams of cheddar cheese"
          fullWidth
          margin="normal"
          onKeyPress={this.onKeyPress}
        />
        <Button onClick={this.onDone}>Add</Button>
      </ListItem>
    );
  };
}

export default observer(LineCreator);
