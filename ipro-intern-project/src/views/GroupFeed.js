import React from "react";
import PageHeader from "../components/PageHeader";
import PageContent from "../components/PageContent";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import Post from "../components/Post";
import NewPost from "../components/NewPost";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import MDEditor from "@uiw/react-md-editor";
import { faPlusSquare, faMinusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";

// Group ID of -1 given to "main page" - load in posts from all groups
// user is associated with

const AddPostContainer = styled.div`
  background: lightgrey;
  border-radius: 20px;
  padding: 10px;
  margin-left: auto;
  width: 650px;
  margin-right: auto;
`;

const AddPostHeader = styled.h2`
  font-style: italic;
  font-size: 28px;
  font-family: "Open Sans", sans-serif;
  margin-left: 10px;
`;

const AddPostButton = styled.button`
  border: none;
  position: absolute;
  margin-left: 580px;
  margin-top: -48px;
  border-radius: 10px;
  font-size: 30px;
  background-color: none;
`;

const FeedContianer = styled.div`
  margin-top: 20px;
  width: 700px;
`;

class GroupFeed extends React.Component {
  constructor(props) {
    super(props);
    if (props.location == "feed") {
      this.group_id = -1;
    } else {
      const regex = /\/id\/[0-9]+/;
      let match = props.location.pathname.match(regex)[0];
      this.group_id = parseInt(match.substring(4));
    }

    this.state = {
      ready: 0,
      posts: [],
      comments: [],
      group: null,
      newPost: 0,
      token: Cookies.get("token"),
      group: {
        name: null,
        desc: null,
      },
    };
    this.newPostButton = this.newPostButton.bind(this);
    this.renderNewPost = this.renderNewPost.bind(this);
    this.submitPost = this.submitPost.bind(this);
    this.postList = this.postList.bind(this);
    this.newPosts = [];

    if (this.group_id == -1) {
      this.state.group = {
          name: "All posts",
          desc: "Your News Feed",
        }
    }
  }

  newPostButton() {
    this.setState({ newPost: !this.state.newPost });
  }

  componentDidMount() {
    fetch("http://wingman.justinjschmitz.com:8000/token/test?token=" + this.state.token)
      .then((res) => res.json())
      .then((json) => this.setState({ token: json.result }));

    fetch("http://wingman.justinjschmitz.com:8000/posts/get?token=" + this.state.token)
      .then((res) => res.json())
      .then((json) => {
        let posts_update = json.posts.map(x => {
          const obj = {
            ...x,
            key: x.id
          };
          delete obj.id;
          return obj;
        });
        this.setState({ posts: json.posts })
      });

    if (this.group_id != -1) {
      fetch("http://wingman.justinjschmitz.com:8000/groups/get_id?group_id=" + this.group_id)
        .then((res) => res.json())
        .then((json) => this.setState({ group: json }));
    }
  }

  postList(in_posts) {
    let out_posts = [];
    let group_posts = null;

    if (this.group_id != -1) {
      group_posts = in_posts.filter((post) => post.group.id == this.group_id);
    } else {
      group_posts = in_posts;
    }

    for (let i = 0; i < group_posts.length; i++) {
      out_posts.push(
        <Post
          post={group_posts[i]}
          key={group_posts[i].id}
          token={this.state.token}
        />
      );
    }
    return out_posts;
  }

  renderNewPost() {
    if (this.state.newPost) {
      return <NewPost func={this.submitPost} token={this.state.token} />;
    } else {
      return (
        <AddPostButton onClick={this.newPostButton}>
          <FontAwesomeIcon icon={faPlusSquare}></FontAwesomeIcon>
        </AddPostButton>
      );
    }
  }

  submitPost(post) {
    fetch("http://wingman.justinjschmitz.com:8000/posts/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    })
      .then((res) => res.json())
      .then((json) => {
        let posts_update = [json, ...this.state.posts].map(x => {
          const obj = {
            ...x,
            key: x.id
          };
          delete obj.id;
          return obj;
        });
        this.setState({ posts: posts_update });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  render() {
    if (!this.state.token) {
      console.log("Token invalid! redirect to login page");
      console.log(this.state.token);
      document.location.replace("/login");
    }
    this.renderedPosts = this.postList(this.state.posts);
    console.log(this.state.posts);
    return (
      <div>
        <Helmet>
          <title>Home</title>
        </Helmet>
        <PageHeader title={this.state.group.name} />
        <FeedContianer>
          <AddPostContainer>
            <AddPostHeader>Add a new post...</AddPostHeader>
            {this.renderNewPost()}
          </AddPostContainer>
          <PageContent>{this.renderedPosts}</PageContent>
        </FeedContianer>
      </div>
    );
  }
}

export default GroupFeed;
