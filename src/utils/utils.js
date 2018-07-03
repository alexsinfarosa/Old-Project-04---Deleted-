import { jStat } from "jStat";
import isEqual from "lodash.isequal";

const without = (arr, ...args) => arr.filter(v => !args.includes(v));

export const closest = (n, arr) => {
  if (arr.length === 1) return 0;
  return arr
    .map((q, i) => {
      if (i === 0 && n < q) return 0;
      if (i === arr.length - 1 && n >= q) return 0;
      if (i !== arr.length - 1) {
        if (n >= q && n < arr[i + 1]) return i + 1;
      }
    })
    .filter(d => d !== undefined)[0];
};

export const determineQuantiles = data => {
  const d = without(data, NaN); // Because some values are NaN
  // console.log(d);
  let original = jStat
    .quantiles(d, [0, 0.25, 0.5, 0.75, 1])
    .map(x => Math.round(x));
  // let original = [4, 4, 4, 4, 4]; // does not work. FIX IT
  console.log(`original: ${original}`);

  if (
    original[0] === original[1] &&
    original[1] === original[2] &&
    original[2] === original[3] &&
    original[3] === original[4]
  ) {
    console.log({ "100": original[4] });
    return { "100": original[4] };
  }

  if (
    original[0] === original[1] &&
    original[2] === original[3] &&
    original[3] === original[4]
  ) {
    console.log({ "0": original[0], "50": original[2] });
    return { "0": original[0], "50": original[2] };
  }

  if (
    original[1] === original[2] &&
    original[2] === original[3] &&
    original[3] === original[4]
  ) {
    console.log({ "0": original[0], "50": original[2] });
    return { "0": original[0], "50": original[2] };
  }

  let q = {};
  original.forEach((value, i) => {
    let k;
    if (i === 0) k = 0;
    if (i === 1) k = 25;
    if (i === 2) k = 50;
    if (i === 3) k = 75;
    if (i === 4) k = 100;
    q[value] = k;
  });
  const values = Object.keys(q);
  const keys = Object.values(q);
  let results = {};
  keys.forEach((key, i) => {
    results[key] = Number(values[i]);
  });
  console.log(results);
  return results;
};

export const index = (threshold, quantiles) => {
  // console.log(threshold);
  const d = Number(threshold); // ex: 13
  const q = quantiles; // ex: [3,11,23,66]

  if (q.length === 5) {
    // console.log(`d: ${d}, q = [min, .25, .5, .75, 1]: [${q}]`);

    // less then min (new record)
    if (d < q[0]) return 0;
    // is the min
    // if (d === q[0]) return 1;
    // is below
    if (d >= q[0] && d < q[1]) return 2;
    // is the 25th percentile
    // if (d === q[1]) return 3;
    // is slightly below
    if (d >= q[1] && d < q[2]) return 4;
    // is the mean
    // if (d === q[2]) return 5;
    // is slightly above
    if (d >= q[2] && d < q[3]) return 6;
    // is the 75% percentile
    // if (d === q[3]) return 7;
    // is above
    if (d >= q[3] && d < q[4]) return 8;
    // is equal to max
    // if (d === q[4]) return 9;
    // new record
    if (d > q[4]) return 10;
  }

  if (q.length === 4) {
    // console.log(
    //   `d: ${d}, q = [min, mean, 75, max]: [${q[0]}, ${q[1]}, ${q[2]}, ${q[3]}]`
    // );
    if (d < q[0]) return 0;
    // is the 25%
    // if (d === q[0]) return 0;
    // is slightly below
    if (d >= q[0] && d < q[1]) return 2;
    // is the Mean
    // if (d === q[1]) return 2;
    // is slightly above
    if (d >= q[1] && d < q[2]) return 4;
    // is the 75%
    // if (d === q[2]) return 4;
    // is above
    if (d >= q[2] && d < q[3]) return 6;
    // is the Max
    // if (d === q[3]) return 6;
    // new record
    if (d > q[3]) return 8;
  }

  if (q.length === 3) {
    // console.log(`d: ${d}, q = [mean, 75, max]: [${q[0]}, ${q[1]}, ${q[2]}]`);
    if (d < q[0]) return 0;
    // is the Mean
    // if (d === q[0]) return 0;
    // is slightly above
    if (d >= q[0] && d < q[1]) return 2;
    // is the 75th percentile
    // if (d === q[1]) return 2;
    // is above
    if (d >= q[1] && d < q[2]) return 4;
    // is the Max
    // if (d === q[2]) return 4;
    // new record
    if (d > q[2]) return 6;
  }

  if (q.length === 2) {
    console.log(`d: ${d}, q = [mean, max]: [${q[0]}, ${q[1]}]`);
    if (d < q[0]) return 0;
    // is the 75% or less
    // if (d === q[0]) return 0;
    // is above
    if (d >= q[0] && d < q[1]) return 2;
    // is max
    // if (d === q[1]) return 2;
    // Not expected
    if (d > q[1]) return 4;
  }

  if (q.length === 1) {
    // console.log(`d: ${d}, q = [max]: [${q[0]}]`);
    // is the Mean
    // if (d === q[0]) return 0;
    if (d < q[0]) return 0;
    // is slightly above
    if (d >= q[0]) return 1;
    // is slightly below
  }
};

export const arcColoring = name => {
  if (name === "Min") return "#565656";
  if (name === "Below") return "#0088FE";
  if (name === "25%") return "#565656";
  if (name === "Slightly Below") return "#7FB069";
  if (name === "Mean") return "#565656";
  if (name === "Slightly Above") return "#FFBB28";
  if (name === "75%") return "#565656";
  if (name === "Above") return "#E63B2E";
  if (name === "Max") return "#565656";
  // if (name === "New Record") return "#292F36";
  if (name === "New") return "#BEBEBE";
  if (name === "Always Observed") return "#BEBEBE";
};

export const projectionHeaderMessage = name => {
  if (name === "Min") return "the minimum value";
  if (name === "Below") return "below normal";
  if (name === "25%") return "the 25% percentile";
  if (name === "Slightly Below") return "slightly below the normal";
  if (name === "Mean") return "the mean value";
  if (name === "Slightly Above") return "slightly above the normal";
  if (name === "75%") return "the 75% percentile";
  if (name === "Above") return "above the normal";
  if (name === "Max") return "the maximum value";
};

export const arcData = (quantiles, daysAboveThisYear, idx, gaugeTitle) => {
  const keys = Object.keys(quantiles);
  const values = Object.values(quantiles);
  // console.log(keys, values);
  if (values.length === 5) {
    return [
      {
        name: "New",
        startArcQuantile: null,
        endArcQuantile: values[0],
        daysAboveThisYear,
        idx,
        gaugeTitle,
        value: 2,
        fill: "#BEBEBE"
      },
      {
        name: "Min",
        startArcQuantile: values[0],
        endArcQuantile: values[0],
        daysAboveThisYear,
        idx,
        gaugeTitle,
        value: 0,
        fill: "#BEBEBE"
      },
      {
        name: "Below",
        startArcQuantile: values[0],
        endArcQuantile: values[1],
        daysAboveThisYear,
        idx,
        gaugeTitle,
        value: 4,
        fill: "#0088FE"
      },
      {
        name: "25%",
        startArcQuantile: values[1],
        endArcQuantile: values[1],
        daysAboveThisYear,
        idx,
        gaugeTitle,
        value: 0,
        fill: "#BEBEBE"
      },
      {
        name: "Slightly Below",
        startArcQuantile: values[1],
        endArcQuantile: values[2],
        daysAboveThisYear,
        idx,
        gaugeTitle,
        value: 4,
        fill: "#7FB069"
      },
      {
        name: "Mean",
        startArcQuantile: values[2],
        endArcQuantile: values[2],
        daysAboveThisYear,
        idx,
        gaugeTitle,
        value: 0,
        fill: "#BEBEBE"
      },
      {
        name: "Slightly Above",
        startArcQuantile: values[2],
        endArcQuantile: values[3],
        daysAboveThisYear,
        idx,
        gaugeTitle,
        value: 4,
        fill: "#FFBB28"
      },
      {
        name: "75%",
        startArcQuantile: values[3],
        endArcQuantile: values[3],
        daysAboveThisYear,
        idx,
        gaugeTitle,
        value: 0,
        fill: "#BEBEBE"
      },
      {
        name: "Above",
        startArcQuantile: values[3],
        endArcQuantile: values[4],
        daysAboveThisYear,
        idx,
        gaugeTitle,
        value: 4,
        fill: "#E63B2E"
      },
      {
        name: "Max",
        startArcQuantile: values[4],
        endArcQuantile: values[4],
        daysAboveThisYear,
        idx,
        gaugeTitle,
        value: 0,
        fill: "#BEBEBE"
      },
      {
        name: "New",
        startArcQuantile: values[4],
        endArcQuantile: null,
        daysAboveThisYear,
        idx,
        gaugeTitle,
        value: 2,
        fill: "#BEBEBE"
      }
    ];
  }

  if (values.length === 4) {
    if (isEqual(keys, ["0", "50", "75", "100"])) {
      return [
        {
          name: "New",
          startArcQuantile: null,
          endArcQuantile: values[0],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 2,
          fill: "#BEBEBE"
        },
        {
          name: "Min",
          startArcQuantile: values[0],
          endArcQuantile: values[0],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Below",
          startArcQuantile: values[0],
          endArcQuantile: values[1],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 4,
          fill: "#0088FE"
        },
        {
          name: "Mean",
          startArcQuantile: values[1],
          endArcQuantile: values[1],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Slightly Above",
          startArcQuantile: values[1],
          endArcQuantile: values[2],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 4,
          fill: "#7FB069"
        },
        {
          name: "75%",
          startArcQuantile: values[2],
          endArcQuantile: values[2],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Above",
          startArcQuantile: values[2],
          endArcQuantile: values[3],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 4,
          fill: "#E63B2E"
        },
        {
          name: "Max",
          startArcQuantile: values[3],
          endArcQuantile: values[3],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "New",
          startArcQuantile: values[3],
          endArcQuantile: null,
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 2,
          fill: "#BEBEBE"
        }
      ];
    }
    if (isEqual(keys, ["0", "25", "50", "100"])) {
      return [
        {
          name: "New",
          startArcQuantile: null,
          endArcQuantile: values[0],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 2,
          fill: "#BEBEBE"
        },
        {
          name: "Min",
          startArcQuantile: values[0],
          endArcQuantile: values[0],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Below",
          startArcQuantile: values[0],
          endArcQuantile: values[1],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 4,
          fill: "#0088FE"
        },
        {
          name: "25%",
          startArcQuantile: values[1],
          endArcQuantile: values[1],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Slightly Below",
          startArcQuantile: values[1],
          endArcQuantile: values[2],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 4,
          fill: "#7FB069"
        },
        {
          name: "Mean",
          startArcQuantile: values[2],
          endArcQuantile: values[2],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Above",
          startArcQuantile: values[2],
          endArcQuantile: values[3],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 4,
          fill: "#E63B2E"
        },
        {
          name: "Max",
          startArcQuantile: values[3],
          endArcQuantile: values[3],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "New",
          startArcQuantile: values[3],
          endArcQuantile: null,
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 2,
          fill: "#BEBEBE"
        }
      ];
    }
    if (isEqual(keys, ["25", "50", "75", "100"])) {
      return [
        {
          name: "New",
          startArcQuantile: null,
          endArcQuantile: values[0],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 2,
          fill: "#BEBEBE"
        },
        {
          name: "25%",
          startArcQuantile: values[0],
          endArcQuantile: values[0],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Slightly Below",
          startArcQuantile: values[0],
          endArcQuantile: values[1],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 4,
          fill: "#7FB069"
        },
        {
          name: "Mean",
          startArcQuantile: values[1],
          endArcQuantile: values[1],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Slightly Above",
          startArcQuantile: values[1],
          endArcQuantile: values[2],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 4,
          fill: "#FFBB28"
        },
        {
          name: "75%",
          startArcQuantile: values[2],
          endArcQuantile: values[2],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Above",
          startArcQuantile: values[2],
          endArcQuantile: values[3],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 4,
          fill: "#E63B2E"
        },
        {
          name: "Max",
          startArcQuantile: values[3],
          endArcQuantile: values[3],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "New",
          startArcQuantile: values[3],
          endArcQuantile: null,
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 2,
          fill: "#BEBEBE"
        }
      ];
    }
  }
  if (isEqual(keys, ["0", "25", "75", "100"])) {
    return [
      {
        name: "New",
        startArcQuantile: null,
        endArcQuantile: values[0],
        daysAboveThisYear,
        idx,
        gaugeTitle,
        value: 2,
        fill: "#BEBEBE"
      },
      {
        name: "Min",
        startArcQuantile: values[0],
        endArcQuantile: values[0],
        daysAboveThisYear,
        idx,
        gaugeTitle,
        value: 0,
        fill: "#BEBEBE"
      },
      {
        name: "Below",
        startArcQuantile: values[0],
        endArcQuantile: values[1],
        daysAboveThisYear,
        idx,
        gaugeTitle,
        value: 4,
        fill: "#0088FE"
      },
      {
        name: "25%",
        startArcQuantile: values[1],
        endArcQuantile: values[1],
        daysAboveThisYear,
        idx,
        gaugeTitle,
        value: 0,
        fill: "#BEBEBE"
      },
      {
        name: "Slightly Below",
        startArcQuantile: values[1],
        endArcQuantile: values[2],
        daysAboveThisYear,
        idx,
        gaugeTitle,
        value: 4,
        fill: "#7FB069"
      },
      {
        name: "Mean",
        startArcQuantile: values[2],
        endArcQuantile: values[2],
        daysAboveThisYear,
        idx,
        gaugeTitle,
        value: 0,
        fill: "#BEBEBE"
      },
      {
        name: "Above",
        startArcQuantile: values[2],
        endArcQuantile: values[3],
        daysAboveThisYear,
        idx,
        gaugeTitle,
        value: 4,
        fill: "#E63B2E"
      },
      {
        name: "Max",
        startArcQuantile: values[3],
        endArcQuantile: values[3],
        daysAboveThisYear,
        idx,
        gaugeTitle,
        value: 0,
        fill: "#BEBEBE"
      },
      {
        name: "New",
        startArcQuantile: values[3],
        endArcQuantile: null,
        daysAboveThisYear,
        idx,
        gaugeTitle,
        value: 4,
        fill: "#BEBEBE"
      }
    ];
  }
  if (values.length === 3) {
    if (isEqual(keys, ["50", "75", "100"])) {
      return [
        {
          name: "New",
          startArcQuantile: null,
          endArcQuantile: values[0],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 2,
          fill: "#BEBEBE"
        },
        {
          name: "Mean",
          startArcQuantile: values[0],
          endArcQuantile: values[0],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Slightly Above",
          startArcQuantile: values[0],
          endArcQuantile: values[1],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 4,
          fill: "#7FB069"
        },
        {
          name: "75%",
          startArcQuantile: values[1],
          endArcQuantile: values[1],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Above",
          startArcQuantile: values[1],
          endArcQuantile: values[2],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 4,
          fill: "#E63B2E"
        },
        {
          name: "Max",
          startArcQuantile: values[2],
          endArcQuantile: values[2],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "New",
          startArcQuantile: values[2],
          endArcQuantile: null,
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 2,
          fill: "#BEBEBE"
        }
      ];
    }

    if (isEqual(keys, ["25", "50", "100"])) {
      return [
        {
          name: "New",
          startArcQuantile: null,
          endArcQuantile: values[0],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 2,
          fill: "#BEBEBE"
        },
        {
          name: "25%",
          startArcQuantile: values[0],
          endArcQuantile: values[0],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Slightly Below",
          startArcQuantile: values[0],
          endArcQuantile: values[1],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 4,
          fill: "#7FB069"
        },
        {
          name: "Mean",
          startArcQuantile: values[1],
          endArcQuantile: values[1],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Above",
          startArcQuantile: values[1],
          endArcQuantile: values[2],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 4,
          fill: "#E63B2E"
        },
        {
          name: "Max",
          startArcQuantile: values[2],
          endArcQuantile: values[2],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "New",
          startArcQuantile: values[2],
          endArcQuantile: null,
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 2,
          fill: "#BEBEBE"
        }
      ];
    }
    if (
      isEqual(keys, ["0", "50", "100"]) ||
      isEqual(keys, ["0", "75", "100"]) ||
      isEqual(keys, ["25", "75", "100"])
    ) {
      return [
        {
          name: "New",
          startArcQuantile: null,
          endArcQuantile: values[0],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 2,
          fill: "#BEBEBE"
        },
        {
          name: "Min",
          startArcQuantile: values[0],
          endArcQuantile: values[0],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Below",
          startArcQuantile: values[0],
          endArcQuantile: values[1],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 4,
          fill: "#0088FE"
        },
        {
          name: "Mean",
          startArcQuantile: values[1],
          endArcQuantile: values[1],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Above",
          startArcQuantile: values[1],
          endArcQuantile: values[2],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 4,
          fill: "#E63B2E"
        },
        {
          name: "Max",
          startArcQuantile: values[2],
          endArcQuantile: values[2],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "New",
          startArcQuantile: values[2],
          endArcQuantile: null,
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 2,
          fill: "#BEBEBE"
        }
      ];
    }
  }
  if (isEqual(keys, ["0", "25", "100"])) {
    return [
      {
        name: "New",
        startArcQuantile: null,
        endArcQuantile: values[0],
        daysAboveThisYear,
        idx,
        gaugeTitle,
        value: 2,
        fill: "#BEBEBE"
      },
      {
        name: "Min",
        startArcQuantile: values[0],
        endArcQuantile: values[0],
        daysAboveThisYear,
        idx,
        gaugeTitle,
        value: 0,
        fill: "#BEBEBE"
      },
      {
        name: "Below",
        startArcQuantile: values[0],
        endArcQuantile: values[1],
        daysAboveThisYear,
        idx,
        gaugeTitle,
        value: 4,
        fill: "#0088FE"
      },
      {
        name: "25%",
        startArcQuantile: values[1],
        endArcQuantile: values[1],
        daysAboveThisYear,
        idx,
        gaugeTitle,
        value: 0,
        fill: "#BEBEBE"
      },
      {
        name: "Slightly Below",
        startArcQuantile: values[1],
        endArcQuantile: values[2],
        daysAboveThisYear,
        idx,
        gaugeTitle,
        value: 4,
        fill: "#7FB069"
      },
      {
        name: "Mean",
        startArcQuantile: values[2],
        endArcQuantile: values[2],
        daysAboveThisYear,
        idx,
        gaugeTitle,
        value: 0,
        fill: "#BEBEBE"
      },
      {
        name: "New",
        startArcQuantile: values[2],
        endArcQuantile: null,
        daysAboveThisYear,
        idx,
        gaugeTitle,
        value: 2,
        fill: "#BEBEBE"
      }
    ];
  }
  // there is no length === 1
  if (values.length === 2) {
    if (isEqual(keys, ["50", "100"])) {
      return [
        {
          name: "New",
          startArcQuantile: null,
          endArcQuantile: values[0],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 2,
          fill: "#BEBEBE"
        },
        {
          name: "Mean",
          startArcQuantile: values[0],
          endArcQuantile: values[0],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Above",
          startArcQuantile: values[0],
          endArcQuantile: values[1],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 4,
          fill: "#E63B2E"
        },
        {
          name: "Max",
          startArcQuantile: values[1],
          endArcQuantile: values[1],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "New",
          startArcQuantile: values[1],
          endArcQuantile: null,
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 2,
          fill: "#BEBEBE"
        }
      ];
    }

    if (isEqual(keys, ["0", "50"])) {
      return [
        {
          name: "New",
          startArcQuantile: null,
          endArcQuantile: values[0],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 2,
          fill: "#BEBEBE"
        },
        {
          name: "Min",
          startArcQuantile: values[0],
          endArcQuantile: values[0],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Below",
          startArcQuantile: values[0],
          endArcQuantile: values[1],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 4,
          fill: "#0088FE"
        },
        {
          name: "Mean",
          startArcQuantile: values[1],
          endArcQuantile: values[1],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "New",
          startArcQuantile: values[1],
          endArcQuantile: null,
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 2,
          fill: "#BEBEBE"
        }
      ];
    }

    if (isEqual(keys, ["75", "100"])) {
      return [
        {
          name: "New",
          startArcQuantile: null,
          endArcQuantile: values[0],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 2,
          fill: "#BEBEBE"
        },
        {
          name: "Mean",
          startArcQuantile: values[0],
          endArcQuantile: values[0],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Above",
          startArcQuantile: values[0],
          endArcQuantile: values[1],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 4,
          fill: "#E63B2E"
        },
        {
          name: "Max",
          startArcQuantile: values[1],
          endArcQuantile: values[1],
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "New",
          startArcQuantile: values[1],
          endArcQuantile: null,
          daysAboveThisYear,
          idx,
          gaugeTitle,
          value: 1,
          fill: "#BEBEBE"
        }
      ];
    }
  }
  if (values.length === 1) {
    return [
      {
        name: "Always Observed",
        startArcQuantile: values[0],
        endArcQuantile: values[0],
        daysAboveThisYear,
        idx,
        gaugeTitle,
        value: 1,
        fill: "#BEBEBE"
      }
    ];
  }
};
