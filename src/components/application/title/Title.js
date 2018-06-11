import React, { Component } from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

class Title extends Component {
  static contextTypes = {
    router: PropTypes.object
  };
  render() {
    const { router } = this.context;

    const pathName = router.route.location.pathname
      .replace("/", "")
      .toUpperCase();

    let title;

    switch (pathName) {
      case "SCRATCHPAD":
        title = "Scratch Pad";
        break;
      default:
        title = "EatAndDo";
    }

    return <div>{title}</div>;
  }
}

export default observer(Title);
