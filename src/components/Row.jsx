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
    padding: 0,
    background: "none",
    border: "none",
    transitionDuration: "0.1s",
    borderRadius: 50,
    "&:hover": {
      cursor: "pointer",
      background: "#EDE8F2"
    },
    "&:focus": {
      outline: 0
    }
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
        <Typography variant="headline" style={{ color: "#797979" }}>
          {type}
        </Typography>
        <Grid container justify="space-around" alignItems="center">
          {row.map((gauge, i) => (
            <Grid item key={i} style={{ marginBottom: 0 }}>
              <Grid container alignItems="center" spacing={8}>
                {isSlider ? (
                  <MySlider type={gauge.type} />
                ) : (
                  <Grid item xs={2} sm={2} />
                )}
                {gauge ? (
                  <Grid item xs={2} sm={10}>
                    <button
                      className={classes.button}
                      onClick={() => {
                        this.setState({ isOpen: true, idx: i });
                      }}
                    >
                      <Gauge
                        index={gauge.idx}
                        gaugeData={gauge.gaugeData}
                        elem={gauge.elem}
                      />
                    </button>
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
        <GaugeGraphModal
          title={row[0].label}
          onClose={this.onClose}
          isOpen={this.state.isOpen}
          gauge={
            <Gauge
              index={row[this.state.idx].idx}
              gaugeData={row[this.state.idx].gaugeData}
              elem={row[this.state.idx].elem}
            />
          }
          timeSeries={
            <TimeSeries
              gaugeData={row[this.state.idx].gaugeData}
              data={row[this.state.idx].graphData}
              daysAboveThisYear={row[this.state.idx].daysAboveThisYear}
            />
          }
        />
      </div>
    );
  }
}

export default withRoot(withStyles(styles)(inject("appStore")(observer(Rows))));
