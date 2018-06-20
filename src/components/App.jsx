import React, { Component } from "react";
import { inject, observer } from "mobx-react";

import withRoot from "../withRoot";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

// components
import StationsMap from "./StationsMap";
import Row from "./Row";
import { RingLoader } from "react-spinners";

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing.unit * 2
    // background: "#e8ecf0",
    // marginTop: 0,
    // paddingTop: 2
  },
  centered: {
    display: "flex",
    flex: 1,
    height: 300,
    justifyContent: "center",
    alignItems: "center"
  },
  legend: {
    color: "white",
    fontWeight: "bold",
    letterSpacing: 1,
    textAlign: "center"
  }
});

class App extends Component {
  render() {
    const { classes } = this.props;
    const {
      station,
      avgTemps,
      avgPcpns,
      seasonalExtreme
    } = this.props.appStore.paramsStore;

    return (
      <div className={classes.root}>
        <Grid container className={classes.root} spacing={24}>
          {/**<Grid container>
            <Grid item style={{ flex: 1, background: "#dcdcdc", height: 20 }}>
              <Typography className={classes.legend}>NEW RECORD</Typography>
            </Grid>
            <Grid item style={{ flex: 1, background: "#a1c2f3", height: 20 }}>
              <Typography className={classes.legend}>BELOW</Typography>
            </Grid>
            <Grid item style={{ flex: 1, background: "#91ac76", height: 20 }}>
              <Typography className={classes.legend}>SLIGHTLY BELOW</Typography>
            </Grid>
            <Grid item style={{ flex: 1, background: "#f4dcaa", height: 20 }}>
              <Typography className={classes.legend}>SLIGHTLY ABOVE</Typography>
            </Grid>
            <Grid item style={{ flex: 1, background: "#dea59c", height: 20 }}>
              <Typography className={classes.legend}>ABOVE</Typography>
            </Grid>
          </Grid>**/}
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
            <div style={{ marginTop: 32 }}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed
              similique aliquam repellat harum velit ad eveniet dolorem autem
              saepe rem? Dolores, temporibus voluptate? Modi aliquid nostrum,
              consequatur quis doloribus facere?
            </div>
          </Grid>
          <Grid item xs={12} sm={8}>
            {avgTemps ? (
              <Row row={avgTemps} isSlider={false} />
            ) : (
              <div className={classes.centered}>
                <RingLoader color={"#843EA4"} loading={!avgTemps} />
              </div>
            )}
            {avgPcpns ? (
              <Row row={avgPcpns} isSlider={false} />
            ) : (
              <div className={classes.centered}>
                <RingLoader color={"#843EA4"} loading={!avgPcpns} />
              </div>
            )}
            {seasonalExtreme ? (
              <Row row={seasonalExtreme} isSlider={true} />
            ) : (
              <div className={classes.centered}>
                <RingLoader color={"#843EA4"} loading={!seasonalExtreme} />
              </div>
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}
export default withRoot(withStyles(styles)(inject("appStore")(observer(App))));
