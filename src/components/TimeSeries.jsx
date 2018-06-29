import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "../withRoot";
import getYear from "date-fns/getYear";
import {
  BarChart,
  Bar,
  Brush,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

import GraphLabels from "./GraphLabels";

// import { arcColoring } from "../utils/utils";

const styles = theme => ({
  root: { flexGrow: 1 }
});

const width = 1000;
const height = 350;
class TimeSeries extends Component {
  barColor = (val, gaugeDataNoCircles) => {
    gaugeDataNoCircles.map((arc, i) => {
      if (val >= arc.endArcQuantile && val < arc.endArcQuantile)
        return arc.fill;
    });
  };

  render() {
    const { data, gaugeData } = this.props;
    // console.log(data);
    const gaugeDataNoCircles = gaugeData.filter(
      obj =>
        obj.name !== "Min" &&
        obj.name !== "25%" &&
        obj.name !== "Mean" &&
        obj.name !== "75%" &&
        obj.name !== "Max"
    );
    // console.log(gaugeDataNoCircles);
    return (
      <BarChart
        width={width}
        height={height}
        data={data}
        margin={{ top: 30, right: 40, left: 40, bottom: 30 }}
      >
        <CartesianGrid strokeDasharray="1 1" />
        <XAxis dataKey="date" tick={<GraphLabels />} />
        <YAxis allowDecimals={false} />
        <Tooltip label="value" />
        <ReferenceLine isFront y={0} stroke="#000" />
        <Brush
          dataKey="name"
          height={30}
          stroke="#8884d8"
          tickFormatter={x => getYear(data[x].date)}
        />
        <Bar dataKey="bar" fill="#82ca9d" />
        />
      </BarChart>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("appStore")(observer(TimeSeries)))
);
