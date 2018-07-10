import { jStat } from "jStat";

const without = (arr, ...args) => arr.filter(v => !args.includes(v));

// export const closest = (n, arr) => {
//   if (arr.length === 1) return 0;
//   return arr
//     .map((q, i) => {
//       if (i === 0 && n < q) return 0;
//       if (i === arr.length - 1 && n >= q) return 0;
//       if (i !== arr.length - 1) {
//         if (n >= q && n < arr[i + 1]) return i + 1;
//       }
//     })
//     .filter(d => d !== undefined)[0];
// };

export const determineQuantiles = data => {
  let d = without(data, NaN);
  d = without(d, "M");

  let original = jStat
    .quantiles(d, [0, 0.25, 0.5, 0.75, 1])
    .map(x => parseFloat(x).toFixed(0));
  // console.log(original);

  let q = {};
  original.forEach((value, i) => {
    let k;
    if (i === 0) k = 0;
    if (i === 1) k = 25;
    if (i === 2) k = 50;
    if (i === 3) k = 75;
    if (i === 4) k = 100;
    q[k] = parseFloat(value);
  });

  // console.log(q);
  return q;
};

export const index = (threshold, quantiles) => {
  const d = threshold; // ex: 13
  const q = Object.values(quantiles); // ex: [3,11,23,66]

  // console.log(`d: ${d}, q = [min, .25, .5, .75, 1]: [${q}]`);
  if (d < q[0]) return 0;
  if (d >= q[0] && d < q[1]) return 2;
  if (d >= q[1] && d < q[2]) return 4;
  if (d >= q[2] && d < q[3]) return 6;
  if (d >= q[3] && d < q[4]) return 8;
  if (d >= q[4]) return 10;
};

export const arcColoring = name => {
  if (name === "") return "#BEBEBE";
  if (name === "New") return "#BEBEBE";
  if (name === "Below") return "#0088FE";
  if (name === "Slightly Below") return "#7FB069";
  if (name === "Normal") return "#C5B358";
  if (name === "Slightly Above") return "#FFBB28";
  if (name === "Above") return "#E63B2E";
};

export const arcData = (q, type) => {
  const v = Object.values(q);

  // 3-category ---------------------------------------
  if (q["25"] !== q["50"] && q["50"] !== q["75"]) {
    // case 75 === 100
    if (
      q["75"] === q["100"] ||
      (q["0"] !== q["25"] &&
        q["25"] !== q["50"] &&
        q["50"] !== q["75"] &&
        q["75"] !== q["100"])
    ) {
      return [
        {
          name: "New",
          startArcQuantile: null,
          endArcQuantile: v[0],
          value: 2,
          fill: "#BEBEBE"
        },
        {
          name: "Min",
          startArcQuantile: v[0],
          endArcQuantile: v[0],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Below",
          startArcQuantile: v[0],
          endArcQuantile: v[1],
          value: 4,
          fill: "#0088FE"
        },
        {
          name: "25%",
          startArcQuantile: v[1],
          endArcQuantile: v[1],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Slightly Below",
          startArcQuantile: v[1],
          endArcQuantile: v[2],
          value: 4,
          fill: "#7FB069"
        },
        {
          name: "Mean",
          startArcQuantile: v[2],
          endArcQuantile: v[2],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Slightly Above",
          startArcQuantile: v[2],
          endArcQuantile: v[3],
          value: 4,
          fill: "#FFBB28"
        },
        {
          name: "75%",
          startArcQuantile: v[3],
          endArcQuantile: v[3],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Above",
          startArcQuantile: v[3],
          endArcQuantile: v[4],
          value: 4,
          fill: "#E63B2E"
        },
        {
          name: "Max",
          startArcQuantile: v[4],
          endArcQuantile: v[4],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "New",
          startArcQuantile: v[4],
          endArcQuantile: null,
          value: 2,
          fill: "#BEBEBE"
        }
      ];
    }

    if (q["0"] === q["25"] && q["25"] > 0) {
      return [
        {
          name: "New",
          startArcQuantile: null,
          endArcQuantile: v[0],
          value: 2,
          fill: "#BEBEBE"
        },
        {
          name: "Min",
          startArcQuantile: v[0],
          endArcQuantile: v[0],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "",
          startArcQuantile: v[0],
          endArcQuantile: v[1],
          value: 4,
          fill: "#BEBEBE"
        },
        {
          name: "25%",
          startArcQuantile: v[1],
          endArcQuantile: v[1],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Slightly Below",
          startArcQuantile: v[1],
          endArcQuantile: v[2],
          value: 4,
          fill: "#7FB069"
        },
        {
          name: "Mean",
          startArcQuantile: v[2],
          endArcQuantile: v[2],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Slightly Above",
          startArcQuantile: v[2],
          endArcQuantile: v[3],
          value: 4,
          fill: "#FFBB28"
        },
        {
          name: "75%",
          startArcQuantile: v[3],
          endArcQuantile: v[3],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Above",
          startArcQuantile: v[3],
          endArcQuantile: v[4],
          value: 4,
          fill: "#E63B2E"
        },
        {
          name: "Max",
          startArcQuantile: v[4],
          endArcQuantile: v[4],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "New",
          startArcQuantile: v[4],
          endArcQuantile: null,
          value: 2,
          fill: "#BEBEBE"
        }
      ];
    }

    if (q["0"] === q["25"] && q["25"] === 0 && type !== "temperature") {
      return [
        {
          name: "",
          startArcQuantile: null,
          endArcQuantile: v[0],
          value: 2,
          fill: "#BEBEBE"
        },
        {
          name: "Min",
          startArcQuantile: v[0],
          endArcQuantile: v[0],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "",
          startArcQuantile: v[0],
          endArcQuantile: v[1],
          value: 4,
          fill: "#BEBEBE"
        },
        {
          name: "25%",
          startArcQuantile: v[1],
          endArcQuantile: v[1],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Slightly Below",
          startArcQuantile: v[1],
          endArcQuantile: v[2],
          value: 4,
          fill: "#7FB069"
        },
        {
          name: "Mean",
          startArcQuantile: v[2],
          endArcQuantile: v[2],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Slightly Above",
          startArcQuantile: v[2],
          endArcQuantile: v[3],
          value: 4,
          fill: "#FFBB28"
        },
        {
          name: "75%",
          startArcQuantile: v[3],
          endArcQuantile: v[3],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Above",
          startArcQuantile: v[3],
          endArcQuantile: v[4],
          value: 4,
          fill: "#E63B2E"
        },
        {
          name: "Max",
          startArcQuantile: v[4],
          endArcQuantile: v[4],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "New",
          startArcQuantile: v[4],
          endArcQuantile: null,
          value: 2,
          fill: "#BEBEBE"
        }
      ];
    }

    if (q["0"] === 0 && type !== "temperature") {
      return [
        {
          name: "",
          startArcQuantile: null,
          endArcQuantile: v[0],
          value: 2,
          fill: "#BEBEBE"
        },
        {
          name: "Min",
          startArcQuantile: v[0],
          endArcQuantile: v[0],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Below",
          startArcQuantile: v[0],
          endArcQuantile: v[1],
          value: 4,
          fill: "#0088FE"
        },
        {
          name: "25%",
          startArcQuantile: v[1],
          endArcQuantile: v[1],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Slightly Below",
          startArcQuantile: v[1],
          endArcQuantile: v[2],
          value: 4,
          fill: "#7FB069"
        },
        {
          name: "Mean",
          startArcQuantile: v[2],
          endArcQuantile: v[2],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Slightly Above",
          startArcQuantile: v[2],
          endArcQuantile: v[3],
          value: 4,
          fill: "#FFBB28"
        },
        {
          name: "75%",
          startArcQuantile: v[3],
          endArcQuantile: v[3],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Above",
          startArcQuantile: v[3],
          endArcQuantile: v[4],
          value: 4,
          fill: "#E63B2E"
        },
        {
          name: "Max",
          startArcQuantile: v[4],
          endArcQuantile: v[4],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "New",
          startArcQuantile: v[4],
          endArcQuantile: null,
          value: 2,
          fill: "#BEBEBE"
        }
      ];
    }
  }

  // 4-category ---------------------------------------
  if (q["25"] === q["50"] || q["50"] === q["75"]) {
    // case 2b (min and 25% are equal but not zero)
    if (q["0"] === q["25"] && q["25"] > 0) {
      return [
        {
          name: "New",
          startArcQuantile: null,
          endArcQuantile: v[0],
          value: 2,
          fill: "#BEBEBE"
        },
        {
          name: "Min",
          startArcQuantile: v[0],
          endArcQuantile: v[0],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "",
          startArcQuantile: v[0],
          endArcQuantile: v[1],
          value: 4,
          fill: "#BEBEBE"
        },
        {
          name: "25%",
          startArcQuantile: v[1],
          endArcQuantile: v[1],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Normal",
          startArcQuantile: v[1],
          endArcQuantile: v[3],
          value: 8,
          fill: "gold"
        },
        {
          name: "75%",
          startArcQuantile: v[3],
          endArcQuantile: v[3],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Above",
          startArcQuantile: v[3],
          endArcQuantile: v[4],
          value: 4,
          fill: "#E63B2E"
        },
        {
          name: "Max",
          startArcQuantile: v[4],
          endArcQuantile: v[4],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "New",
          startArcQuantile: v[4],
          endArcQuantile: null,
          value: 2,
          fill: "#BEBEBE"
        }
      ];
    }

    // 2c: (min and 25th are equal and their value is zero)
    if (q["0"] === q["25"] && q["25"] === 0 && type !== "temperature") {
      return [
        {
          name: "",
          startArcQuantile: null,
          endArcQuantile: v[0],
          value: 2,
          fill: "#BEBEBE"
        },
        {
          name: "Min",
          startArcQuantile: v[0],
          endArcQuantile: v[0],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "",
          startArcQuantile: v[0],
          endArcQuantile: v[1],
          value: 4,
          fill: "#BEBEBE"
        },
        {
          name: "25%",
          startArcQuantile: v[1],
          endArcQuantile: v[1],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Normal",
          startArcQuantile: v[1],
          endArcQuantile: v[3],
          value: 8,
          fill: "gold"
        },
        {
          name: "75%",
          startArcQuantile: v[3],
          endArcQuantile: v[3],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Above",
          startArcQuantile: v[3],
          endArcQuantile: v[4],
          value: 4,
          fill: "#E63B2E"
        },
        {
          name: "Max",
          startArcQuantile: v[4],
          endArcQuantile: v[4],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "New",
          startArcQuantile: v[4],
          endArcQuantile: null,
          value: 2,
          fill: "#BEBEBE"
        }
      ];
    }

    // 2d (only min is zero)
    if (
      q["0"] === 0 &&
      (q["25"] > 0 && q["50"] > 0 && q["75"] > 0 && q["100"] > 0) &&
      type !== "temperature"
    ) {
      return [
        {
          name: "",
          startArcQuantile: null,
          endArcQuantile: v[0],
          value: 2,
          fill: "#BEBEBE"
        },
        {
          name: "Min",
          startArcQuantile: v[0],
          endArcQuantile: v[0],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Below",
          startArcQuantile: v[0],
          endArcQuantile: v[1],
          value: 4,
          fill: "#0088FE"
        },
        {
          name: "25%",
          startArcQuantile: v[1],
          endArcQuantile: v[1],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Normal",
          startArcQuantile: v[1],
          endArcQuantile: v[3],
          value: 8,
          fill: "gold"
        },
        {
          name: "75%",
          startArcQuantile: v[3],
          endArcQuantile: v[3],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Above",
          startArcQuantile: v[3],
          endArcQuantile: v[4],
          value: 4,
          fill: "#E63B2E"
        },
        {
          name: "Max",
          startArcQuantile: v[4],
          endArcQuantile: v[4],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "New",
          startArcQuantile: v[4],
          endArcQuantile: null,
          value: 2,
          fill: "#BEBEBE"
        }
      ];
    }

    // 2e: (75th and 100Th are equal and their value is not zero)
    if (q["75"] === q["100"] && q["100"] > 0) {
      return [
        {
          name: "New",
          startArcQuantile: null,
          endArcQuantile: v[0],
          value: 2,
          fill: "#BEBEBE"
        },
        {
          name: "Min",
          startArcQuantile: v[0],
          endArcQuantile: v[0],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Below",
          startArcQuantile: v[0],
          endArcQuantile: v[1],
          value: 4,
          fill: "#0088FE"
        },
        {
          name: "25%",
          startArcQuantile: v[1],
          endArcQuantile: v[1],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Normal",
          startArcQuantile: v[1],
          endArcQuantile: v[3],
          value: 8,
          fill: "gold"
        },
        {
          name: "75%",
          startArcQuantile: v[3],
          endArcQuantile: v[3],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "",
          startArcQuantile: v[3],
          endArcQuantile: v[4],
          value: 4,
          fill: "#BEBEBE"
        },
        {
          name: "Max",
          startArcQuantile: v[4],
          endArcQuantile: v[4],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "New",
          startArcQuantile: v[4],
          endArcQuantile: null,
          value: 2,
          fill: "#BEBEBE"
        }
      ];
    }

    // 2e: (75th and 100Th are equal and their value is not zero and value is not temp)
    if (q["75"] === q["100"] && q["100"] > 0 && type !== "temperature") {
      return [
        {
          name: "New",
          startArcQuantile: null,
          endArcQuantile: v[0],
          value: 2,
          fill: "#BEBEBE"
        },
        {
          name: "Min",
          startArcQuantile: v[0],
          endArcQuantile: v[0],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Below",
          startArcQuantile: v[0],
          endArcQuantile: v[1],
          value: 4,
          fill: "#0088FE"
        },
        {
          name: "25%",
          startArcQuantile: v[1],
          endArcQuantile: v[1],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Normal",
          startArcQuantile: v[1],
          endArcQuantile: v[3],
          value: 8,
          fill: "gold"
        },
        {
          name: "75%",
          startArcQuantile: v[3],
          endArcQuantile: v[3],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "",
          startArcQuantile: v[3],
          endArcQuantile: v[4],
          value: 4,
          fill: "#BEBEBE"
        },
        {
          name: "Max",
          startArcQuantile: v[4],
          endArcQuantile: v[4],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "New",
          startArcQuantile: v[4],
          endArcQuantile: null,
          value: 2,
          fill: "#BEBEBE"
        }
      ];
    }

    // 2e: (75th and 100Th are equal and their value is zero and value is not temp)
    if (q["75"] === q["100"] && q["100"] === 0 && type !== "temperature") {
      return [
        {
          name: "New",
          startArcQuantile: null,
          endArcQuantile: v[0],
          value: 2,
          fill: "#BEBEBE"
        },
        {
          name: "Min",
          startArcQuantile: v[0],
          endArcQuantile: v[0],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Below",
          startArcQuantile: v[0],
          endArcQuantile: v[1],
          value: 4,
          fill: "#0088FE"
        },
        {
          name: "25%",
          startArcQuantile: v[1],
          endArcQuantile: v[1],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "Normal",
          startArcQuantile: v[1],
          endArcQuantile: v[3],
          value: 8,
          fill: "gold"
        },
        {
          name: "75%",
          startArcQuantile: v[3],
          endArcQuantile: v[3],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "",
          startArcQuantile: v[3],
          endArcQuantile: v[4],
          value: 4,
          fill: "#BEBEBE"
        },
        {
          name: "Max",
          startArcQuantile: v[4],
          endArcQuantile: v[4],
          value: 0,
          fill: "#BEBEBE"
        },
        {
          name: "New",
          startArcQuantile: v[4],
          endArcQuantile: null,
          value: 2,
          fill: "#BEBEBE"
        }
      ];
    }
  }
};
