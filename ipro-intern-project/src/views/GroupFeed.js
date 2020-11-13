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
    let start = props.location.pathname.search("id");
    this.group_id = parseInt(props.location.pathname.substring(start + 3, start + 100))

    this.state = {
      ready: 0,
      posts: [],
      comments: [],
      group: null
    };
  }

  componentDidMount() {
    fetch("http://localhost:8000/posts/get")
      .then((res) => res.json())
      .then((json) => this.setState({ posts: json.posts }));

    fetch("http://localhost:8000/comments/get")
      .then((res) => res.json())
      .then((json) => this.setState({ comments: json }));

    fetch("http://localhost:8000/groups/get_id?group_id=" + this.group_id)
      .then((res) => res.json())
      .then((json) => this.setState({ group: json }));
  }

  postList(in_posts, in_comments) {
    let out_posts = [];
    console.log(in_comments.comments);

    if(!in_comments.comments){
      return null;
    }
    let group_posts = null;
    if(this.group_id != -1) {
      group_posts = in_posts.filter((post) => post.group_id == this.group_id);
    } else {
      group_posts = in_posts;
    }
    for (let i = 0; i < group_posts.length; i++) {
      out_posts.push(<Post 
        post={group_posts[i]}
        comments={in_comments.comments.filter((comment) => comment.post_id == group_posts[i].id)} />);
    }
    return out_posts;
  }

  render() {
    if(!this.state.group) {
      return null;
    }
    return (
      <div>
        <Helmet>
          <title>Home</title>
        </Helmet>
        <PageHeader title={this.state.group.name} />
        <h1>{this.state.group.desc}</h1>
        <PageContent>{this.postList(this.state.posts, this.state.comments)}</PageContent>
      </div>
    );
  }
}

export default GroupFeed;
