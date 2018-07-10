import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "../withRoot";
// import getYear from "date-fns/getYear";
import {
  BarChart,
  Bar,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from "recharts";

import GraphLabels from "./GraphLabels";

const styles = theme => ({
  root: { flexGrow: 1 }
});

const width = 1200;
const height = 350;
class TimeSeries extends Component {
  render() {
    const { gauge } = this.props;

    const renderTooltip = d => {
      if (d.payload[0]) {
        const bar = d.payload[0].payload;
        return (
          <div
            style={{
              background: "white",
              borderRadius: 10,
              padding: 5,
              border: "1px solid #b2b2b2"
            }}
          >
            <p style={{ fontWeight: "bold", color: "#b2b2b2" }}>
              Date: {bar.date}
            </p>
            <p style={{ fontWeight: "bold", color: bar.barColor }}>
              Value: {bar.value}
            </p>
          </div>
        );
      }
    };

    return (
      <BarChart
        width={width}
        height={height}
        data={gauge.graphData}
        margin={{ top: 30, right: 0, left: 0, bottom: 30 }}
      >
        <CartesianGrid strokeDasharray="1 1" />
        <XAxis dataKey="date" tick={<GraphLabels />} />
        <YAxis allowDecimals={false} domain={["dataMin - 1", "dataMax + 1"]} />
        <Tooltip content={renderTooltip} />
        <ReferenceLine isFront y={0} stroke="#000" />
        {/*<Brush
          dataKey="name"
          height={30}
          stroke="#8884d8"
          tickFormatter={x => getYear(gauge.graphData[x].date)}
        />*/}
        <Bar dataKey="bar" fill={"red"}>
          {gauge.graphData.map((entry, index) => {
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
