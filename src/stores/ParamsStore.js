import { decorate, observable, action, computed, when, reaction } from "mobx";
import axios from "axios";
import { jStat } from "jStat";
import { stations } from "../assets/stationList";

import { determineQuantiles, index, arcData } from "../utils/utils";
import { format, getMonth } from "date-fns/esm";

export default class ParamsStore {
  constructor() {
    when(() => !this.data, () => this.loadObservedData(this.params));
    reaction(() => this.params, () => this.loadObservedData(this.params));
    when(() => this.data, () => console.log(this.asJson));
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

  setSeasonalExtreme = (label, value) => {
    if (label === "Days >" || label === "Days <") this.maxt = value;
    if (label === "Nights >" || label === "Nights <") this.mint = value;
    if (label === "Rainfall >") this.pcpn = value;
    if (label === "Snowfall >") this.snow = value;
  };

  rows = ["Temperature", "Precipitation", "Seasonal Extreme"];

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

  get params() {
    return {
      sid: this.station.sid,
      sdate: `POR-${format(new Date(), "MM-dd")}`,
      edate: format(new Date(), "YYYY-MM-dd"),
      elems: [
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
        },
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
        },
        {
          name: "maxt",
          interval: [1, 0, 0],
          duration: "std",
          season_start: "01-01",
          reduce: `cnt_ge_${this.maxt}`
        },
        {
          name: "mint",
          interval: [1, 0, 0],
          duration: "std",
          season_start: "01-01",
          reduce: `cnt_ge_${this.mint}`
        },
        {
          name: "pcpn",
          interval: [1, 0, 0],
          duration: "std",
          season_start: "01-01",
          reduce: `cnt_ge_${this.pcpn}`
        },
        {
          name: "snow",
          interval: [1, 0, 0],
          duration: "std",
          season_start: "01-01",
          reduce: `cnt_ge_${this.snow}`
        }
      ]
    };
  }

  data;
  setData = d => (this.data = d);

  loadObservedData = params => {
    // console.log(params);
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

  get asJson() {
    return {
      avgTemps: this.avgTemps,
      avgPcpns: this.avgPcpns,
      seasonalExtreme: this.seasonalExtreme
    };
  }

  gaugeType = ["month", "season", "year"];

  get avgTemps() {
    let results = [];
    if (this.data) {
      this.gaugeType.forEach((type, i) => {
        let p = {};
        const daysAboveThisYearALL = this.data.slice(-1)[0];
        const daysAboveThisYear = daysAboveThisYearALL.get(`${i + 1}`);
        const values = this.data.map(arr => Number(arr[i + 1]));
        const mean = jStat.quantiles(values, [0.5]).map(x => Math.round(x))[0];
        const dates = this.data.map(obj => obj[0]);
        const quantiles = determineQuantiles(values);
        const graphData = values.map((v, i) => {
          let p = {};
          p["date"] = dates[i];
          p["value"] = v;
          p["mean"] = mean;
          p["bar"] = Math.round(mean - v);
          p["quantiles"] = Object.values(quantiles);
          return p;
        });
        const idx = index(daysAboveThisYear, Object.values(quantiles));

        let gaugeTitle = "";
        if (type === "month") gaugeTitle = format(new Date(), "MMMM");
        if (type === "season") gaugeTitle = this.season.label;
        if (type === "year") gaugeTitle = "This Year";

        const gaugeData = arcData(
          quantiles,
          daysAboveThisYear,
          idx,
          gaugeTitle
        );

        p = {
          graphData,
          daysAboveThisYear,
          type,
          gaugeTitle,
          values,
          quantiles,
          idx,
          gaugeData,
          label: "Temperature"
        };
        results.push(p);
      });
      return results;
    }
  }

  get avgPcpns() {
    let results = [];
    if (this.data) {
      this.gaugeType.forEach((type, i) => {
        let p = {};
        const daysAboveThisYearALL = this.data.slice(-1)[0];
        const daysAboveThisYear = daysAboveThisYearALL.get(`${i + 4}`);
        const values = this.data.map(arr => Number(arr[i + 4]));
        const mean = jStat.quantiles(values, [0.5]).map(x => Math.round(x))[0];
        const dates = this.data.map(obj => obj[0]);
        const quantiles = determineQuantiles(values);
        const graphData = values.map((v, i) => {
          let p = {};
          p["date"] = dates[i];
          p["value"] = v;
          p["mean"] = mean;
          p["bar"] = Math.round(mean - v);
          p["quantiles"] = Object.values(quantiles);
          return p;
        });
        const idx = index(daysAboveThisYear, Object.values(quantiles));
        let gaugeTitle = "";
        if (type === "month") gaugeTitle = format(new Date(), "MMMM");
        if (type === "season") gaugeTitle = this.season.label;
        if (type === "year") gaugeTitle = "This Year";
        const gaugeData = arcData(
          quantiles,
          daysAboveThisYear,
          idx,
          gaugeTitle
        );

        p = {
          graphData,
          daysAboveThisYear,
          type,
          gaugeTitle,
          values,
          quantiles,
          idx,
          gaugeData,
          label: "Precipitation"
        };
        results.push(p);
      });
      return results;
    }
  }

  get seasonalType() {
    const month = getMonth(new Date()) + 1;
    const season = month >= 4 && month <= 10 ? "Hot" : "Cold";
    return season === "Hot"
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

  get seasonalExtreme() {
    let results = [];
    if (this.data) {
      this.seasonalType.forEach((type, i) => {
        let p = {};
        const daysAboveThisYearALL = this.data.slice(-1)[0];
        const daysAboveThisYear = daysAboveThisYearALL.get(`${i + 7}`);
        const values = this.data.map(arr => Number(arr[i + 7]));
        const dates = this.data.map(obj => obj[0]);
        const graphData = values.map((v, i) => {
          let p = {};
          p["date"] = dates[i];
          p["value"] = v;
          return p;
        });
        const quantiles = determineQuantiles(values);
        const idx = index(daysAboveThisYear, Object.values(quantiles));
        const gaugeTitle = type.label;
        const elem = type.elem;

        const gaugeData = arcData(
          quantiles,
          daysAboveThisYear,
          idx,
          gaugeTitle
        );

        p = {
          graphData,
          elem,
          daysAboveThisYear,
          type,
          gaugeTitle,
          values,
          quantiles,
          idx,
          gaugeData,
          label: "Seasonal Extreme"
        };
        results.push(p);
      });
      return results;
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
  seasonalType: computed,
  seasonalExtreme: computed,
  params: computed,
  data: observable,
  setData: action,
  asJson: computed,
  avgTemps: computed,
  avgPcpns: computed,
  snow: observable,
  setSnow: action,
  setSeasonalExtreme: action
});
