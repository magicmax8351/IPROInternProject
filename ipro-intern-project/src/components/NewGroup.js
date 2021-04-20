import React from "react";
import styled from "styled-components";
import MDEditor from "@uiw/react-md-editor";
import ReactDOM from "react-dom";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Cookies from "js-cookie";
import { ActiveUserNotInGroupButton } from "./GroupHeaderCard";

const AddGroupButton = styled(ActiveUserNotInGroupButton)`
padding: 2px 5px 2px 5px;
margin-top: 10px;
margin-left: 0px;

`

class NewGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      desc: null,
      privacy: 0,
    };
    this.submitAddGroup = this.submitAddGroup.bind(this);
    this.func = props.func;
  }

  submitAddGroup(event) {
    event.preventDefault();
    if(this.state.name == null || this.state.desc == null) {
      return;
    }
    

    fetch("http://" + window.location.hostname + ":8000/group/add", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: this.state.name,
        desc: this.state.desc,
        privacy: this.state.privacy,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        this.setState({ 
          name: "", desc: ""
        });
        this.func();
        window.open("/group/" + json.link);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  newUserForm() {
    return (
      <div>
        <Form>
          <Form.Group>
            <Form.Label>Group Name</Form.Label>
            <Form.Control
              required
              value={this.state.name}
              onChange={(event) => this.setState({ name: event.target.value })}
              placeholder="Martin Shray Fan Club"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Group Description</Form.Label>
            <Form.Control
              value={this.state.desc}
              onChange={(event) => this.setState({ desc: event.target.value })}
              as="textarea"
              rows={3}
            />
          </Form.Group>
          <Form.Label>Group Privacy Level</Form.Label>
          <Form.Control
            as="select"
            onChange={(event) => this.setState({ privacy: event.target.value })}
          >
            <option value={0}>Public</option>
            <option value={1}>Unlisted</option>
            <option value={2}>Private</option>
          </Form.Control>
          <AddGroupButton onClick={(event) => this.submitAddGroup(event)}>
            add group
          </AddGroupButton>
        </Form>
      </div>
    );
  }

  render() {
    return this.newUserForm();
  }
}

export default NewGroup;
