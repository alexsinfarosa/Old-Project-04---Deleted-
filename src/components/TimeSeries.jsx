import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "../withRoot";
import withMobileDialog from "@material-ui/core/withMobileDialog";

import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  Line
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
      <ComposedChart width={900} height={350} data={data}>
        <XAxis dataKey="date" tick={<GraphLabels />} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend
          verticalAlign="top"
          align="right"
          height={36}
          iconSize={18}
          iconType="rect"
          payload={
            [
              // {
              //   value: `Days above ${daysAboveThisYear} ˚F`,
              //   type: "rect",
              //   color: "#ddd"
              // }
              // {
              //   value: `Observed Data Mean ${1111}`,
              //   type: "line",
              //   color: "#ff7300"
              // }
            ]
          }
        />

        <Bar dataKey="value">
          {data.map((e, i) => {
            if (i === data.length - 1) {
              return <Cell key={i} />;
            }
            return <Cell key={i} fill="#ddd" />;
          })}
        </Bar>
        <Line type="monotone" dataKey="mean" stroke="#ff7300" dot={false} />
      </ComposedChart>
    );
  }
}

export default withRoot(
  withStyles(styles)(
    inject("appStore")(observer(withMobileDialog()(TimeSeries)))
  )
);
