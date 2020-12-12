import React from "react";
import styled from "styled-components";
import MDEditor from "@uiw/react-md-editor";
import ReactDOM from "react-dom";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { faPlusSquare, faMinusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Logic for adding posts is broken.
// Use https://formik.org/docs/overview to handle adding things to the database.

class NewUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      fname: null,
      lname: null,
      password: null,
      pic: null,
      graddate: null,
      city: null,
      state: null,
      newUser: null
    };
  }

  processNewUser(json) {
    // Parse JSON. 
    // JSON contains a 'user' object and a 'token' object.
    // Save 'token' object as cookie. 
    // TODO
    return
  }
  submitAddUser(event) {
    event.preventDefault()
    fetch("http://localhost:8000/users/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fname: this.state.fname,
        lname: this.state.lname,
        password: this.state.password,
        email: this.state.email,
        pic: this.state.pic,
        graddate: this.state.graddate,
        city: this.state.city,
        state: this.state.state
      })})
    .then((res) => res.json())
    .then((json) => this.setState({ newUser: json.user }))
      .catch((err) => {
        console.error(err);
      });

    this.componentDidMount();
  }

  submitAddJob(event) {
    event.preventDefault()
    if(this.state.new_job_name.length > 2 && this.state.company_id > 0 ) {
      fetch("http://localhost:8000/jobs/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: this.state.new_job_name,
          description: this.state.new_job_description,
          location: this.state.new_job_location,
          company_id: this.state.company_id
        }),
      })
        .then((response) => {
          this.componentDidMount();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  submitPost(event) {
    event.preventDefault();
    if (
      this.state.job_id > 0 &&
      this.state.company_id > 0 &&
      this.state.group_id > 0 &&
      this.state.body.length > 1 &&
      this.state.subject.length > 1
    ) {
      let post = {
        subject: this.state.subject,
        body: this.state.body,
        job_id: this.state.job_id,
        user_id: 15,
        group_id: this.state.group_id
      };
      this.func(post);
    }
  }

  renderDropdown(dropdownName, dropdownItems, state_name, func) {
    let items = [];
    let item = 0;
    for (var i = 0; i < dropdownItems.length; i++) {
      item = dropdownItems[i];
      items.push(<option value={item[0]}>{item[1]}</option>);
    }

    return (
      <Form.Control
        as="select"
        onChange={func}
        name={dropdownName}
        id={state_name}
      >
        {items}
      </Form.Control>
    );
  }

  renderListCompany() {
    if (!this.state.companies) {
      return null;
    }
    let companies = [[-1, "Please select..."]];
    for (let i = 0; i < this.state.companies.length; i++) {
      companies.push([
        this.state.companies[i].id,
        this.state.companies[i].name,
      ]);
    }

    companies.push([-2, "Add new"])

    return (
      <Form.Group controlId="companyID">
        <Form.Label>Company name:</Form.Label>
        {this.renderDropdown(
          "Companies",
          companies,
          "company_id",
          this.enter_company
        )}
      </Form.Group>
    );
  }

  renderListJob() {
    if (!this.state.jobs) {
      return null;
    }
    let jobs = [[-1, "Please select..."]];
    if (this.state.company_id === -1) {
      return null;
    }

    for (let i = 0; i < this.state.jobs.length; i++) {
      if (this.state.jobs[i].company_id == this.state.company_id) {
        jobs.push([
          this.state.jobs[i].id,
          this.state.jobs[i].name + " - " + this.state.jobs[i].location,
        ]);
      }
    }
    jobs.push([-2, "Add New"]);
    return (
      <Form.Group controlId="jobID">
        <Form.Label>Job title:</Form.Label>
        {this.renderDropdown("Jobs", jobs, "job_id", this.enter_job)}
      </Form.Group>
    );
  }

  renderAddCompany() {
    if (this.state.company_id != -2) {
      return null;
    } else {
      return (
        <Form>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Company Name</Form.Label>
              <Form.Control onChange={this.enter_new_company_name} placeholder="New company name" />
            </Form.Group>
            {/* <Form.Group as={Col}>
              <Form.Label>Company Sector</Form.Label>
              <Form.Control as="select">
                <option>Big Tech</option>
                <option>Social Media</option>
                <option>Trading</option>
                <option>Banking</option>
                <option>Whatever Oracle does</option>
              </Form.Control>
            </Form.Group> */}
          </Form.Row>
          <Button variant="primary" type="submit" onClick={this.submitAddCompany}>
            Add company
          </Button>
        </Form>
      );
    }
  }

  submitForm(event) {
    event.preventDefault();
    const form = event.currentTarget;
  }

  renderAddJob() {
    if (this.state.job_id != -2) {
      return null;
    } else {
      return (
        <Form>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Job title</Form.Label>
              <Form.Control onChange={this.enter_new_job_name} placeholder="Software Engineer Intern" />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Location</Form.Label>
              <Form.Control onChange={this.enter_new_job_location} placeholder="Chicago" />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Description</Form.Label>
              <Form.Control onChange={this.enter_new_job_description} placeholder="Engineer new techniques to move money in a big circle"/>
            </Form.Group>
          </Form.Row>
          <Button variant="primary" type="submit" onClick={this.submitAddJob}>
            Add job
          </Button>
        </Form>
      );
    }
  }

  renderWriteSubject() {
    if (this.state.job_id !== -1 && this.state.company_id !== -1) {
      return (
        <Form.Group>
          <Form.Label>Subject</Form.Label>
          <Form.Control
            placeholder="Money is good, people are not. Avoid."
            maxLength="140"
            onChange={this.enter_subject}
          />
        </Form.Group>
      );
    } else {
      return null;
    }
  }

  renderWriteBody() {
    let value = "";


    let id = "body";

    //   Markdown editor: https://uiwjs.github.io/react-md-editor/

    if (this.state.job_id !== -1 && this.state.company_id !== -1) {
      return (
        <Form.Group>
          <Form.Label>Body</Form.Label>
          <MDEditor id="body" value={value} onChange={this.enter_body} />
          <MDEditor.Markdown source={value} />
        </Form.Group>
      );
    } else {
      return null;
    }
  }

  renderChooseGroups() {
    if (!this.state.jobs) {
      return null;
    }
    if (!this.state.groups) {
      return null;
    }

    let groups = [[-1, "Please select..."]];

    for (let i = 0; i < this.state.groups.length; i++) {
      if (1) {
        groups.push([this.state.groups[i].id, this.state.groups[i].name]);
      }
    }
    return (
      <Form.Group controlId="jobID">
        <Form.Label>Group to Share</Form.Label>
        {this.renderDropdown("Jobs", groups, "job_id", this.enter_group)}
      </Form.Group>
    );
  }

  render() {
    //   const [value, setValue] = React.useState("**Hello world!!!**");
    return (
      <div>
        <Form>
          {this.renderListCompany()}
          {this.renderAddCompany()}
          {this.renderListJob()}
          {this.renderAddJob()}
          {this.renderWriteSubject()}
          {this.renderWriteBody()}
          {this.renderChooseGroups()}
          <Button variant="primary" type="submit" onClick={this.submitPost}>
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

export default NewPost;
