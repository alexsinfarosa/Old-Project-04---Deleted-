import React, { Component, Fragment } from "react";
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
    const { row } = this.props;
    return (
      <Fragment>
        {row ? (
          <Grid container spacing={24} direction="column">
            <Grid item>
              <Typography variant="display1">{row[0].label}</Typography>
            </Grid>
            <Grid container justify="center">
              {row.map(gauge => (
                <Gauge
                  key={gauge.type}
                  index={gauge.idx}
                  gaugeData={gauge.gaugeData}
                />
              ))}
            </Grid>
          </Grid>
        ) : null}
      </Fragment>
    );
  }
}

export default withRoot(withStyles(styles)(inject("appStore")(observer(Rows))));
