import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import Icon from "./DashboardIcon";
import NewDashboardTableEntry from "./NewDashboardTableEntry";
import styled from "styled-components";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import NewPost from "./NewPost";
import status_list from "./DashboardIcon";

const DashboardTag = styled.p`
  background: #eeeeeeee;
  text-align: center;
  margin: 2px;
  border-radius: 30px;
  display: inline-block;
  padding: 5px;
`;

const DashboardContainer = styled.div`
  width: 100%;
`;

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
      filter: "",
      filter_metadata: "",
      modal: null,
      showNewPostModal: false,
      showPostSubmittedModal: false,
      postSubmitted: 0
    };

    this.buildDashboardTableRow = this.buildDashboardTableRow.bind(this);
    this.addApplication = this.addApplication.bind(this);
    this.filterDashboardTableRow = this.filterDashboardTableRow.bind(this);
    this.tagStringMatch = this.tagStringMatch.bind(this);
    this.enter_filter_tag = this.enter_filter_tag.bind(this);

    this.getNewPostModal = this.getNewPostModal.bind(this);
    this.getPostSubmittedModal = this.getPostSubmittedModal.bind(this);
    
    this.closeNewPostModal = this.closeNewPostModal.bind(this);
    this.closePostSubmittedModal = this.closePostSubmittedModal.bind(this);

    this.submitPost = this.submitPost.bind(this);
  }

  enter_filter_tag(event) {
    this.setState({ filter: event.target.value });
  }

  addApplication(job_id) {
    fetch("http://" + window.location.hostname + ":8000/applications/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        job_id: job_id,
        token: this.state.token,
        resume_id: 1
      })
    })
    .then((res) => {
      if(res.status == 200) {
        alert("Job succesfully added!");
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
      .then((res) => {
        if (res.status == 200) {
          return res.json();
        } else if (res.status == 411) {
          throw new Error("Job already added!");
        } else {
          throw new Error("Something else broke!");
        }
      })
      .then((json) => {
        this.setState({ applications: [...this.state.applications, json] });
      })
      .catch((error) => {
        alert(error);
      });
  }

  componentDidMount() {
    fetch(
      "http://" +
        window.location.hostname +
        ":8000/applications/get?token=" +
        this.state.token,
      {
        method: "GET",
        headers: {},
      }
    )
      .then((res) => {
        if (res.status == 410) {
          window.location.replace("/login");
        }
        return res.json();
      })
      .then((json) => {
        this.setState({ applications: json.applicationData });
        this.setState({ stages: json.stages });
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
    );
  }

  buildDashboardTableHeader(stages) {
    let tableHeaderData = [];
    let metadata_stages = [
      "Share",
      "Job Name",
      "Link",
      "Company Name",
      "Location",
      "Resume ID",
    ];
    // Include metadata as specified by body. See `buildDashboardTableRow`.
    for (let i = 0; i < metadata_stages.length; i++) {
      tableHeaderData.push(<th>{metadata_stages[i]}</th>);
    }

    tableHeaderData.push(
      <th>
        <input
          onChange={this.enter_filter_tag}
          placeholder="Search for a job"
        />
      </th>
    );

    for (let i = 0; i < stages.length; i++) {
      tableHeaderData.push(<th>{stages[i].name}</th>);
    }
    return (
      <thead>
        <tr>{tableHeaderData}</tr>
      </thead>
    );
  }

  buildDashboardData(applications) {
    let dashboardData = [];
    let filtered_apps = applications.filter(this.filterDashboardTableRow);

    for (let i = 0; i < filtered_apps.length; i++) {
      dashboardData.push(this.buildDashboardTableRow(filtered_apps[i]));
    }
    return <tbody>{dashboardData}</tbody>;
  }

  updateApplicationStatus(applicationBase, applicationEventId, newStatus) {
    for(let i = 0; i < applicationBase.applicationEvents.length; i++) {
      if(applicationBase.applicationEvents[i].id == applicationEventId) {
        applicationBase.applicationEvents[i].status = newStatus;
        return;
      }
    }
  }

  buildDashboardTableRow(applicationBase) {
    let tableRowData = [];
    // Include metadata as specified by header. See `buildDashboardTableHeader`.
    applicationBase.applicationEvents.sort((x, y) => x.stage_id > y.stage_id);
    tableRowData.push(
      <button
        onClick={() => {
          this.setState({ modalApp: applicationBase, showNewPostModal: true });
        }}
      >
        Share
      </button>
    );
    tableRowData.push(<td>{applicationBase.job.name}</td>);
    tableRowData.push(
      <td>
        <a href={applicationBase.job.link}>{applicationBase.job.link}</a>
      </td>
    );
    tableRowData.push(<td>{applicationBase.job.company.name}</td>);
    tableRowData.push(<td>{applicationBase.job.location}</td>);
    tableRowData.push(<td>{applicationBase.resume_id}</td>);

    let tags = [];
    let jobTags_filtered = applicationBase.job.tags.filter((x) =>
      this.tagStringMatch(x.tag.tag)
    );
    for (let i = 0; i < jobTags_filtered.length; i++) {
      tags.push(<DashboardTag>{jobTags_filtered[i].tag.tag}</DashboardTag>);
    }

    tableRowData.push(
      <td>
        <DashboardContainer>{tags}</DashboardContainer>
      </td>
    );

    for (let i = 0; i < applicationBase.applicationEvents.length; i++) {
      let e = applicationBase.applicationEvents[i];
      tableRowData.push(
        <td>
          <Icon
            id={e.id}
            status={e.status}
            applicationBaseId={e.applicationBaseId}
            token={this.state.token}
            key={e.id}
            func={(status) => this.updateApplicationStatus(applicationBase, e.id, status)}
          />
        </td>
      );
    }
    return <tr>{tableRowData}</tr>;
  }

  filterDashboardTableRow(applicationBase) {
    /* Filters based on this.state.filter_tag. Returns "false" if the object should
     *  be filtered, and "true" otherwise.
     *  Job-based filtering is done in buildDashboardData.
     *  If "this.state.show_all_tags" is 0, then some other filtering is done
     *  in buildDashboardTableRow - tags are checked against the same predicate,
     *  and if they don't match, are removed. May be a better user experience.
     *
     */

    // filter by tags
    let tag_found = false,
      test_tag;
    for (let j = 0; j < applicationBase.job.tags.length; j++) {
      test_tag = applicationBase.job.tags[j].tag.tag;
      if (this.tagStringMatch(test_tag)) {
        tag_found = true;
      }
    }

    // filter by metadata
    if (
      this.tagStringMatch(applicationBase.job.name) ||
      this.tagStringMatch(applicationBase.job.location) ||
      this.tagStringMatch(applicationBase.job.company.name)
    ) {
      tag_found = true;
    }

    return tag_found;
  }

  tagStringMatch(test_tag) {
    let query_tags = this.state.filter.split(",");
    if (query_tags.length == 0) {
      return true;
    }
    for (let i = 0; i < query_tags.length; i++) {
      if (test_tag.toLowerCase().includes(query_tags[i].toLowerCase())) {
        return true;
      }
    }
    return false;
  }

  submitPost(post) {
    fetch("http://" + window.location.hostname + ":8000/posts/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    })
      .then((res) => res.json())
      .then((json) => {
        this.setState({ group_name: json.group.name, showNewPostModal: false, showPostSubmittedModal: true });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  getNewPostModal() {
    if (this.state.modalApp == null) {
      return;
    }

    // Process modalApp to figure out subject and body info:
    let app = this.state.modalApp;
    let lastEvent, e;
    for (let i = 0; i < app.applicationEvents.length; i++) {
      e = app.applicationEvents[i];
      if (e.status != 0) {
        lastEvent = e;
      }
    }

    let subject, body;
    let emotion_map = [null, "Good news!", "Bad news :( "];
    if (lastEvent) {
      subject =
        "Update from " +
        app.job.company.name +
        ", " +
        lastEvent.stage.name +
        ": " +
        emotion_map[lastEvent.status];

      body =
        "I just heard back from " +
        app.job.company.name +
        ", and it's " +
        emotion_map[lastEvent.status].toLocaleLowerCase();
    } else {
      subject =
        "Interesting job @ " + app.job.company.name + ": " + app.job.name;

      body = "This looks like a great opprotunity!";
    }

    let newModal = (
      <Modal show={this.state.showNewPostModal} onHide={this.closeNewPostModal}>
        <Modal.Header closeButton>
          <Modal.Title>Share Dashboard Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NewPost
            body={body}
            subject={subject}
            job_id={app.job.id}
            company_id={app.job.company.id}
            token={this.state.token}
            dashboard_add={true}
            func={this.submitPost}
          />
        </Modal.Body>
      </Modal>
    );
    return newModal;
  }

  getPostSubmittedModal() {
    return (
      <Modal show={this.state.showPostSubmittedModal} onHide={this.closePostSubmittedModal}>
        <Modal.Header closeButton>
          <Modal.Title>Post submitted!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Successfully submitted post to {this.state.group_name}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.closePostSubmittedModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  closeNewPostModal() {
    this.setState({ showNewPostModal: false});
  }

  closePostSubmittedModal() {
    this.setState({ showPostSubmittedModal: false });
  }

  render() {
    if (this.state.stages == null || this.state.applications == null) {
      return null;
    }
    let newPostModal = this.getNewPostModal();
    let postSubmittedModal = this.getPostSubmittedModal(); 

    let table = this.buildDashboardTable(
      this.state.applications,
      this.state.stages
    );
    let newEntry;
    if (this.state.addApplication) {
      newEntry = (
        <NewDashboardTableEntry
          token={this.state.token}
          func={this.addApplication}
        />
      );
    } else {
      newEntry = (
        <button onClick={() => this.setState({ addApplication: 1 })}>
          Add Job to Dashboard
        </button>
      );
    }

    return (
      <div>
        {newEntry}
        {table}
        {newPostModal}
        {postSubmittedModal}
      </div>
    );
  }
}

export default App;
