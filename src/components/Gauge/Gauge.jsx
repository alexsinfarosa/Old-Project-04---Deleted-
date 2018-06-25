import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "../../withRoot";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import { arcColoring } from "../../utils/utils";

import { PieChart, Pie, Cell } from "recharts";
import PieLabels from "./PieLabels";
import InnerCircle from "./InnerCircle";

const styles = theme => ({
  root: { flexGrow: 1 }
});

let height = 250;
let width = 360;

class Gauge extends Component {
  render() {
    const { index, gaugeData, elem } = this.props;
    // console.log(index);
    let cell;
    if (gaugeData) {
      cell = gaugeData.map((arc, index) => {
        return <Cell key={index} fill={arcColoring(arc.name)} />;
      });
    }

    return (
      <Button size="small" style={{ margin: 0, padding: 0 }}>
        <PieChart width={width} height={height}>
          <Pie
            opacity={0.5}
            activeIndex={index}
            activeShape={<InnerCircle elem={elem} />}
            startAngle={250}
            endAngle={-70}
            dataKey="value"
            data={gaugeData}
            cx={width / 2}
            cy={height / 1.95}
            labelLine={false}
            label={<PieLabels selectedIdx={index} />}
            innerRadius={60}
            outerRadius={110}
          >
            {cell}
          </Pie>
        </PieChart>
      </Button>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("appStore")(observer(Gauge)))
);
