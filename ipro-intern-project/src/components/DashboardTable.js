import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor'
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Table from 'react-bootstrap/Table'
import Icon from './DashboardIcon'
import NewDashboardTableEntry from './NewDashboardTableEntry'
import styled from "styled-components";
import Form from "react-bootstrap/Form";


const DashboardTag = styled.p`
  background: #EEEEEEEE;
  text-align: center;
  margin: 2px;
  border-radius: 30px;
  display: inline-block;
  padding: 5px;
`

const DashboardContainer = styled.div`
  width: 100%;
`


class App extends Component {
  // Will need to pull all data from get functions from backend API to pull real data.
  //https://github.com/react-bootstrap-table/react-bootstrap-table2/issues/215 to get carets working when CSS happens

  constructor(props) {
    super(props);
    this.state = {
      token: props.token,
      applications: [],
      stages: null,
      addJob: 0,
      filter_tag: ""
    }

    this.buildDashboardTableRow = this.buildDashboardTableRow.bind(this);
    this.addJob = this.addJob.bind(this);
    this.filterDashboardTableRow = this.filterDashboardTableRow.bind(this);
    this.tagStringMatch = this.tagStringMatch.bind(this);
    this.enter_filter_tag = this.enter_filter_tag.bind(this);
  }

  enter_filter_tag(event) {
    this.setState({ filter_tag: event.target.value });
  }

  addJob(job_id) {
    fetch("http://" + window.location.hostname + ":8000/applications/add", {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": JSON.stringify({
        job_id: job_id,
        token: this.state.token,
        resume_id: 1
      })
    })
    .then((res) => {
      if(res.status == 200) {
        return res.json();
      } else if (res.status == 411) {
        throw new Error("Job already added!");
      } else {
        throw new Error("Something else broke!");
      }
    }).then((json) => {
      this.setState({ applications: [...this.state.applications, json]});
    }).catch(error => {
      alert(error);
    })
  }
  

  componentDidMount() {
    fetch("http://" + window.location.hostname + ":8000/applications/get?token=" + this.state.token, {
      "method": "GET",
      "headers": {}
    })
    .then((res) => {
      if(res.status == 410) {
        window.location.replace("/login")
      };
      return res.json();
    })
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

    tableHeaderData.push(
      <th>
        <input onChange={this.enter_filter_tag} placeholder="Tags"/>
      </th>
    )

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
    let filtered_apps = applications.filter(this.filterDashboardTableRow)

    for(let i = 0; i < filtered_apps.length; i++) {
      dashboardData.push(
        this.buildDashboardTableRow(filtered_apps[i]));
    }
    return <tbody>{dashboardData}</tbody>;
  }

  buildDashboardTableRow(applicationBase) {
    let tableRowData = [];
    // Include metadata as specified by header. See `buildDashboardTableHeader`.
    applicationBase.applicationEvents.sort((x, y) => (x.stage_id > y.stage_id));
    tableRowData.push(<td>{applicationBase.job_id}</td>);
    tableRowData.push(<td>{applicationBase.resume_id}</td>);

    let tags = [];
    let jobTags_filtered = applicationBase.job.tags.filter((x) => this.tagStringMatch(x.tag));
    for(let i = 0; i < jobTags_filtered.length; i++) {
      tags.push(<DashboardTag>{jobTags_filtered[i].tag}</DashboardTag>)
    }

    tableRowData.push(<td><DashboardContainer>{tags}</DashboardContainer></td>);

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

  filterDashboardTableRow(applicationBase) {
    /* Filters based on this.state.filter_tag. Returns "false" if the object should 
    *  be filtered, and "true" otherwise. 
    *  Job-based filtering is done in buildDashboardData. 
    *  If "this.state.show_all_tags" is 0, then some other filtering is done 
    *  in buildDashboardTableRow - tags are checked against the same predicate, 
    *  and if they don't match, are removed. May be a better user experience. 
    *  
    *  TODO: Refactor to include logcial "OR", rather than just "AND". 
    */
    let tag_found, test_tag;
    for(let j = 0; j < applicationBase.job.tags.length; j++) {
      test_tag = applicationBase.job.tags[j].tag;
      if(this.tagStringMatch(test_tag)) {
        tag_found = true;
      }
    }
    if(!tag_found) {
      return false;
    }
    return true;
  }

  tagStringMatch(test_tag) {
    let query_tags = this.state.filter_tag.split(",");
    if(query_tags.length == 0) {
      return true;
    }
    let query_tag;
    for(let i = 0; i < query_tags.length; i++) {
      query_tag = query_tags[i]
      if(test_tag.toLowerCase().includes(query_tag.toLowerCase())) {
        return true;
      }
    }
    return false;
  }

  render() {
    if(this.state.stages == null || this.state.applications == null) {
      return null;
    }
    let table = this.buildDashboardTable(this.state.applications, this.state.stages);
    let newEntry;
    if(this.state.addJob) {
      newEntry = <NewDashboardTableEntry token={this.state.token} func={this.addJob}/>
    } else {
      newEntry = <button onClick={() => this.setState({addJob: 1})}>Add Job to Dashboard</button>;
    }
    return (
      <div>
        {newEntry}
        {table}
      </div>

    );
  }
}

export default App;
