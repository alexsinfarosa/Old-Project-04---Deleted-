import React from "react";

const PieLabels = ({
  cx,
  cy,
  startAngle,
  midAngle,
  endAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
  payload,
  fill
}) => {
  const RADIAN = Math.PI / 180;

  // Provides coordinate for quantiles on the Pie
  const sin = Math.sin(-RADIAN * endAngle);
  const cos = Math.cos(-RADIAN * endAngle);
  const x = cx + (innerRadius - 12) * cos;
  const y = cy + (innerRadius - 12) * sin;

  // Provides coordinates for the arc labels
  const sinL = Math.sin(-RADIAN * midAngle);
  const cosL = Math.cos(-RADIAN * midAngle);
  const xL = cx + (innerRadius + (outerRadius - innerRadius) / 2) * cosL;
  const yL = cy + (innerRadius + (outerRadius - innerRadius) / 2) * sinL;

  const { name } = payload;
  // console.log(payload.payload);
  return (
    <g>
      <text
        style={{ fontSize: 11 }}
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? "middle" : "middle"}
        dominantBaseline="central"
      >
        {payload.endArcQuantile}
      </text>

      {(name === "Min" ||
        name === "25%" ||
        name === "Mean" ||
        name === "75%" ||
        name === "Max") && <circle cx={xL} cy={yL} r={14} fill="#fff" />}

      <text
        textAnchor="middle"
        x={xL}
        y={yL}
        dy=".33em"
        fontSize={9}
        fill={name === "New Record" ? "white" : "black"}
        fontWeight="bold"
      >
        {payload.name}
      </text>
    </g>
  );
};

export default PieLabels;
