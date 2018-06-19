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
    const { marks } = this.props;
    console.log(marks);
    return (
      <Slider
        vertical
        min={80}
        marks={marks}
        step={5}
        max={100}
        // onChange={log}
        defaultValue={85}
      />
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("appStore")(observer(MySlider)))
);
