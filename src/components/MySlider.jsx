import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "../withRoot";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const styles = theme => ({
  root: { flexGrow: 1 }
});

class MySlider extends Component {
  render() {
    const { type } = this.props;
    // console.log(type);
    return (
      <Slider
        vertical
        min={type.min}
        marks={type.marks}
        step={type.steps}
        max={type.max}
        // onChange={log}
        defaultValue={type.defaultValue}
      />
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("appStore")(observer(MySlider)))
);
