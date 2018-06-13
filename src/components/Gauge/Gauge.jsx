import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "../../withRoot";
import Grid from "@material-ui/core/Grid";

import { PieChart, Pie } from "recharts";

const styles = theme => ({
  root: { flexGrow: 1 }
});

let height = 250;
let width = 360;

class Gauge extends Component {
  render() {
    return (
      <Grid item style={{ border: "1px solid #eee" }}>
        <PieChart width={width} height={height} style={{ background: "pink" }}>
          <Pie
            activeIndex={0}
            // activeShape={<InnerCircle type="Observed Data" />}
            startAngle={-30}
            endAngle={210}
            dataKey="name"
            data={[{ name: 10 }, { name: 20 }, { name: 30 }]}
            cx={width / 2}
            cy={height / 1.6}
            labelLine={true}
            // label={PieLabels}
            innerRadius={80}
            outerRadius={130}
          />
        </PieChart>
      </Grid>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("appStore")(observer(Gauge)))
);
