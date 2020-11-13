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
      comments: []
    };
  }

  componentDidMount() {
    fetch("http://localhost:8000/posts/get")
      .then((res) => res.json())
      .then((json) => this.setState({ posts: json.posts }));

    fetch("http://localhost:8000/comments/get")
      .then((res) => res.json())
      .then((json) => this.setState({ comments: json }));
  }

  postList(in_posts, in_comments) {
    let out_posts = [];
    console.log(in_comments.comments);

    if(!in_comments.comments){
      return null;
    }
    for (let i = 0; i < in_posts.length; i++) {
      out_posts.push(<Post 
        post={in_posts[i]}
        comments={in_comments.comments.filter((comment) => comment.post_id == in_posts[i].id)} />);
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
        <PageContent>{this.postList(this.state.posts, this.state.comments)}</PageContent>
      </div>
    );
  }
}

export default GroupFeed;
