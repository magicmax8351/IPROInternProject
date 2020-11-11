import React from "react";
import styled from "styled-components";
import MDEditor from "@uiw/react-md-editor";
import ReactDOM from "react-dom";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button"

import { faPlusSquare, faMinusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class NewPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      company_id: -1,
      job_id: -1,
    };

    this.post = {
      post_title: "Bad Corporate Culture Alert: The Dangers of A Boring Bank",
      post_body:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. \n\nNemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. \n\nNeque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
      post_author: "Justin Schmitz",
      post_timestamp: "2009-06-15",
    };

    this.dropdown_change = this.dropdown_change.bind(this);
    this.renderAddCompany = this.renderAddCompany.bind(this);
    this.renderAddJob = this.renderAddJob.bind(this);
    this.renderWriteSubject = this.renderWriteSubject.bind(this);
    this.renderWriteBody = this.renderWriteBody.bind(this);
    this.renderListCompany = this.renderListCompany.bind(this);
    this.renderListJob = this.renderListJob.bind(this);
    this.renderChooseGroups = this.renderChooseGroups.bind(this);

    this.companies = [
      {
        company_id: 0,
        company_name: "JPMorgan Chase",
      },
      {
        company_id: 1,
        company_name: "Microsoft",
      },
      {
        company_id: 2,
        company_name: "Google",
      },
      {
        company_id: 3,
        company_name: "Ocient",
      },
    ];

    this.jobs = [
      {
        job_name: "Software Engineer Intern",
        location: "Chicago, IL",
        company_id: 0,
      },
      {
        job_name: "Software Engineer Intern",
        location: "Seattle, WA",
        company_id: 1,
      },
      {
        job_name: "Software Engineer Intern",
        location: "Redmond, WA",
        company_id: 2,
      },
      {
        job_name: "Software Engineer Intern",
        location: "Sheboygan, WI",
        company_id: 3,
      },
    ];
  }

  dropdown_change(event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  }

  renderDropdown(dropdownName, dropdownItems, state_name) {
    let items = [];
    let item = 0;
    for (var i = 0; i < dropdownItems.length; i++) {
      item = dropdownItems[i];
      items.push(<option value={item[0]}>{item[1]}</option>);
    }

    return (
      <Form.Control
        as="select"
        onChange={this.dropdown_change}
        name={dropdownName}
        id={state_name}
      >
        {items}
      </Form.Control>
    );
  }

  renderListCompany() {
    let companies = [[-1, "Please select..."]];
    for (let i = 0; i < this.companies.length; i++) {
      companies.push([
        this.companies[i].company_id,
        this.companies[i].company_name,
      ]);
    }

    companies.push([-2, "Add New"]);

    return (
      <Form.Group controlId="companyID">
        <Form.Label>Company name:</Form.Label>
        {this.renderDropdown("Companies", companies, "company_id")}
      </Form.Group>
    );
  }

  renderListJob() {
    let jobs = [[-1, "Please select..."]];
    if (this.state.company_id === -1) {
        return null;
    }

    for (let i = 0; i < this.jobs.length; i++) {
      if (this.jobs[i].company_id == this.state.company_id) {
        jobs.push([
          this.jobs[i].job_id,
          this.jobs[i].job_name + " - " + this.jobs[i].location,
        ]);
      }
    }
    jobs.push([-2, "Add New"]);
    return (
      <Form.Group controlId="jobID">
        <Form.Label>Job title:</Form.Label>
        {this.renderDropdown("Jobs", jobs, "job_id")}
      </Form.Group>
    );
  }

  renderAddCompany() {
    if (this.state.company_id != -2) {
      return null;
    } else {
      return (
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Company Name</Form.Label>
            <Form.Control placeholder="Job title" />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Company Sector</Form.Label>
            <Form.Control as="select">
              <option>Big Tech</option>
              <option>Social Media</option>
              <option>Trading</option>
              <option>Banking</option>
              <option>Whatever Oracle does</option>
            </Form.Control>
          </Form.Group>
        </Form.Row>
      );
    }
  }

  renderAddJob() {
    if (this.state.job_id != -2) {
      return null;
    } else {
      return (
        <Form.Row>
            <Form.Group as={Col}>
                <Form.Label>Job title</Form.Label>
                <Form.Control placeholder="Software Engineer Intern"/>
            </Form.Group>
            <Form.Group as={Col}>
                <Form.Label>City</Form.Label>
                <Form.Control placeholder="Chicago"/>
            </Form.Group>
            <Form.Group as={Col}>
                <Form.Label>State</Form.Label>
                <Form.Control placeholder="IL"/>
            </Form.Group>
          </Form.Row>
      );
    }
  }

  renderWriteSubject() {
    if (this.state.job_id !== -1 && this.state.company_id !== -1) {
        return (
        <Form.Group>
            <Form.Label>Subject</Form.Label>
            <Form.Control placeholder="Money is good, people are not. Avoid." maxLength="140"/>
        </Form.Group>
        );
    } else {
        return null;
    }
  }

  renderWriteBody() {
    let value = "";
    let setValue = "";

    //   Markdown editor: https://uiwjs.github.io/react-md-editor/

    if (this.state.job_id !== -1 && this.state.company_id !== -1) {
      return (
        <Form.Group>
            <Form.Label>Body</Form.Label>
                <MDEditor value={value} onChange={setValue} />
                <MDEditor.Markdown source={value} />
        </Form.Group>
      );
    } else {
      return null;
    }
  }

  renderChooseGroups() {
    if (this.state.job_id !== -1 && this.state.company_id !== -1) {
        return (
        <Form.Group>
            <Form.Label>Select Groups to Share</Form.Label>
            <Form.Control as="select" multiple>
            <option>ACM-W</option>
            <option>AEPKS</option>
            <option>Phi Kappa Sigma International</option>
            <option>International Society of Weenie Hut Jr. </option>
            </Form.Control>
        </Form.Group>
        );
    } else {
        return null;
    }
  }

  render() {
    //   const [value, setValue] = React.useState("**Hello world!!!**");
    return (
      <div>
        <h2>Add New Post</h2>
        <Form>
          {this.renderListCompany()}
          {this.renderAddCompany()}
          {this.renderListJob()}
          {this.renderAddJob()}
          {this.renderWriteSubject()}
          {this.renderWriteBody()}
          {this.renderChooseGroups()}
          <Button variant="primary" type="submit">
    Submit
  </Button>
        </Form>
      </div>
    );
  }
}

export default NewPost;
