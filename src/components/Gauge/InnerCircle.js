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
  daysAboveThisYear,
  label
}) => {
  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill={fill}
        fontSize={14}
        fontWeight="bold"
      >
        {label}
      </text>

      <text
        x={cx}
        y={cy + 25}
        dy={8}
        textAnchor="middle"
        fill={fill}
        fontSize={16}
        fontWeight="bold"
      >
        {Number(daysAboveThisYear).toFixed(1)}
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

      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={innerRadius - 3}
        outerRadius={innerRadius + 1}
        fill={fill}
      />
    </g>
  );
};

export default InnerCircle;
