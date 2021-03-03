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

class NewPost extends React.Component {
  constructor(props) {
    super(props);
    this.func = props.func;
    this.token = props.token;
    this.state = {
      company_id: 1,
      job_id: 0,
      jobs: null,
      companies: null,
      groups: null,
      body: null,
      subject: null,
      new_company_name: null
    };
    this.enter_company = this.enter_company.bind(this);
    this.enter_new_company_name = this.enter_new_company_name.bind(this);
    this.submitAddCompany = this.submitAddCompany.bind(this);

    this.enter_job = this.enter_job.bind(this);
    this.enter_new_job_name = this.enter_new_job_name.bind(this);
    this.enter_new_job_description = this.enter_new_job_description.bind(this);
    this.enter_new_job_location = this.enter_new_job_location.bind(this);
    this.submitAddJob = this.submitAddJob.bind(this);
    
  }



  componentDidMount() {
    fetch("http://" + window.location.hostname + ":8000/jobs/get?token=" + this.token)
      .then((res) => res.json())
      .then((json) => this.setState({ jobs: json }));

    fetch("http://" + window.location.hostname + ":8000/companies/get?token=" + this.token)
      .then((res) => res.json())
      .then((json) => this.setState({ companies: json }));
  }

  enter_company(event) {
    this.setState({ company_id: event.target.value });
  }

  enter_job(event) {
    this.setState({ job_id: event.target.value });
  }

  enter_new_company_name(event) {
    this.setState({ new_company_name: event.target.value });
  }

  enter_new_job_name(event) {
    this.setState({ new_job_name: event.target.value });
  }

  enter_new_job_description(event) {
    this.setState({ new_job_description: event.target.value });
  }

  enter_new_job_location(event) {
    this.setState({ new_job_location: event.target.value });
  }

  submitAddCompany(event) {
    event.preventDefault()
    if(this.state.new_company_name.length > 2) {
      fetch("http://" + window.location.hostname + ":8000/companies/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: this.state.new_company_name,
          token: this.token
        }),
      })
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          companies: [...this.state.companies, json],
          company_id: this.state.companies.length
        });
      });
    }
  }

  submitAddJob(event) {
    event.preventDefault()
    if(this.state.new_job_name.length > 2 && this.state.company_id > 0 ) {
      fetch("http://" + window.location.hostname + ":8000/jobs/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: this.state.new_job_name,
          description: this.state.new_job_description,
          location: this.state.new_job_location,
          company_id: this.state.company_id,
          token: this.token
        }),
      })
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          jobs: [...this.state.jobs, json],
          job_id: this.state.jobs.length
        });
      });
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
      <Form.Group>
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
      <Form.Group>
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


  render() {
    //   const [value, setValue] = React.useState("**Hello world!!!**");
    return (
      <div>
        <Form>
          {this.renderListCompany()}
          {this.renderAddCompany()}
          {this.renderListJob()}
          {this.renderAddJob()}
          <Button variant="primary" type="submit" onClick={(event) => { event.preventDefault(); return this.func(this.state.job_id); }}>
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

export default NewPost;
