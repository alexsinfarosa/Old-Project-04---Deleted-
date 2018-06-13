import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "../withRoot";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import Gauge from "./Gauge/Gauge";

const styles = theme => ({
  root: {}
});

class Rows extends Component {
  render() {
    return (
      <Grid container spacing={24} direction="column">
        <Grid item>
          <Typography variant="display1" gutterBottom>
            Temperature
          </Typography>
        </Grid>
        <Grid container justify="center">
          <Gauge />
          <Gauge />
          <Gauge />
        </Grid>
      </Grid>
    );
  }
}

export default withRoot(withStyles(styles)(inject("appStore")(observer(Rows))));
