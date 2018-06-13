export const api = [
  {
    label: "Temperature",
    steps: 5,
    min: 80,
    max: 100,
    defaultValue: 85,
    marks: {
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
          whiteSpace: "nowrap",
          color: "red"
        },
        label: "100 °C"
      }
    }
  },
  {
    label: "Precipitation",
    steps: 1,
    min: 1,
    max: 4,
    defaultValue: 1,
    marks: {
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
  },
  {
    label: "Seasonal Extreme",
    steps: 5,
    min: 80,
    max: 100,
    defaultValue: 85,
    marks: {
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
          whiteSpace: "nowrap",
          color: "red"
        },
        label: "100 °C"
      }
    }
  }
];
