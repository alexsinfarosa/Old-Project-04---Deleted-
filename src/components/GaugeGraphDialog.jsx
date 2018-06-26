import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "../withRoot";

import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";

const styles = theme => ({
  root: { flexGrow: 1 }
});

class GaugeGraphDialog extends Component {
  handleClose = () => {
    this.props.onClose(this.props.selectedValue);
  };

  handleListItemClick = value => {
    this.props.onClose(value);
  };

  render() {
    const { isOpen, gauge, title, timeSeries, fullScreen } = this.props;

    return (
      <Dialog
        fullWidth={true}
        fullScreen={fullScreen}
        onClose={this.handleClose}
        open={isOpen}
        aria-labelledby="simple-dialog-title"
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent style={{ margin: 40 }}>
          <div>{gauge}</div>
          <div>{timeSeries}</div>
        </DialogContent>
      </Dialog>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("appStore")(observer(GaugeGraphDialog)))
);
