import React, { Component } from "react";
import { inject, observer } from "mobx-react";

import { Map, TileLayer, Marker, Tooltip, Popup } from "react-leaflet";

// material-ui
import { withStyles } from "@material-ui/core/styles";
import withRoot from "../withRoot";

import { stations } from "../assets/stationList";

// styles
const styles = theme => ({
  root: {
    height: 300,
    width: 450
  }
});

class StationsMap extends Component {
  state = {
    lat: 51.505,
    lng: -0.09,
    zoom: 6
  };

  render() {
    // const position = [this.state.lat, this.state.lng];
    const { classes } = this.props;

    const stationList = stations.map(stn => (
      <Marker key={stn.name} position={[stn.lat, stn.lon]}>
        <Popup>Popup for Marker</Popup>
      </Marker>
    ));

    return (
      <div className={classes.root}>
        <Map
          // center={position}
          bounds={[
            [39.6599749572, -76.054674387],
            [42.8735898535, -70.7215416431]
          ]}
          // zoom={this.state.zoom}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png" />
          {stationList}
        </Map>
      </div>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("appStore")(observer(StationsMap)))
);
