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

class TimeSeries extends Component {
  render() {
    const { data } = this.props;

    return (
      <BarChart
        width={1000}
        height={350}
        data={data}
        margin={{ top: 30, right: 40, left: 40, bottom: 30 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={<GraphLabels />} />
        <YAxis allowDecimals={false} />
        <Tooltip label="value" />
        <ReferenceLine y={data[0].mean} stroke="#000" />
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
