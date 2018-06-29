import React, { Component, Fragment } from "react";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "../withRoot";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import Gauge from "./Gauge/Gauge";
import MySlider from "./MySlider";
import GaugeGraphModal from "./GaugeGraphModal";
import TimeSeries from "./TimeSeries";

import { RingLoader } from "react-spinners";

const styles = theme => ({
  root: { flexGrowth: 1 },
  widget: {
    width: 360,
    height: 310,
    border: "1px solid #ddd"
  },
  button: {
    margin: 0,
    padding: 0
  },
  slider: {
    // border: "1px solid #ddd"
  }
});

class Rows extends Component {
  state = {
    isOpen: false,
    idx: 0
  };

  onClose = () => {
    this.setState({ isOpen: false });
  };

  render() {
    const { classes, row, type, isSlider } = this.props;

    return (
      <div className={classes.root}>
        <Typography variant="headline">{type}</Typography>
        <Grid container justify="space-around" alignItems="center">
          {row.map((gauge, i) => (
            <Grid item key={i} style={{ marginBottom: 0 }}>
              <Grid container alignItems="center">
                {isSlider ? (
                  <MySlider type={gauge.type} />
                ) : (
                  <Grid item xs={2} sm={1} />
                )}
                {gauge ? (
                  <Grid item xs={2} sm={11}>
                    <Gauge
                      index={gauge.idx}
                      gaugeData={gauge.gaugeData}
                      elem={gauge.elem}
                    />
                  </Grid>
                ) : (
                  <Grid item sm={10}>
                    <RingLoader color={"#843EA4"} loading={!gauge} />
                  </Grid>
                )}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }
}

export default withRoot(withStyles(styles)(inject("appStore")(observer(Rows))));
