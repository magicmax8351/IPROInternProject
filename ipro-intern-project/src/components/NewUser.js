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

    this.submitAddUser = this.submitAddUser.bind(this);

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

  render() {
    return (
      <div>
        <Form>
          <Button variant="primary" type="submit" onClick={this.submitAddUser}>
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

export default NewPost;
