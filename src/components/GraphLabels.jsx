import React, { Component } from "react";

export default class GraphLabels extends Component {
  render() {
    const { x, y, payload } = this.props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={10}
          fontSize={10}
          textAnchor="end"
          fill="#666"
          transform="rotate(-15)"
        >
          {payload.value}
        </text>
      </g>
    );
  }
}
