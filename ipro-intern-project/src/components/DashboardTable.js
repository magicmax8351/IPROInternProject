import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import NewDashboardTableEntry from "./NewDashboardTableEntry";
import styled from "styled-components";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import DashboardTableRow, {
  DashboardRowItemButton,
  getLastEvent,
} from "./DashboardTableRow";
import {
  FeedContainer,
  PostsContainer,
  SidebarContainer,
  SidebarFlexContainer,
  UserInput,
} from "../views/NewsFeed";
import { PostButton } from "./Post";
import {
  GreyGroupRow,
  GroupStatsHeader,
  GroupStatsItem,
  WhiteGroupRow,
} from "../views/GroupPage";
import { SmallTitle } from "../views/ViewGroups";


const DashboardButton = styled(PostButton)`
  width: 100%;
`;

const SidebarOptions = styled.select`
  width: 100%;
  border-radius: 5px;
  font-size: 15px;
`;

const DashboardTableContainer = styled.div`
  width: 100%;
  background: white;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
  height: 100%;
`;

const DashboardRowItemButtonHeader = styled(DashboardRowItemButton)`
  font-family: "Work-Sans";
  font-size: 22px;
`;

class DashboardTable extends Component {
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
      companyFilter: null,
      modal: null,
      showNewPostModal: false,
      showPostSubmittedModal: false,
      showAddJobModal: false,
      postSubmitted: 0,
      sort: "job",
      sortDirection: true,
      showJobAddedModal: false,
    };

    this.addApplication = this.addApplication.bind(this);
    this.filterDashboardTableRow = this.filterDashboardTableRow.bind(this);
    this.tagStringMatch = this.tagStringMatch.bind(this);
    this.enter_filter_tag = this.enter_filter_tag.bind(this);

    this.closeNewPostModal = this.closeNewPostModal.bind(this);
    this.closePostSubmittedModal = this.closePostSubmittedModal.bind(this);
  }

  enter_filter_tag(event) {
    this.setState({ filter: event.target.value });
  }

  addApplication(job_id, resume_id) {
    fetch("http://" + window.location.hostname + ":8000/applications/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        job_id: job_id,
        token: this.state.token,
        resume_id: resume_id,
      }),
    })
      .then((res) => {
        if (res.status == 200) {
          //alert("Job succesfully added!");
          return res.json();
        } else if (res.status == 411) {
          throw new Error("Job already added!");
        } else {
          throw new Error("Something else broke!");
        }
      })
      .then((json) => {
        this.setState({
          applications: [...this.state.applications, json],
          showAddJobModal: false,
          showJobAddedModal: true,
        });
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
      <Table striped hover>
        {header}
        {body}
      </Table>
    );
  }

  buildDashboardTableHeader(stages) {
    let tableHeaderData = [];
    let metadata_stages = [];
    metadata_stages.push(
      <DashboardRowItemButtonHeader
        onClick={() => {
          if (this.state.sort == "job") {
            this.setState({ sortDirection: !this.state.sortDirection });
          } else {
            this.setState({ sort: "job", sortDirection: true });
          }
        }}
        style={{
          textDecoration: this.state.sort == "job" ? "underline" : null,
        }}
      >
        job name
      </DashboardRowItemButtonHeader>
    );
    metadata_stages.push(
      <DashboardRowItemButtonHeader
        onClick={() => {
          if (this.state.sort == "time") {
            this.setState({ sortDirection: !this.state.sortDirection });
          } else {
            this.setState({ sort: "time", sortDirection: true });
          }
        }}
        style={{
          textDecoration: this.state.sort == "time" ? "underline" : null,
        }}
      >
        last updated
      </DashboardRowItemButtonHeader>
    );
    metadata_stages.push(
      <DashboardRowItemButtonHeader
        onClick={() => {
          if (this.state.companyFilter != null) {
            this.setState({ companyFilter: null });
          } else {
            if (this.state.sort == "company") {
              this.setState({ sortDirection: !this.state.sortDirection });
            } else {
              this.setState({ sort: "company", sortDirection: true });
            }
          }
        }}
        style={{
          textDecoration: this.state.sort == "company" ? "underline" : null,
        }}
      >
        {this.state.companyFilter ? "clear filter" : "company name"}
      </DashboardRowItemButtonHeader>
    );
    metadata_stages.push(
      <DashboardRowItemButtonHeader
        onClick={() => {
          if (this.state.sort == "status") {
            this.setState({ sortDirection: !this.state.sortDirection });
          } else {
            this.setState({ sort: "status", sortDirection: true });
          }
        }}
        style={{
          textDecoration: this.state.sort == "status" ? "underline" : null,
        }}
      >
        status
      </DashboardRowItemButtonHeader>
    );

    // Include metadata as specified by body. See `buildDashboardTableRow`.

    for (let i = 0; i < metadata_stages.length; i++) {
      tableHeaderData.push(<th>{metadata_stages[i]}</th>);
    }

    return (
      <thead>
        <tr>{tableHeaderData}</tr>
      </thead>
    );
  }

  compareApps(a, b, sort) {
    let v1, v2;
    if (sort == "job") {
      v1 = a.job.name;
      v2 = b.job.name;
    } else if (sort == "company") {
      v1 = a.job.company.name;
      v2 = b.job.company.name;
    } else if (sort == "time") {
      v1 = getLastEvent(a);
      v2 = getLastEvent(b);
      if (v1 == null) {
        v1 = a.timestamp;
      } else {
        v1 = v1.timestamp;
      }
      if (v2 == null) {
        v2 = b.timestamp;
      } else {
        v2 = v2.timestamp;
      }
    } else if (sort == "status") {
      v1 = getLastEvent(a);
      v2 = getLastEvent(b);
      if (v1 == null) {
        return -1;
      } else if (v2 == null) {
        return 1;
      } else {
        if (v1.stage.id > v2.stage.id) {
          return 1;
        } else if (v2.stage.id > v1.stage.id) {
          return -1;
        } else {
          return 0;
        }
      }
    }
    if (v1 > v2) {
      return 1;
    } else if (v2 > v1) {
      return -1;
    } else {
      return 0;
    }
  }

  buildDashboardData(applications) {
    let dashboardData = applications
      .filter(this.filterDashboardTableRow)
      .sort(
        (a, b) =>
          (this.state.sortDirection ? 1 : -1) *
          this.compareApps(a, b, this.state.sort)
      )
      .map((x) => (
        <DashboardTableRow
          key={x.id}
          filterCompanyFunc={() =>
            this.setState({ companyFilter: x.job.company.name })
          }
          applicationBase={x}
          token={this.state.token}
          expand={this.state.modalApp == x}
        ></DashboardTableRow>
      ));

    return <tbody key={Math.random() * 25565}>{dashboardData}</tbody>;
  }

  updateApplicationStatus(applicationBase, applicationEventId, newStatus) {
    for (let i = 0; i < applicationBase.applicationEvents.length; i++) {
      if (applicationBase.applicationEvents[i].id == applicationEventId) {
        applicationBase.applicationEvents[i].status = newStatus;
        return;
      }
    }
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

    if (this.state.companyFilter != null) {
      return this.tagStringMatch(applicationBase.job.company.name);
    }

    let tag_found = false;
    for (let j = 0; j < applicationBase.job.tags.length; j++) {
      if (this.tagStringMatch(applicationBase.job.tags[j].tag.tag)) {
        tag_found = true;
      }
    }
    // filter by metadata
    return (
      tag_found ||
      this.tagStringMatch(applicationBase.job.name) ||
      this.tagStringMatch(applicationBase.job.location) ||
      this.tagStringMatch(applicationBase.job.company.name)
    );
  }

  tagStringMatch(test_tag) {
    let query_tags =
      this.state.companyFilter != null
        ? this.state.companyFilter.split(",")
        : this.state.filter.split(",");
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

  getJobAddedModal() {
    return (
      <Modal
        show={this.state.showJobAddedModal}
        onHide={() => this.setState({ showJobAddedModal: false })}
      >
        <Modal.Header closeButton>
          <Modal.Title>Job added</Modal.Title>
        </Modal.Header>
        <Modal.Body>Added job to dashboard!</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => this.setState({ showJobAddedModal: false })}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  getAddJobModal() {
    return (
      <Modal
        show={this.state.showAddJobModal}
        onHide={() => this.setState({ showAddJobModal: false })}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Job To Dashboard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NewDashboardTableEntry
            token={this.state.token}
            func={this.addApplication}
            applications={this.state.applications}
          />
        </Modal.Body>
      </Modal>
    );
  }

  closeNewPostModal() {
    this.setState({ showNewPostModal: false });
  }

  closePostSubmittedModal() {
    this.setState({ showPostSubmittedModal: false });
  }

  calcCallbacks(applications, stage) {
    let count = applications.map((x) => (x.applicationEvents.length > stage ? 1 : 0));
    let totalCount = 0;
    for (let i = 0; i < count.length; i++) {
      totalCount += count[i]
    }
    return totalCount;
  }

  render() {
    if (this.state.stages == null || this.state.applications == null) {
      return null;
    }
    let addJobModal = this.getAddJobModal();
    let jobAddedModal = this.getJobAddedModal();

    let table = this.buildDashboardTable(
      this.state.applications,
      this.state.stages
    );
    return (
      <div>
        {addJobModal}
        {jobAddedModal}
        <FeedContainer>
          <SidebarFlexContainer>
          <SidebarContainer>
            <SmallTitle>dashboard</SmallTitle>
          </SidebarContainer>
            <SidebarContainer>
              <h5>search</h5>
              <UserInput
                onChange={(event) =>
                  this.setState({ filter: event.target.value })
                }
                placeholder="enter a filter"
              />
            </SidebarContainer>
            <SidebarContainer>
              <h5>select date range</h5>
              <SidebarOptions>
                <option>summer 2021</option>
                <option>summer 2020</option>
                <option>summer 2019</option>
              </SidebarOptions>
            </SidebarContainer>
            <SidebarContainer>
              <h5>statistics</h5>
              <GreyGroupRow>
                <GroupStatsHeader>total dashboard entries</GroupStatsHeader>
              </GreyGroupRow>
              <WhiteGroupRow>
                <GroupStatsItem>
                  {this.state.applications.length}
                </GroupStatsItem>
              </WhiteGroupRow>
              <GreyGroupRow>
                <GroupStatsHeader>total applications</GroupStatsHeader>
              </GreyGroupRow>
              <WhiteGroupRow>
                <GroupStatsItem>
                  {this.calcCallbacks(this.state.applications, 0)}
                </GroupStatsItem>
              </WhiteGroupRow>
              <GreyGroupRow>
                <GroupStatsHeader>total callbacks</GroupStatsHeader>
              </GreyGroupRow>
              <WhiteGroupRow>
                <GroupStatsItem>
                  {this.calcCallbacks(this.state.applications, 1)}
                </GroupStatsItem>
              </WhiteGroupRow>
              <GreyGroupRow>
                <GroupStatsHeader>total offers</GroupStatsHeader>
              </GreyGroupRow>
              <WhiteGroupRow>
                <GroupStatsItem>{this.calcCallbacks(this.state.applications, 4)}</GroupStatsItem>
              </WhiteGroupRow>
            </SidebarContainer>
            <SidebarContainer>
              <DashboardButton
                onClick={() => this.setState({ showAddJobModal: true })}
              >
                add a job
              </DashboardButton>
            </SidebarContainer>
          </SidebarFlexContainer>
          <DashboardTableContainer>{table}</DashboardTableContainer>
        </FeedContainer>
      </div>
    );
  }
}

export default DashboardTable;
