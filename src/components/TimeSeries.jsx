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
  Cell
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
    const { data } = this.props;
    console.log(data);
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
        <Bar dataKey="bar" fill={"red"}>
          {data.map((entry, index) => {
            return <Cell key={index} fill={entry.barColor} />;
          })}
        </Bar>
        />
      </BarChart>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("appStore")(observer(TimeSeries)))
);
