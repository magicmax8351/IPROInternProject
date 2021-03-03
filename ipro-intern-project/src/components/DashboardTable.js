import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor'
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Table from 'react-bootstrap/Table'
import Icon from './DashboardIcon'


class App extends Component {

  // Will need to pull all data from get functions from backend API to pull real data.

  //https://github.com/react-bootstrap-table/react-bootstrap-table2/issues/215 to get carets working when CSS happens

  constructor(props) {
    super(props);
    this.state = {
      token: props.token,
      applications: null,
      stages: null
    }

    this.buildDashboardTableRow = this.buildDashboardTableRow.bind(this);
  }

  componentDidMount() {
    console.log(this.state.token);
    fetch("http://" + window.location.hostname + ":8000/applications/get?token=" + this.state.token, {
      "method": "GET",
      "headers": {}
    })
    .then((res) => res.json())
    .then((json) => {
      this.setState({ applications: json.applicationData });
      this.setState({ stages: json.stages})
    });
  }

  buildDashboardTable(applications, stages) {
    let header = this.buildDashboardTableHeader(stages);
    let body = this.buildDashboardData(applications);
    return (
      <Table responsive="sm">
        {header}
        {body}
      </Table>
    )
  }

  buildDashboardTableHeader(stages) {
    let tableHeaderData = [];
    let metadata_stages = ["Job ID", "Resume ID"];
    // Include metadata as specified by body. See `buildDashboardTableRow`. 
    for(let i = 0; i < metadata_stages.length; i++) {
      tableHeaderData.push(<th>{metadata_stages[i]}</th>)
    }
    for(let i = 0; i < stages.length; i++) {
      tableHeaderData.push(<th>{stages[i].name}</th>)
    }
    return (
      <thead>
        <tr>
          {tableHeaderData}
        </tr>
      </thead>
    )
  }

  buildDashboardData(applications) {
    let dashboardData = [];
    for(let i = 0; i < applications.length; i++) {
      dashboardData.push(
        this.buildDashboardTableRow(applications[i]));
    }
    return <tbody>{dashboardData}</tbody>;
  }

  buildDashboardTableRow(applicationBase) {
    let tableRowData = [];
    // Include metadata as specified by header. See `buildDashboardTableHeader`. 
    applicationBase.applicationEvents.sort((x, y) => (x.stage_id > y.stage_id));
    tableRowData.push(<td>{applicationBase.job_id}</td>);
    tableRowData.push(<td>{applicationBase.resume_id}</td>);

    for(let i = 0; i < applicationBase.applicationEvents.length; i++) {
      let e = applicationBase.applicationEvents[i]
      tableRowData.push(<td><Icon
        id={e.id}
        status={e.status}
        applicationBaseId={e.applicationBaseId}
        token={this.state.token}
        key={e.id}
        /></td>)
    }
    return <tr>{tableRowData}</tr>
  }

  render() {
    if(this.state.stages == null || this.state.applications == null) {
      return null;
    }
    let table = this.buildDashboardTable(this.state.applications, this.state.stages);
    return (
      table
    );
  }
}

export default App;