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
import DashboardJobInfo from "./DashboardJobInfo";
import SlimIcon from "./SlimIcon";
import { PostButton } from "./Post";

const DashboardTag = styled.p`
  text-align: center;
  margin: 2px;
  border-radius: 30px;
  display: inline-block;
  padding: 5px;
`;

const DashboardRowItemButton = styled.button`
  background: transparent;
  margin-bottom: 0px;
  max-height: 200px;
  padding: 5px;
  color: black;
  font-size: 18px;
  transition: 0.1s;
  border-radius: 10px;
  border: solid transparent 2px;
  white-space: nowrap;
  &:hover {
    color: black;
    border: solid grey 2px;
    text-decoration: none;
  }
`;

const DashboardContainer = styled.div`
  width: 100%;
`;

class DashboardTableRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: props.expand,
      num: 0,
      token: props.token,
      showNewPostModal: false,
      loadNewPostModal: false,
      showPostSubmittedModal: false
    };
    this.applicationBase = props.applicationBase;
    this.token = props.token;
    this.func = props.func;
    this.filterCompanyFunc = props.filterCompanyFunc;
    this.updateFunc = props.updateFunc;

    this.getPostSubmittedModal = this.getPostSubmittedModal.bind(this);
    this.submitPost = this.submitPost.bind(this);

  }

  getNewPostModal() {
    // Process modalApp to figure and body info:
    if(!this.state.loadNewPostModal) {
      return null;
    }
    let app = this.applicationBase;
    let lastEvent = getLastEvent(this.applicationBase)
    let body;
    if (lastEvent != null) {
      body =
        "I just heard back from " +
        app.job.company.name +
        "!";
    } else {
      body = "This looks like a great opprotunity!";
    }

    let newModal = (
      <Modal
        show={this.state.showNewPostModal}
        onHide={() => this.setState({ showNewPostModal: false })}
      >
        <Modal.Header closeButton>
          <Modal.Title>Share Dashboard Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NewPost
            body={body}
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
        this.setState({
          group_name: json.group.name,
          showNewPostModal: false,
          showPostSubmittedModal: true,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  getPostSubmittedModal() {
    return (
      <Modal
        show={this.state.showPostSubmittedModal}
        onHide={() => this.setState({ showPostSubmittedModal: false })}
      >
        <Modal.Header closeButton>
          <Modal.Title>Post submitted!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Successfully submitted post to {this.state.group_name}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => this.setState({ showPostSubmittedModal: false })}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {
    let tableRowData = [];
    let read = ["Expand", "Collapse"];
    // Include metadata as specified by header. See `buildDashboardTableHeader`.
    this.applicationBase.applicationEvents.sort(
      (x, y) => x.stage_id > y.stage_id
    );

    let lastEvent = getLastEvent(this.applicationBase);
    let lastTime =
      lastEvent == null
        ? new Date(this.applicationBase.timestamp)
        : new Date(lastEvent.timestamp);

    let unit = "minute";
    let time = Math.floor(Math.abs(new Date() - lastTime) / 1000 / 60);

    if (time == 0) {
      time = null;
      unit = "just now"
    }

    if (time > 60) {
      time = Math.floor(time / 60);
      unit = "hour";
    }
    if (time > 24) {
      time = Math.floor(time / 24);
      unit = "day";
    }
    if (time > 1) {
      unit += "s";
    }

    tableRowData.push(
      <td>
        <DashboardRowItemButton
          onClick={() => this.setState({ expand: !this.state.expand })}
        >
          {this.applicationBase.job.name}
        </DashboardRowItemButton>
      </td>
    );
    tableRowData.push(
      <td>
        <DashboardRowItemButton disabled>
          {time} {unit}
        </DashboardRowItemButton>
      </td>
    );
    tableRowData.push(
      <td>
        <DashboardRowItemButton onClick={this.filterCompanyFunc}>
          {this.applicationBase.job.company.name}
        </DashboardRowItemButton>
      </td>
    );

    let tags = [];
    let jobTags_filtered = this.applicationBase.job.tags;

    for (let i = 0; i < jobTags_filtered.length; i++) {
      tags.push(<DashboardTag>{jobTags_filtered[i].tag.tag}</DashboardTag>); // left this logic so that all tags are attached to job, this way when filtering other tags will show up that match the filter
    }

    let showTags = []; //create tags to be shown
    for (let x = 0; x < jobTags_filtered.length; x++) {
      //guarantees won't break if total tags < 3
      if (x == 3) {
        showTags.push("..."); //adds this to indicate there are more tags
        x = jobTags_filtered.length; //exists the loop after 3 or total tag length, whichever comes first
      } else {
        showTags.push(tags[x]); //build showTags with tags
        if (x != 2)
          //so that no comma before ...
          showTags.push(","); // since i took background out
        this.applicationBase.job.showTags = showTags;
      }
    }


    console.log(lastEvent);
    tableRowData.push(
      <td>
        <SlimIcon
          event={lastEvent}
          applicationBaseId={this.applicationBase.id}
          token={this.token}
        />
      </td>
    );

    let returnData = [<tr>{tableRowData}</tr>];
    let getFrom = this.applicationBase.job;
    let newPostModal = this.getNewPostModal();
    let postSubmittedModal = this.getPostSubmittedModal();

    if (this.state.expand == true) {
      returnData.push(
        <tr>
          <td colSpan={4}>
            <div style={{ backgroundColor: "" }}>
              {newPostModal}
              {postSubmittedModal}
              <DashboardJobInfo
                job={this.applicationBase.job}
                func={() => {
                  this.setState({
                    showNewPostModal: true,
                    loadNewPostModal: true
                  });
                }}
                resume={this.applicationBase.resume}
              />
            </div>
          </td>
        </tr>
      );
    }
    return returnData;
  }
}

function getLastEvent(applicationBase) {
  return applicationBase.applicationEvents[applicationBase.applicationEvents.length - 1];
}

export default DashboardTableRow;

export { DashboardRowItemButton, getLastEvent };
