import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "../withRoot";
import Grid from "@material-ui/core/Grid";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const styles = theme => ({
  root: {
    height: 150
  }
});

class MySlider extends Component {
  render() {
    const { classes, type } = this.props;
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
      <Grid item xs={2} sm={2} style={{ height: 150 }}>
        <Slider
          handleStyle={{
            borderColor: "#843EA4",
            height: 14,
            width: 14,
            backgroundColor: "white"
          }}
          dotStyle={{ borderColor: "#843EA4" }}
          activeDotStyle={{ borderColor: "#843EA4" }}
          trackStyle={{ background: "#843EA4" }}
          vertical
          min={type.min}
          marks={type.marks}
          step={null}
          max={type.max}
          // value={value}
          onAfterChange={e => setSeasonalExtreme(type.label, e)}
          defaultValue={value}
        />
      </Grid>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("appStore")(observer(MySlider)))
);
