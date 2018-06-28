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
  Tooltip,
  Label,
  Text
} from "recharts";

import GraphLabels from "./GraphLabels";

// import { arcColoring } from "../utils/utils";

const styles = theme => ({
  root: { flexGrow: 1 }
});

const width = 1000;
const height = 350;
class TimeSeries extends Component {
  render() {
    const { data, x, y } = this.props;
    return (
      <BarChart
        width={width}
        height={height}
        data={data}
        margin={{ top: 30, right: 40, left: 40, bottom: 30 }}
      >
        <CartesianGrid strokeDasharray="1 1" />
        <XAxis dataKey="date" tick={<GraphLabels />} />
        <YAxis
          hide
          allowDecimals={false}
          domain={[
            data[0].quantiles[0],
            data[0].quantiles[data[0].quantiles.length - 1]
          ]}
        >
          <Label value="Mean" offset={0} position="insideLeft" />
        </YAxis>
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
