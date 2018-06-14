import React, { Component, Fragment } from "react";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "../../withRoot";
import Grid from "@material-ui/core/Grid";

import { arcColoring } from "../../utils/utils";

import { PieChart, Pie, Cell } from "recharts";
import PieLabels from "./PieLabels";
import InnerCircle from "./InnerCircle";

import { RingLoader } from "react-spinners";

const styles = theme => ({
  root: { flexGrow: 1 }
});

let height = 250;
let width = 360;

class Gauge extends Component {
  render() {
    const { avgPcpns } = this.props.appStore.paramsStore;
    const { idx, gaugeData } = this.props;

    let cell;
    if (gaugeData) {
      cell = gaugeData.map((arc, index) => {
        return <Cell key={index} fill={arcColoring(arc.name)} />;
      });
    }
    console.log(gaugeData);
    return (
      <Fragment>
        {gaugeData ? (
          <Grid item>
            <PieChart width={width} height={height}>
              <Pie
                activeIndex={idx}
                // activeShape={<InnerCircle type="Observed Data" />}
                startAngle={240}
                endAngle={-60}
                dataKey="sector"
                data={gaugeData}
                cx={width / 2}
                cy={height / 1.95}
                labelLine={false}
                label={PieLabels}
                innerRadius={80}
                outerRadius={130}
              >
                {cell}
              </Pie>
            </PieChart>
          </Grid>
        ) : (
          <div
            style={{
              display: "flex",
              flex: 1,
              height: height,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <RingLoader color={"#843EA4"} loading={!gaugeData} />
          </div>
        )}
      </Fragment>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("appStore")(observer(Gauge)))
);
