import React, { Component } from 'react';
import styled from 'styled-components';
import { DashboardRowItemButton } from './DashboardTableRow';

class SlimIcon extends Component {
  // Will need to pull all data from get functions from backend API to pull real data.
  // https://github.com/react-bootstrap-table/react-bootstrap-table2/issues/215 to get carets working when CSS happens
  constructor(props) {
    super(props);
    this.state = {
      token: props.token,
      applicationBaseId: props.applicationBaseId,
      event: props.event,
      func: props.func,
      pendingUpdate: false,
    }
  this.updateStatus = this.updateStatus.bind(this);
  }

  updateStatus() {
    this.setState({ pendingUpdate: true });
    fetch("http://" + window.location.hostname + ":8000/applications/update", {
      credentials: "include",
      "Cache-Control": "no-store",
      "method": "POST",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": JSON.stringify({
        applicationBaseId: this.state.applicationBaseId,
        stage: (this.state.event != null ? this.state.event.stage : null)
      })})
      .then((res) => res.json())
      .then((json) => {
        this.setState({ event: json, pendingUpdate: false});
      });
  }

  render() {
    return <DashboardRowItemButton disabled={this.state.pendingUpdate} onClick={this.updateStatus}>{(this.state.event != null ? this.state.event.stage.name : "Not Applied")}</DashboardRowItemButton>;
  }
}

export default SlimIcon;