import React, { Component, Fragment } from "react";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "../withRoot";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import Gauge from "./Gauge/Gauge";
import MySlider from "./MySlider";

const styles = theme => ({
  root: {}
});

class Rows extends Component {
  render() {
    const { row, isSlider } = this.props;
    return (
      <Fragment>
        {row ? (
          <Grid container spacing={24} direction="column">
            <Grid item>
              <Typography variant="display1">{row[0].label}</Typography>
            </Grid>

            <Grid container wrap="nowrap">
              {row.map((gauge, i) => (
                <Fragment key={i}>
                  {isSlider && (
                    <Grid item style={{ height: 300, marginRight: -14 }}>
                      <MySlider type={gauge.type} />
                    </Grid>
                  )}
                  <Gauge
                    index={gauge.idx}
                    gaugeData={gauge.gaugeData}
                    elem={gauge.elem}
                  />
                </Fragment>
              ))}
            </Grid>
          </Grid>
        ) : null}
      </Fragment>
    );
  }
}

export default withRoot(withStyles(styles)(inject("appStore")(observer(Rows))));
