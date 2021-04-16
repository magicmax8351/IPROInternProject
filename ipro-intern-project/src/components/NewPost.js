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
      company_id: (props.company_id != null) ? props.company_id : -1,
      job_id: props.job_id,
      group_id: (props.force_group != null) ? props.force_group.id : -1,
      jobs: null,
      companies: null,
      groups: null,
      body: props.body,
      dashboard_add: props.dashboard_add,
      new_company_name: null,
      force_group: props.force_group
    };

    this.dropdown_change = this.dropdown_change.bind(this);
    this.renderAddCompany = this.renderAddCompany.bind(this);
    this.renderAddJob = this.renderAddJob.bind(this);
    this.renderWriteBody = this.renderWriteBody.bind(this);
    this.renderListCompany = this.renderListCompany.bind(this);
    this.renderListJob = this.renderListJob.bind(this);
    this.renderChooseGroups = this.renderChooseGroups.bind(this);

    this.enter_company = this.enter_company.bind(this);
    this.enter_job = this.enter_job.bind(this);
    this.enter_body = this.enter_body.bind(this);
    this.enter_group = this.enter_group.bind(this);

    this.enter_new_company_name = this.enter_new_company_name.bind(this);
    this.submitAddCompany = this.submitAddCompany.bind(this);

    this.enter_new_job_name = this.enter_new_job_name.bind(this);
    this.enter_new_job_description = this.enter_new_job_description.bind(this);
    this.enter_new_job_link = this.enter_new_job_link.bind(this);
    this.enter_new_job_location = this.enter_new_job_location.bind(this);
    this.submitAddJob = this.submitAddJob.bind(this);

    this.submitPost = this.submitPost.bind(this);
  }

  componentDidMount() {
    fetch(
      "http://" +
        window.location.hostname +
        ":8000/jobs/get?token=" +
        this.token
    )
      .then((res) => res.json())
      .then((json) => this.setState({ jobs: json }));

    fetch(
      "http://" +
        window.location.hostname +
        ":8000/companies/get?token=" +
        this.token
    )
      .then((res) => res.json())
      .then((json) => this.setState({ companies: json }));

    fetch(
      "http://" +
        window.location.hostname +
        ":8000/group/list?token=" +
        this.token
    )
      .then((res) => res.json())
      .then((json) => this.setState({ groups: json }));
  }

  enter_company(event) {
    this.setState({ company_id: event.target.value });
  }

  enter_job(event) {
    this.setState({ job_id: event.target.value });
  }

  enter_body(event) {
    this.setState({ body: event.target.value });
  }

  enter_new_company_name(event) {
    this.setState({ new_company_name: event.target.value });
  }

  enter_group(event) {
    // parseint() is a hack
    this.setState({ group_id: parseInt(event.target.value) });
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

  dropdown_change(id, event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  }

  submitAddCompany(event) {
    event.preventDefault();
    if (this.state.new_company_name.length > 2) {
      fetch("http://" + window.location.hostname + ":8000/companies/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: this.state.new_company_name,
          token: this.token,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          this.setState({
            companies: [...this.state.companies, json],
            company_id: this.state.companies.length,
          });
        });
    }
  }

  submitAddJob(event) {
    event.preventDefault();
    if (this.state.new_job_name.length > 2 && this.state.company_id > 0) {
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
          token: this.token,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          this.setState({
            jobs: [...this.state.jobs, json],
            job_id: json.id,
          });
        });
    }
  }

  submitPost(event) {
    event.preventDefault();
    if (
      parseInt(this.state.job_id) > 0 &&
      parseInt(this.state.company_id) > 0 &&
      this.state.group_id > 0 &&
      this.state.body.length > 1
    ) {
      let post = {
        body: this.state.body,
        job_id: this.state.job_id,
        token: this.token,
        group_id: this.state.group_id,
      };
      this.func(post);
    } else {
      console.log(this.state);
    }
  }

  renderDropdown(dropdownName, dropdownItems, state_name, func, disabled) {
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
        disabled={disabled}
      >
        {items}
      </Form.Control>
    );
  }

  renderListCompany() {
    if (!this.state.companies) {
      return null;
    }

    let companies = [];
    if (this.state.dashboard_add) {
      for (let i = 0; i < this.state.companies.length; i++) {
        if (this.state.companies[i].id == this.state.company_id) {
          companies.push([
            this.state.companies[i].id,
            this.state.companies[i].name,
          ]);
        }
      }
    } else {
      companies.push([-1, "Please select..."]);
      for (let i = 0; i < this.state.companies.length; i++) {
        companies.push([
          this.state.companies[i].id,
          this.state.companies[i].name,
        ]);
      }

      companies.push([-2, "Add new"]);
    }

    return (
      <Form.Group>
        <Form.Label>Company name:</Form.Label>
        {this.renderDropdown(
          "Companies",
          companies,
          "company_id",
          this.enter_company,
          false
        )}
      </Form.Group>
    );
  }

  renderListJob() {
    if (!this.state.jobs) {
      return null;
    }

    let jobs = [];

    if (this.state.dashboard_add) {
      for (let i = 0; i < this.state.jobs.length; i++) {
        if (this.state.jobs[i].id == this.state.job_id) {
          jobs.push([
            this.state.jobs[i].id,
            this.state.jobs[i].name + " - " + this.state.jobs[i].location,
          ]);
        }
      }
    } else {
      jobs.push([-1, "Please select..."]);

      for (let i = 0; i < this.state.jobs.length; i++) {
        if (this.state.jobs[i].company_id == this.state.company_id) {
          jobs.push([
            this.state.jobs[i].id,
            this.state.jobs[i].name + " - " + this.state.jobs[i].location,
          ]);
        }
      }
      jobs.push([-2, "Add New"]);
    }

    return (
      <Form.Group>
        <Form.Label>Job title:</Form.Label>
        {this.renderDropdown("Jobs", jobs, "job_id", this.enter_job, (this.state.company_id == -1))}
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
              <Form.Control
                onChange={this.enter_new_company_name}
                placeholder="New company name"
              />
            </Form.Group>
          </Form.Row>
          <Button
            variant="primary"
            type="submit"
            onClick={this.submitAddCompany}
          >
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
              <Form.Control
                onChange={this.enter_new_job_name}
                placeholder="Software Engineer Intern"
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Location</Form.Label>
              <Form.Control
                onChange={this.enter_new_job_location}
                placeholder="Chicago"
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Description</Form.Label>
              <Form.Control
                onChange={this.enter_new_job_description}
                placeholder="Engineer new techniques to move money in a big circle"
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Link</Form.Label>
              <Form.Control
                onChange={this.enter_new_job_link}
                placeholder="https://example.com"
              />
            </Form.Group>
          </Form.Row>
          <Button variant="primary" type="submit" onClick={this.submitAddJob}>
            Add job
          </Button>
        </Form>
      );
    }
  }

  renderWriteBody() {
    let value;
    if (this.state.body) {
      value = this.state.body;
    } else {
      value = "";
    }
    //   Markdown editor: https://uiwjs.github.io/react-md-editor/

    return (
      <Form.Group>
        <Form.Label>Body</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          value={this.state.body}
          onChange={this.enter_body}
        />
      </Form.Group>
    );
  }

  renderChooseGroups() {
    if (!this.state.jobs) {
      return null;
    }
    if (!this.state.groups) {
      return null;
    }

    let groups = [[-1, "Please select..."]];

    if (this.state.force_group != null) {
      groups = [[this.state.force_group.id, this.state.force_group.name]];
    } else {
      for (let i = 0; i < this.state.groups.length; i++) {
        if (1) {
          groups.push([this.state.groups[i].id, this.state.groups[i].name]);
        }
      }
    }
    return (
      <Form.Group>
        <Form.Label>Group to Share</Form.Label>
        {this.renderDropdown("Jobs", groups, "job_id", this.enter_group, false)}
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
