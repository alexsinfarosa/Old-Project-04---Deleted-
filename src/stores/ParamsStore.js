import { decorate, observable, action, computed, when, reaction } from "mobx";
import axios from "axios";
import { jStat } from "jStat";
import { stations } from "../assets/stationList";

import { determineQuantiles, index, arcData, closest } from "../utils/utils";
import { format, getMonth } from "date-fns/esm";

export default class ParamsStore {
  constructor() {
    when(() => !this.data, () => this.loadObservedData(this.params));
    reaction(() => this.station.sid, () => this.loadObservedData(this.params));
    reaction(() => this.data, () => console.log(this.gauge, this.avgTemp));
  }

  isLoading = false;
  setIsLoading = d => this.isLoading;

  station = stations[2];
  setStation = d => (this.station = d);

  maxt = this.seasonalType[0].range[0];
  setMaxt = d => (this.maxt = d);

  mint = this.seasonalType[1].range[0];
  setMint = d => (this.mint = d);

  pcpn = this.seasonalType[2].range[0];
  setPcpn = d => (this.pcpn = d);

  snow = this.seasonalType[2].range[0];
  setSnow = d => (this.snow = d);

  // datermines the seasonal extreeme call
  get isSummerOrWinter() {
    const month = getMonth(new Date()) + 1;
    return month >= 4 && month <= 10 ? "summer" : "winter";
  }

  // returns the start of the season
  get season() {
    const month = getMonth(new Date()) + 1;
    if (month >= 3 && month <= 5)
      return { label: "Spring", season_start: "03-01" };
    if (month >= 6 && month <= 8)
      return { label: "Summer", season_start: "06-01" };
    if (month >= 9 && month <= 11)
      return { label: "Fall", season_start: "09-01" };
    if (month === 12 || month === 1 || month === 2)
      return { label: "Winter", season_start: "12-01" };
  }

  // average temperature parameters
  tempParams = [
    {
      name: "avgt",
      interval: [1, 0, 0],
      duration: "mtd",
      reduce: "mean"
    },
    {
      name: "avgt",
      interval: [1, 0, 0],
      duration: "std",
      season_start: `${this.season.season_start}`,
      reduce: "mean"
    },
    {
      name: "avgt",
      interval: [1, 0, 0],
      duration: "ytd",
      reduce: "mean"
    }
  ];

  // average precipitation parameters
  pcpnParams = [
    {
      name: "pcpn",
      interval: [1, 0, 0],
      duration: "mtd",
      reduce: "sum"
    },
    {
      name: "pcpn",
      interval: [1, 0, 0],
      duration: "std",
      season_start: `${this.season.season_start}`,
      reduce: "sum"
    },
    {
      name: "pcpn",
      interval: [1, 0, 0],
      duration: "ytd",
      reduce: "sum"
    }
  ];

  // if it is summer (month 4 to 10) we make the call with the following params
  summerParams = [
    {
      name: "maxt",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "01-01",
      reduce: `cnt_ge_80`
    },
    {
      name: "maxt",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "01-01",
      reduce: `cnt_ge_90`
    },
    {
      name: "maxt",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "01-01",
      reduce: `cnt_ge_100`
    },
    {
      name: "mint",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "01-01",
      reduce: `cnt_ge_65`
    },
    {
      name: "mint",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "01-01",
      reduce: `cnt_ge_70`
    },
    {
      name: "mint",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "01-01",
      reduce: `cnt_ge_75`
    },
    {
      name: "pcpn",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "01-01",
      reduce: `cnt_ge_1`
    },
    {
      name: "pcpn",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "01-01",
      reduce: `cnt_ge_2`
    },
    {
      name: "pcpn",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "01-01",
      reduce: `cnt_ge_3`
    }
  ];

  // if it is winter (month 1,2,3,11,12) we make the call with the following params
  winterParams = [
    {
      name: "maxt",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "07-01",
      reduce: `cnt_le_32`
    },
    {
      name: "maxt",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "07-01",
      reduce: `cnt_le_20`
    },
    {
      name: "maxt",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "07-01",
      reduce: `cnt_le_15`
    },
    {
      name: "mint",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "07-01",
      reduce: `cnt_le_20`
    },
    {
      name: "mint",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "07-01",
      reduce: `cnt_le_15`
    },
    {
      name: "mint",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "07-01",
      reduce: `cnt_le_10`
    },
    {
      name: "snow",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "07-01",
      reduce: `cnt_ge_2`
    },
    {
      name: "snow",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "07-01",
      reduce: `cnt_ge_4`
    },
    {
      name: "snow",
      interval: [1, 0, 0],
      duration: "std",
      season_start: "07-01",
      reduce: `cnt_ge_6`
    }
  ];

  // the call
  get params() {
    let elems = [...this.tempParams, ...this.pcpnParams];
    this.isSummerOrWinter === "summer"
      ? (elems = [...elems, ...this.summerParams])
      : (elems = [...elems, ...this.winterParams]);

    return {
      sid: this.station.sid,
      sdate: `POR-${format(new Date(), "MM-dd")}`,
      edate: format(new Date(), "YYYY-MM-dd"),
      elems
    };
  }

  // main data array
  data;
  setData = d => (this.data = d);

  loadObservedData = params => {
    this.setData(undefined);
    this.setIsLoading(true);
    return axios
      .post(`${window.location.protocol}//data.rcc-acis.org/StnData`, params)
      .then(res => {
        // console.log(res.data.data);
        this.setData(res.data.data);
        this.setIsLoading(false);
      })
      .catch(err => {
        console.log("Failed to load observed data ", err);
      });
  };

  get seasonalType() {
    let season = this.isSummerOrWinter;
    return season === "summer"
      ? [
          {
            label: "Days >",
            range: [80, 90, 100],
            elem: this.maxt,
            steps: 10,
            min: 80,
            max: 100,
            defaultValue: 90,
            marks: {
              80: {
                style: {
                  whiteSpace: "nowrap"
                },
                label: "80 °C"
              },
              90: {
                style: {
                  whiteSpace: "nowrap"
                },
                label: "90 °C"
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
            label: "Nights >",
            range: [65, 70, 75],
            elem: this.mint,
            steps: 5,
            min: 65,
            max: 75,
            defaultValue: 65,
            marks: {
              65: {
                style: {
                  whiteSpace: "nowrap"
                },
                label: "65 °C"
              },
              70: {
                style: {
                  whiteSpace: "nowrap"
                },
                label: "70 °C"
              },
              75: {
                style: {
                  whiteSpace: "nowrap"
                },
                label: "75 °C"
              }
            }
          },
          {
            label: "Rainfall >",
            range: [1, 2, 3],
            elem: this.pcpn,
            steps: 1,
            min: 1,
            max: 3,
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
              }
            }
          }
        ]
      : [
          {
            label: "Days <",
            range: [32, 20, 15],
            elem: this.maxt,
            steps: 5,
            min: 15,
            max: 32,
            defaultValue: 32,
            marks: {
              32: {
                style: {
                  whiteSpace: "nowrap"
                },
                label: "32 °C"
              },
              20: {
                style: {
                  whiteSpace: "nowrap"
                },
                label: "20 °C"
              },
              15: {
                style: {
                  whiteSpace: "nowrap"
                },
                label: "15 °C"
              }
            }
          },
          {
            label: "Nights <",
            range: [20, 15, 10],
            elem: this.mint,
            steps: 5,
            min: 10,
            max: 20,
            defaultValue: 20,
            marks: {
              20: {
                style: {
                  whiteSpace: "nowrap"
                },
                label: "20 °C"
              },
              15: {
                style: {
                  whiteSpace: "nowrap"
                },
                label: "15 °C"
              },
              10: {
                style: {
                  whiteSpace: "nowrap"
                },
                label: "10 °C"
              }
            }
          },
          {
            label: "Snowfall >",
            range: [2, 4, 6],
            elem: this.snow,
            steps: 2,
            min: 2,
            max: 6,
            defaultValue: 2,
            marks: {
              2: {
                style: {
                  whiteSpace: "nowrap"
                },
                label: "2 in"
              },
              4: {
                style: {
                  whiteSpace: "nowrap"
                },
                label: "4 in"
              },
              6: {
                style: {
                  whiteSpace: "nowrap"
                },
                label: "6 in"
              }
            }
          }
        ];
  }

  get keys() {
    let extremeKeys;

    this.isSummerOrWinter === "summer"
      ? (extremeKeys = {
          maxt80: { label: "Days > 80", type: "temperature", isSlider: true },
          maxt90: { label: "Days > 90", type: "temperature", isSlider: true },
          maxt100: { label: "Days > 100", type: "temperature", isSlider: true },
          mint65: { label: "Nights > 65", type: "temperature", isSlider: true },
          mint70: { label: "Nights > 70", type: "temperature", isSlider: true },
          mint75: { label: "Nights > 75", type: "temperature", isSlider: true },
          rain1: { label: "Rainfall > 1", type: "rainfall", isSlider: true },
          rain2: { label: "Rainfall > 2", type: "rainfall", isSlider: true },
          rain3: { label: "Rainfall > 3", type: "rainfall", isSlider: true }
        })
      : (extremeKeys = {
          maxt32: { label: "Days < 32", type: "temperature", isSlider: true },
          maxt20: { label: "Days < 20", type: "temperature", isSlider: true },
          maxt15: { label: "Days < 15", type: "temperature", isSlider: true },
          mint20: { label: "Nights < 20", type: "temperature", isSlider: true },
          mint15: { label: "Nights < 15", type: "temperature", isSlider: true },
          mint10: { label: "Nights < 10", type: "temperature", isSlider: true },
          snow2: { label: "Snowfall > 2", type: "snowfall", isSlider: true },
          snow4: { label: "Snowfall > 4", type: "snowfall", isSlider: true },
          snow6: { label: "Snowfall > 6", type: "snowfall", isSlider: true }
        });

    return {
      tempMonth: {
        label: format(new Date(), "MMMM"),
        type: "temperature",
        isSlider: false
      },
      tempSeason: {
        label: this.season.label,
        type: "temperature",
        isSlider: false
      },
      tempYear: { label: "This Year", type: "temperature", isSlider: false },
      pcpnMonth: {
        label: format(new Date(), "MMMM"),
        type: "precipitation",
        isSlider: false
      },
      pcpnSeason: {
        label: this.season.label,
        type: "precipitation",
        isSlider: false
      },
      pcpnYear: { label: "This Year", type: "precipitation", isSlider: false },
      ...extremeKeys
    };
  }

  get gauge() {
    let results = [];
    if (this.data) {
      Object.keys(this.keys).forEach((elem, i) => {
        let p = {};
        const label = this.keys[elem].label;
        const type = this.keys[elem].type;
        const isSlider = this.keys[elem].isSlider;
        const values = this.data.map(d => parseFloat(d[i + 1]).toFixed(1));
        const daysAboveThisYear = parseFloat(values.slice(-1)[0]).toFixed(1);
        const quantiles = determineQuantiles(values);
        const mean = parseFloat(jStat.quantiles(values, [0.5])[0].toFixed(1));
        const dates = this.data.map(d => d[0]);
        const active = index(daysAboveThisYear, quantiles);
        const arc = arcData(quantiles, daysAboveThisYear, type);

        p = {
          label,
          type,
          elem,
          daysAboveThisYear,
          values,
          quantiles,
          mean,
          dates,
          active,
          arc,
          isSlider
        };
        results.push(p);
      });
      return results;
    }
  }

  get avgTemps() {
    if (this.gauge) {
      return this.gauge.filter(
        o =>
          o.elem === "tempMonth" ||
          o.elem === "tempSeason" ||
          o.elem === "tempYear"
      );
    }
  }

  get avgPcpns() {
    if (this.gauge) {
      return this.gauge.filter(
        o =>
          o.elem === "pcpnMonth" ||
          o.elem === "pcpnSeason" ||
          o.elem === "pcpnYear"
      );
    }
  }
}

decorate(ParamsStore, {
  isLoading: observable,
  setIsLoading: action,
  station: observable,
  setStation: action,
  maxt: observable,
  setMaxt: action,
  mint: observable,
  setMint: action,
  pcpn: observable,
  setPcpn: action,
  snow: observable,
  setSnow: action,
  isSummerOrWinter: computed,
  season: computed,
  params: computed,
  data: observable,
  setData: action,
  gauge: computed,
  seasonalType: computed,
  keys: computed,
  avgTemps: computed,
  avgPcpns: computed
});
