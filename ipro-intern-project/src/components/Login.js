import React from "react";
import styled from "styled-components";
import MDEditor from "@uiw/react-md-editor";
import ReactDOM from "react-dom";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Cookies from "js-cookie";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null
    };

    this.submitLogin = this.submitLogin.bind(this);
    this.enter_email = this.enter_email.bind(this);
    this.enter_pword = this.enter_pword.bind(this);
  }

  processLogin(json) {
    Cookies.set("token", json.token.val, { expires: 15 });
    Cookies.set("fname", json.user.fname, { expires: 15 });
    document.location.replace("/");
    return
  }

  enter_email(event) {
    this.setState({ email: event.target.value });
  }

  enter_pword(event) {
    this.setState({ password: event.target.value });
  }

  
  submitLogin(event) {
    event.preventDefault()
    fetch("http://wingman.justinjschmitz.com:8000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: this.state.password,
        email: this.state.email,
      })})
    .then((res) => res.json())
    .then((json) => this.processLogin(json))
    .catch((err) => {
      console.error(err);
      });

  }

  loginForm() {
    return (
      <div>
        <Form>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" required onChange={this.enter_email} placeholder="jbiden@whitehouse.gov"/>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Enter password</Form.Label>
              <Form.Control required type="password" onChange={this.enter_pword} placeholder=""/>
            </Form.Group>
          </Form.Row>
          <Button variant="primary" type="submit" onClick={this.submitLogin}>
            Submit
          </Button>
        </Form>
      </div>
    );
  }

  render() {
    return this.loginForm();
  }
}

export default Login;
