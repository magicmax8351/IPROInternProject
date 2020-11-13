import React from "react";
import PageHeader from "../components/PageHeader";
import PageContent from "../components/PageContent";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import Post from "../components/Post";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import MDEditor from "@uiw/react-md-editor";
import { faPlusSquare, faMinusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class GroupFeed extends React.Component {
  constructor(props) {
    super(props);
    this.postList = this.postList.bind(this);
    this.state = {
      ready: 0,
      posts: [],
    };
  }

  componentDidMount() {
    fetch("http://localhost:8000/posts/get")
      .then((res) => res.json())
      .then((json) => this.setState({ posts: json.posts }));
  }

  postList(in_posts) {
    let out_posts = [];
    for (let i = 0; i < in_posts.length; i++) {
      out_posts.push(<Post data={in_posts[i]} />);
    }
    return out_posts;
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <Helmet>
          <title>Home</title>
        </Helmet>
        <PageHeader title="Group Page" />
        <PageContent>{this.postList(this.state.posts)}</PageContent>
      </div>
    );
  }
}

export default GroupFeed;
