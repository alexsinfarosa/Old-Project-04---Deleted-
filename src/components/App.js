import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import withRoot from "../withRoot";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import Slider from "rc-slider/lib/Slider";
import "rc-slider/assets/index.css";

// components
import StationsMap from "./StationsMap";

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing.unit * 2
  }
});

const marks = {
  80: {
    style: {
      whiteSpace: "nowrap"
    },
    label: "80 °C"
  },
  85: {
    style: {
      whiteSpace: "nowrap"
    },
    label: "85 °C"
  },
  90: {
    style: {
      whiteSpace: "nowrap"
    },
    label: "90 °C"
  },
  95: {
    style: {
      whiteSpace: "nowrap"
    },
    label: "95 °C"
  },
  100: {
    style: {
      whiteSpace: "nowrap"
    },
    label: "100 °C"
  }
};

const marks2 = {
  1: {
    style: {
      whiteSpace: "nowrap"
    },
    label: "1 in"
  },
  2: {
    style: {
      whiteSpace: "nowrap"
    },
    label: "2 in"
  },
  3: {
    style: {
      whiteSpace: "nowrap"
    },
    label: "3 in"
  },
  4: {
    style: {
      whiteSpace: "nowrap"
    },
    label: "4 in"
  }
};

class App extends Component {
  render() {
    const { classes } = this.props;
    const { station } = this.props.appStore.paramsStore;
    return (
      <Grid container className={classes.root} spacing={24}>
        <Grid item xs={12} sm={4}>
          {station ? (
            <Typography variant="display1" gutterBottom>
              <div>Viewing Climate Conditions at </div>
              {station.name}
            </Typography>
          ) : (
            <Typography variant="display1" gutterBottom>
              Select a station
            </Typography>
          )}
          <StationsMap />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography
            variant="display1"
            gutterBottom
            style={{ marginBottom: 16 }}
          >
            Temperature
          </Typography>
          <Grid container style={{ marginBottom: 32 }}>
            <Grid item xs={1}>
              <Slider
                vertical
                min={80}
                marks={marks}
                step={5}
                max={100}
                // onChange={log}
                defaultValue={85}
              />
            </Grid>
            <Grid item xs={11}>
              <div
                style={{
                  height: 200,
                  border: "1px solid #eded",
                  marginBottom: 16
                }}
              />
            </Grid>
          </Grid>

          <Typography
            variant="display1"
            gutterBottom
            style={{ marginBottom: 16 }}
          >
            Precipitation
          </Typography>
          <Grid container style={{ marginBottom: 32 }}>
            <Grid item xs={1}>
              <Slider vertical min={1} marks={marks2} step={1} max={4} />
            </Grid>
            <Grid item xs={11}>
              <div
                style={{
                  height: 200,
                  border: "1px solid #eded",
                  marginBottom: 16
                }}
              />
            </Grid>
          </Grid>

          <Typography
            variant="display1"
            gutterBottom
            style={{ marginBottom: 16 }}
          >
            Since January
          </Typography>
          <Grid container style={{ marginBottom: 32 }}>
            <Grid item xs={1}>
              <Slider
                vertical
                min={80}
                marks={marks}
                step={5}
                max={100}
                // onChange={log}
                defaultValue={85}
              />
            </Grid>
            <Grid item xs={11}>
              <div
                style={{
                  height: 200,
                  border: "1px solid #eded",
                  marginBottom: 16
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
export default withRoot(withStyles(styles)(inject("appStore")(observer(App))));
