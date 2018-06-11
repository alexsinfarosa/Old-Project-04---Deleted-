import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import withRoot from "../withRoot";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

// components
import StationsMap from "./StationsMap";

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing.unit * 2
  }
});

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
          <Typography variant="display1" gutterBottom>
            Temperature
          </Typography>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum
          architecto natus doloremque, id, iste facere ad, minus illum quidem
          quae dolorum voluptas aperiam accusantium. Nihil facere maxime
          mollitia sapiente qui.
        </Grid>
      </Grid>
    );
  }
}
export default withRoot(withStyles(styles)(inject("appStore")(observer(App))));
