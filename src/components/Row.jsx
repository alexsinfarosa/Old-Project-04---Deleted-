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

const styles = theme => ({
  root: { flexGrowth: 1 }
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
    const { classes, row, isSlider } = this.props;
    // console.log(row[this.state.idx]);
    return (
      <div className={classes.root}>
        {row ? (
          <Grid container spacing={24} direction="column">
            <Grid item>
              <Typography
                variant="display1"
                style={{ fontSize: "1.5rem", marginBottom: 16, marginTop: 32 }}
              >
                {row[0].label}
              </Typography>
            </Grid>

            <Grid container>
              {row.map((gauge, i) => (
                <Fragment key={i}>
                  {isSlider && (
                    <Grid
                      item
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 280,
                        marginRight: -14,
                        zIndex: 99
                      }}
                    >
                      <MySlider type={gauge.type} />
                    </Grid>
                  )}

                  <Button
                    size="small"
                    style={{ margin: 0, padding: 0 }}
                    onClick={() => {
                      this.setState({ isOpen: true, idx: i });
                    }}
                  >
                    <Gauge
                      index={gauge.idx}
                      gaugeData={gauge.gaugeData}
                      elem={gauge.elem}
                    />
                  </Button>
                </Fragment>
              ))}
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
                    data={row[this.state.idx].graphData}
                    daysAboveThisYear={row[this.state.idx].daysAboveThisYear}
                  />
                }
              />
            </Grid>
          </Grid>
        ) : null}
      </div>
    );
  }
}

export default withRoot(withStyles(styles)(inject("appStore")(observer(Rows))));
