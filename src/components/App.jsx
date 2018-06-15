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
    // background: "#e8ecf0"
  },
  centered: {
    display: "flex",
    flex: 1,
    height: 300,
    justifyContent: "center",
    alignItems: "center"
  }
});

class App extends Component {
  render() {
    const { classes } = this.props;
    const { station, avgTemps, avgPcpns } = this.props.appStore.paramsStore;
    console.log(avgTemps);
    return (
      <div className={classes.root}>
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
            <div style={{ marginTop: 32 }}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed
              similique aliquam repellat harum velit ad eveniet dolorem autem
              saepe rem? Dolores, temporibus voluptate? Modi aliquid nostrum,
              consequatur quis doloribus facere?
            </div>
          </Grid>
          <Grid item xs={12} sm={8}>
            {avgTemps ? (
              <Row row={avgTemps} />
            ) : (
              <div className={classes.centered}>
                <RingLoader color={"#843EA4"} loading={!avgTemps} />
              </div>
            )}
            {avgPcpns ? (
              <Row row={avgPcpns} />
            ) : (
              <div className={classes.centered}>
                <RingLoader color={"#843EA4"} loading={!avgTemps} />
              </div>
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}
export default withRoot(withStyles(styles)(inject("appStore")(observer(App))));
