import { decorate, observable, action, computed, when, reaction } from "mobx";
import axios from "axios";
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

  station = stations[0];
  setStation = d => (this.station = d);

  maxt = 80;
  setMaxt = d => (this.maxt = d);

  mint = 60;
  setMint = d => (this.mint = d);

  pcpn = 1;
  setPcpn = d => (this.pcpn = d);

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
        }
      ]
    };
  }

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
        const quantiles = determineQuantiles(values);
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
        const quantiles = determineQuantiles(values);
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
            range: [80, 90, 100]
          },
          {
            label: "Nights >",
            range: [65, 70, 75]
          },
          {
            label: "Rainfall >",
            range: [1, 2, 3]
          }
        ]
      : [
          {
            label: "Days >",
            range: [32, 40, 45]
          },
          {
            label: "Nights <",
            range: [10, 15, 20]
          },
          {
            label: "Rainfall >",
            range: [2, 4, 6]
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
        const quantiles = determineQuantiles(values);
        const idx = index(daysAboveThisYear, Object.values(quantiles));
        const gaugeTitle = type.label;

        const gaugeData = arcData(
          quantiles,
          daysAboveThisYear,
          idx,
          gaugeTitle
        );

        p = {
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
  avgPcpns: computed
});
