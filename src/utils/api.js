export const api = [
  {
    label: "Temperature",
    elems: [
      {
        name: "maxt",
        interval: [1, 0, 0],
        duration: "std",
        season_start: "01-01",
        reduce: `cnt_ge_`
      }
    ],
    steps: 5,
    min: 80,
    max: 100,
    defaultValue: 85,
    style: {
      80: {
        style: {
          whiteSpace: "nowrap"
        },
        label: "80 °C"
      },
      85: {
        style: {
          whiteSpace: "nowrap"
        },
        label: "85 °C"
      },
      90: {
        style: {
          whiteSpace: "nowrap"
        },
        label: "90 °C"
      },
      95: {
        style: {
          whiteSpace: "nowrap"
        },
        label: "95 °C"
      },
      100: {
        style: {
          whiteSpace: "nowrap"
        },
        label: "100 °C"
      }
    }
  },
  {
    label: "Precipitation",
    elems: [
      {
        name: "pcpn",
        interval: [1, 0, 0],
        duration: "std",
        season_start: "01-01",
        reduce: `cnt_ge_`
      }
    ],
    steps: 1,
    min: 1,
    max: 4,
    defaultValue: 1,
    style: {
      1: {
        style: {
          whiteSpace: "nowrap"
        },
        label: "1 in"
      },
      2: {
        style: {
          whiteSpace: "nowrap"
        },
        label: "2 in"
      },
      3: {
        style: {
          whiteSpace: "nowrap"
        },
        label: "3 in"
      },
      4: {
        style: {
          whiteSpace: "nowrap"
        },
        label: "4 in"
      }
    }
  }
];
