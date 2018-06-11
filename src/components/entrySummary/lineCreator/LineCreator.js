import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

import Button from "@material-ui/core/Button";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
// import ListItemText from "@material-ui/core/ListItemText";

const LineCreator = props => {
  //   const { entry } = props;

  return (
    <ListItem>
      <TextField
        // id="full-width"
        // label="Add item to food diary"
        InputLabelProps={{
          shrink: true
        }}
        placeholder="Add item to food diary"
        helperText="Type an amount and name, eg 20 grams of cheddar cheese"
        fullWidth
        margin="normal"
      />
      <Button>Add</Button>
    </ListItem>
  );
};

LineCreator.propTypes = {
  entry: PropTypes.object.isRequired
};

export default observer(LineCreator);
