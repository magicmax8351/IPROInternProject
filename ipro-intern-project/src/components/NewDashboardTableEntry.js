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

class NewDashboardTableEntry extends React.Component {
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
      new_company_name: null
    };
    this.enter_company = this.enter_company.bind(this);
    this.enter_new_company_name = this.enter_new_company_name.bind(this);
    this.submitAddCompany = this.submitAddCompany.bind(this);

    this.enter_job = this.enter_job.bind(this);
    this.enter_new_job_name = this.enter_new_job_name.bind(this);
    this.enter_new_job_description = this.enter_new_job_description.bind(this);
    this.enter_new_job_link = this.enter_new_job_link.bind(this);
    this.enter_new_job_location = this.enter_new_job_location.bind(this);
    this.submitAddJob = this.submitAddJob.bind(this);
    
    this.enter_resume = this.enter_resume.bind(this);
    this.enter_new_resume_name = this.enter_new_resume_name.bind(this);
    this.enter_new_resume_file = this.enter_new_resume_file.bind(this);
    this.submitAddResume = this.submitAddResume.bind(this);
  }

  componentDidMount() {
    fetch("http://" + window.location.hostname + ":8000/jobs/get?token=" + this.token)
      .then((res) => res.json())
      .then((json) => this.setState({ jobs: json }));

    fetch("http://" + window.location.hostname + ":8000/companies/get?token=" + this.token)
      .then((res) => res.json())
      .then((json) => this.setState({ companies: json }));

    fetch("http://" + window.location.hostname + ":8000/resumes/get?token=" + this.token)
      .then((res) => res.json())
      .then((json) => this.setState({ resumes: json }));
  }

  enter_company(event) {
    this.setState({ company_id: event.target.value });
  }

  enter_job(event) {
    this.setState({ job_id: event.target.value });
  }

  enter_resume(event) {
    this.setState({ resume_id: event.target.value });
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

  enter_new_job_link(event) {
    this.setState({ new_job_link: event.target.value });
  }

  enter_new_job_location(event) {
    this.setState({ new_job_location: event.target.value });
  }

  enter_new_resume_name(event) {
    this.setState({ new_resume_name: event.target.value });
  }

  enter_new_resume_file(event) {
    this.setState({ new_resume_file: event.target.files[0], new_resume_name: event.target.files[0].name });
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
          company_id: json.id,
          job_id: 0
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
          link: this.state.new_job_link,
          location: this.state.new_job_location,
          company_id: this.state.company_id,
          token: this.token
        }),
      })
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          jobs: [...this.state.jobs, json],
          job_id: json.id
        });
      });
    }
  }

  submitAddResume(event) {
    event.preventDefault();

    let resume_name = this.state.new_resume_name;
    if(resume_name == undefined || resume_name.length <= 2) {
      resume_name = "Untitled Resume";
    }

    if(this.state.new_resume_file != null) {
      let form = new FormData();
      form.append("resume", this.state.new_resume_file);
      fetch("http://" + window.location.hostname + ":8000/resumes/upload", {
        method: "POST",
        body: form
      })
      .then((res) => res.json())
      .then((json) => {
        fetch("http://" + window.location.hostname + ":8000/resumes/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: resume_name,
            filename: json.filename,
            token: this.token
          }),
        })
        .then((res) => res.json())
        .then((json) => {
          this.setState({
            resumes: [...this.state.resumes, json],
            resume_id: json.id
          });
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

  renderListResume() {
    if (!this.state.resumes) {
      return null;
    }
    let resumes = [[-1, "Please select..."]];

    for (let i = 0; i < this.state.resumes.length; i++) {
      resumes.push([
        this.state.resumes[i].id,
        this.state.resumes[i].name,
      ]);
    }
    resumes.push([-2, "Add New"]);

    return(
      <Form.Group>
        <Form.Label>Resume:</Form.Label>
        {this.renderDropdown("Resumes", resumes, "resume_id", this.enter_resume)}
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
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Link</Form.Label>
              <Form.Control onChange={this.enter_new_job_link} placeholder="https://example.com"/>
            </Form.Group>
          </Form.Row>
          <Button variant="primary" type="submit" onClick={this.submitAddJob}>
            Add job
          </Button>
        </Form>
      );
    }
  }

  renderAddResume() {
    if(this.state.resume_id != -2) {
      return null;
    } else {
      return(
        <Form>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Resume Name</Form.Label>
              <Form.Control onChange={this.enter_new_resume_name} placeholder="New resume name" value={this.state.new_resume_name} />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Resume File</Form.Label>
              <Form.Control onChange={this.enter_new_resume_file} type="file" />
            </Form.Group>
          </Form.Row>
          <Button variant="primary" type="submit" onClick={this.submitAddResume}>
            Add resume
          </Button>
        </Form>
      );
    }
  }

  submitForm(event) {
    event.preventDefault();
    const form = event.currentTarget;
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
          {this.renderListResume()}
          {this.renderAddResume()}
          <Button variant="primary" type="submit" onClick={(event) => { event.preventDefault(); return this.func(this.state.job_id, this.state.resume_id); }}>
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

export default NewDashboardTableEntry;
