import React, { Component } from 'react';
import styled from 'styled-components';


const IconButton = styled.button`
  background: none;
  border: none;
  font-size: 120%; 
`

const status_list = ["N/A","Round 1", "Round 2", "Offer"];

class SlimIcon extends Component {
  // Will need to pull all data from get functions from backend API to pull real data.
  // https://github.com/react-bootstrap-table/react-bootstrap-table2/issues/215 to get carets working when CSS happens
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      token: props.token,
      applicationBaseId: props.applicationBaseId,
      status: props.status,
      func: props.func
    }
  this.updateStatus = this.updateStatus.bind(this);
  }

  updateStatus() {
    let newStatus = (this.state.status + 1) % status_list.length;
    this.setState({status: newStatus});
    this.state.func(newStatus);
    fetch("http://" + window.location.hostname + ":8000/applications/update", {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": JSON.stringify({
        "id": this.state.id,
        "status": newStatus,
        "token": this.state.token,
        "applicationBaseId": this.state.applicationBaseId
      })})
      .then((res) => res.status)
      .then((status) => {
        if(status != 200) {
          throw new Error("Weird error!")
        }
      })
      .catch(err => {
        console.error(err);
        alert(err);
      });
  }

  render() {
    return <IconButton onClick={this.updateStatus}>{status_list[this.state.status]}</IconButton>;
  }
}

export default SlimIcon;