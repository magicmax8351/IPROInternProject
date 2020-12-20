import React from "react";
import styled from "styled-components";
import MDEditor from "@uiw/react-md-editor";
import ReactDOM from "react-dom";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { faPlusSquare, faMinusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class NewUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: null,
      email: null,
      lname: null,
      password: null,
      pic: null,
      graddate: null,
      city: null,
      state: null,
      newUser: null
    };

    this.submitAddUser = this.submitAddUser.bind(this);

    this.enter_fname = this.enter_fname.bind(this);
    this.enter_lname = this.enter_lname.bind(this);
    this.enter_email = this.enter_email.bind(this);
    this.enter_pword = this.enter_pword.bind(this);
    this.enter_graddate = this.enter_graddate.bind(this);
    this.confirm_pword = this.confirm_pword.bind(this);
    this.enter_city = this.enter_city.bind(this);
    this.enter_state = this.enter_state.bind(this);
  }

  processNewUser(json) {
    // Parse JSON. 
    // JSON contains a 'user' object and a 'token' object.
    // Save 'token' object as cookie. 
    // TODO
    return
  }

  enter_fname(event) {
    this.setState({ fname: event.target.value });
  }
  enter_lname(event) {
    this.setState({ lname: event.target.value });
  }
  enter_email(event) {
    this.setState({ email: event.target.value });
  }
  enter_graddate(event) {
    this.setState({ graddate: event.target.value });
  }
  enter_pword(event) {
    this.setState({ password: event.target.value });
  }
  confirm_pword(event) {
    return this.state.password === event.target.value;
  }
  enter_city(event) {
    this.setState({ city: event.target.value });
  }
  enter_state(event) {
    this.setState({ state: event.target.value });
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
        pic: "", // Placeholder. Maybe null in account startup?
        graddate: this.state.graddate,
        city: this.state.city,
        state: this.state.state
      })})
    .then((res) => res.json())
    .then((json) => this.setState({ newUser: json.user }))
      .catch((err) => {
        console.error(err);
      });

  }

  newUserForm() {
    return (
      <div>
        <Form novalidate>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>First Name</Form.Label>
              <Form.Control required onChange={this.enter_fname} placeholder="First Name"/>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Last Name</Form.Label>
              <Form.Control required onChange={this.enter_lname} placeholder="Last Name"/>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Email</Form.Label>
              <Form.Control required onChange={this.enter_email} placeholder="jbiden@whitehouse.gov"/>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Graduation Date (MM/YYYY)</Form.Label>
              <Form.Control required onChange={this.enter_graddate} pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" placeholder="2020-08-15"/>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Enter password</Form.Label>
              <Form.Control required type="password" onChange={this.enter_pword} placeholder=""/>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Confirm password</Form.Label>
              <Form.Control required type="password" validator={this.confirm_pword} placeholder="Last Name"/>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>City</Form.Label>
              <Form.Control required onChange={this.enter_city} placeholder="Chicago"/>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>State abbreviation</Form.Label>
              <Form.Control required onChange={this.enter_state} pattern="[A-Z]{2}" placeholder="IL"/>
            </Form.Group>
          </Form.Row>
          <Button variant="primary" type="submit" onClick={this.submitAddUser}>
            Submit
          </Button>
        </Form>
      </div>
    );
  }

  render() {
    return this.newUserForm();
  }
}

export default NewUser;
