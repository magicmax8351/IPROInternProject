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
import CuteButton from "./CuteDashboardShareButton";
import JobInfo from "./JobInfo";

const DashboardTag = styled.p`
  /* background: #ede6ff; took background out cuz it looked dumb */
  text-align: center;
  margin: 2px;
  border-radius: 30px;
  display: inline-block;
  padding: 5px;
`;

const DashboardContainer = styled.div`
  width: 100%;
`;

class DashboardTableRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: false,
      num: 0,
    };
    this.applicationBase = props.applicationBase;
    this.token = props.token;
    this.func = props.func;
  }

  updateApplicationStatus(applicationBase, applicationEventId, newStatus) {
    for (let i = 0; i < applicationBase.applicationEvents.length; i++) {
      if (applicationBase.applicationEvents[i].id == applicationEventId) {
        applicationBase.applicationEvents[i].status = newStatus;
        return;
      }
    }
  }

  render() {
    let tableRowData = [];
    let read = ["Expand" , "Collapse"];
    // Include metadata as specified by header. See `buildDashboardTableHeader`.
    this.applicationBase.applicationEvents.sort((x, y) => x.stage_id > y.stage_id);

    tableRowData.push(
      <td>
        <CuteButton
          onClick={() => this.setState({ expand: !this.state.expand })}
        >
          Expand
        </CuteButton>
      </td>
    );

    tableRowData.push(
      <td>
        <CuteButton
          onClick={this.func}
        >
          Share
        </CuteButton>
      </td>
    );


    

    tableRowData.push(<td>{this.applicationBase.job.name}</td>);
    // tableRowData.push(
    //   <td>
    //     <CuteButton 
    //       onClick={() => window.open(this.applicationBase.job.link)}
    //     >Job Link
    //     </CuteButton>
    //   </td>
    // );
    tableRowData.push(<td>{this.applicationBase.job.company.name}</td>);
    // tableRowData.push(<td>{this.applicationBase.job.location}</td>);
    // tableRowData.push(
    //   <td>
    //     <CuteButton 
    //       onClick={() => window.open("http://" + window.location.hostname +":8000/resumes/download?token=" + this.state.token + "&resume_id=" + this.applicationBase.resume_id)}
    //     >{this.applicationBase.resume.name}
    //     </CuteButton>
    //   </td>
    // );

    let tags = [];
    // let jobTags_filtered = this.applicationBase.job.tags.filter((x) =>
    //   this.tagStringMatch(x.tag.tag)
    // );
    let jobTags_filtered = this.applicationBase.job.tags;

    for (let i = 0; i < jobTags_filtered.length; i++) {
      tags.push(
        <DashboardTag>
          {jobTags_filtered[i].tag.tag}
        </DashboardTag>
      ); // left this logic so that all tags are attached to job, this way when filtering other tags will show up that match the filter
    }

    let showTags = []; //create tags to be shown
    for (let x = 0; x < jobTags_filtered.length; x++) {
      //guarantees won't break if total tags < 3
      if (x == 3) {
        showTags.push("..."); //adds this to indicate there are more tags
        x = jobTags_filtered.length; //exists the loop after 3 or total tag length, whichever comes first
      } else {
        showTags.push(tags[x]); //build showTags with tags
        if(x != 2) //so that no comma before ...
          showTags.push(","); // since i took background out
        this.applicationBase.job.showTags = showTags;
      }
    }

    // tableRowData.push(
    //   <td>
    //     <DashboardContainer>{showTags}</DashboardContainer>
    //   </td>
    // );

    // for (let i = 0; i < this.applicationBase.applicationEvents.length; i++) {
    //   let e = this.applicationBase.applicationEvents[i];
    //   tableRowData.push(
    //     <td>
    //       <Icon
    //         id={e.id}
    //         status={e.status}
    //         applicationBaseId={this.applicationBase.id}
    //         token={this.token}
    //         key={e.id}
    //         func={(status) =>
    //           this.updateApplicationStatus(this.applicationBase, e.id, status)
    //         }
    //       />
    //     </td>
    //   );
    // }

    let app = this.applicationBase.applicationEvents;
    let lastEvent, e;
    
    for (let i = 0; i < app.length; i++) {
      e = app[i];
      if (e.status != 0) {
        lastEvent = e;
      }
    }

    if(typeof lastEvent === 'undefined'){//for when u add new job to dashboard
      tableRowData.push(
        <td>
          N/A
        </td>
      )
    }
    else{

      tableRowData.push(
        <td>
          {lastEvent.stage.name}
        </td>
      )

    }
    
    



    let returnData = [<tr>{tableRowData}</tr>];
    let getFrom = this.applicationBase.job;
    if(this.state.expand == true) {
      returnData.push(<tr>
        <td colSpan={5}>
          <div style={{ backgroundColor: "" }}>

          {/* <JobInfo
             job = {this.applicationBase.job}
             dashboardStatus = "chagneLater"
             func={() => null}
             /> */}


            <h3 style={{paddingLeft: 20}}>Job Title: {getFrom.name}</h3>
            <h3 style={{paddingLeft: 20}}>Location: {getFrom.location}</h3>
            <h3 style={{paddingLeft: 20}}>Tags: {getFrom.showTags}</h3>
            <h3 style={{paddingLeft: 20}}>
              <CuteButton
                onClick={() => window.open(this.applicationBase.job.link)}
              >Job Link
              </CuteButton>
            </h3>
          </div>
        </td>
      </tr>)
    }
    return returnData
  }
}

export default DashboardTableRow;
