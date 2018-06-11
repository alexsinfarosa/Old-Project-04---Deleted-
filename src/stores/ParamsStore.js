import { decorate, observable, action } from "mobx";

export default class ParamsStore {
  isLoading = false;
  station;
  setStation = d => (this.station = d);
}

decorate(ParamsStore, {
  isLoading: observable,
  station: observable,
  setStation: action
});
