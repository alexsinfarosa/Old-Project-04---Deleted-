import React, { Component } from "react";
import { inject, observer } from "mobx-react";

import { Map, TileLayer, CircleMarker, Tooltip, Popup } from "react-leaflet";

// material-ui
import { withStyles } from "@material-ui/core/styles";
import withRoot from "../withRoot";

import { stations } from "../assets/stationList";

// styles
const styles = theme => ({
  root: {
    height: 500,
    maxWidth: 500
  }
});

class StationsMap extends Component {
  render() {
    const { classes } = this.props;
    const { setStation } = this.props.appStore.paramsStore;

    const stationList = stations.map(stn => (
      <CircleMarker
        key={stn.name}
        center={[stn.lat, stn.lon]}
        radius={stn.sid === "nycthr" ? 10 : 6}
        // color="red"
        onClick={() => setStation(stn)}
      />
    ));

    return (
      <div className={classes.root}>
        <Map
          // bounds={[[49, -87], [43, -69]]}
          bounds={[[39, -75], [43, -71]]}
          style={{ width: "100%", height: "100%" }}
          zoomControl={false}
        >
          <TileLayer url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}{r}.png" />
          {stationList}
        </Map>
      </div>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("appStore")(observer(StationsMap)))
);
