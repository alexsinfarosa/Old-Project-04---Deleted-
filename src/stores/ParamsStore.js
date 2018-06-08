import { decorate, observable } from "mobx";

export default class ParamsStore {
  isLoading = false;
}

decorate(ParamsStore, {
  isLoading: observable
});
