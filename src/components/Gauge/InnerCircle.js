import React from "react";
import { Sector } from "recharts";

const InnerCircle = ({
  cx,
  cy,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  payload
}) => {
  const { daysAboveThisYear, gaugeTitle } = payload;

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill={fill}
        fontSize={16}
        fontWeight="bold"
      >
        {gaugeTitle}
      </text>

      <text
        x={cx}
        y={cy + 20}
        dy={8}
        textAnchor="middle"
        fill={fill}
        fontSize={16}
        fontWeight="bold"
      >
        {daysAboveThisYear}
      </text>

      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />

      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius - 1}
        outerRadius={outerRadius + 15}
        fill={fill}
      />
    </g>
  );
};

export default InnerCircle;
