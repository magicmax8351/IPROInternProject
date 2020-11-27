import React from "react";
import PageHeader from "../components/PageHeader";
import PageContent from "../components/PageContent";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import Post from "../components/Post";
import NewPost from "../components/NewPost"

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import MDEditor from "@uiw/react-md-editor";
import { faPlusSquare, faMinusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  font-family: 'Open Sans', sans-serif;
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
    this.postList = this.postList.bind(this);
    if (props.location == "feed") {
      this.group_id = -1;
    } else {
      let start = props.location.pathname.search("id");
      this.group_id = parseInt(
        props.location.pathname.substring(start + 3, start + 100)
      );
    }

    this.state = {
      ready: 0,
      posts: [],
      comments: [],
      group: null,
      newPost: 0,
      updatedPost: 0
    };
    this.newPostButton = this.newPostButton.bind(this);
    this.renderNewPost = this.renderNewPost.bind(this);
    this.feedView = this.feedView.bind(this);
    this.submitPost = this.submitPost.bind(this);
    this.postList = this.postList.bind(this);
    this.newPosts = [];

    this.renderedPosts = null;
  }

  newPostButton() {
    this.setState({newPost: !this.state.newPost})
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
    if (!in_comments.comments) {
      return null;
    }
    let group_posts = null;
    if (this.group_id != -1) {
      group_posts = in_posts.filter((post) => post.group_id == this.group_id);
    } else {
      group_posts = in_posts;
      }

    console.log(group_posts);
    
    for (let i = 0; i < group_posts.length; i++) {
      out_posts.push(
        <Post
          post={group_posts[i]}
          comments={in_comments.comments.filter(
            (comment) => comment.post_id == group_posts[i].id
          )}
          key={i}
        />
      );
    }
    this.renderedPosts = out_posts;
  }

  renderNewPost() {
    if(this.state.newPost) {
      return <NewPost func={this.submitPost}/>
    } else {
      return <AddPostButton onClick={this.newPostButton}>
      <FontAwesomeIcon icon={faPlusSquare}></FontAwesomeIcon>
    </AddPostButton>
    }
  }

  submitPost(post) {
    fetch("http://localhost:8000/posts/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    })
      .then((res) => res.json())
      .then((json) => this.setState({ posts: [json, ...this.state.posts]}))
      .then(() => this.renderedPosts = null)
      .then(() => this.setState({ updatedPost: 1 }))
      .catch((err) => {
        console.error(err);
      });
  }

  render() {
    this.feedView();

    if (!this.state.group) {
      return null;
    }
    
    if(!this.state.updatedPost){ 
      this.postList(this.state.posts, this.state.comments);
    } else {
      this.setState({updatedPost: 0})
    }
    return (
      <div>
        <Helmet>
          <title>Home</title>
        </Helmet>

        <PageHeader title={this.state.group.name} />
        <FeedContianer>

          {/* Add new post:  */}

          <AddPostContainer>
            <AddPostHeader>Add a new post...</AddPostHeader>
          {this.renderNewPost()}
          </AddPostContainer>
          <PageContent>
            {this.renderedPosts}
          </PageContent>
        </FeedContianer>
      </div>
    );
  }
  feedView() {
    if(this.group_id == -1 && !this.state.group) {
      this.setState({
        group: {
          name: "All posts", 
          desc: "Your News Feed"
        }});
    }
  }
}

export default GroupFeed;
