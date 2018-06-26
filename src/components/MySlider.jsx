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
    const {
      setSeasonalExtreme,
      maxt,
      mint,
      pcpn,
      snow
    } = this.props.appStore.paramsStore;
    let value;
    if (type.label === "Days >" || type.label === "Days <") value = maxt;
    if (type.label === "Nights >" || type.label === "Nights <") value = mint;
    if (type.label === "Rainfall >") value = pcpn;
    if (type.label === "Snowfall >") value = snow;

    return (
      <Slider
        style={{ height: 250 }}
        vertical
        trackStyle={{ background: "#843EA4" }}
        min={type.min}
        marks={type.marks}
        step={null}
        max={type.max}
        // value={value}
        onAfterChange={e => setSeasonalExtreme(type.label, e)}
        // defaultValue={type.defaultValue}
      />
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("appStore")(observer(MySlider)))
);
