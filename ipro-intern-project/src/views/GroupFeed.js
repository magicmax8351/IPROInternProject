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
  margin-bottom: 10px;
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

const FeedContainer = styled.div`
  margin-top: 20px;
  width: 650px;
  margin-left: 30px;
`;

const SearchContainer = styled.div`
  background: lightgrey;
  border-radius: 20px;
  padding: 10px;
  margin-bottom: 10px;
`;

const SearchInput = styled.input`
  display: block;
  position: absolute;
  margin-top: -40px;
  margin-left: 120px;
`;

const SearchHeader = styled.h2`
  font-style: italic;
  font-size: 28px;
  font-family: "Open Sans", sans-serif;
  margin-left: 10px;
`;

class GroupFeed extends React.Component {
  constructor(props) {
    super(props);
    if (document.location.pathname.includes("id")) {
      const regex = /\/id\/[0-9]+/;
      let match = document.location.pathname.match(regex)[0];
      this.group_id = parseInt(match.substring(4));
    } else {
      this.group_id = -1;
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
      start_id: -1,
      filter: ""
    };
    this.count = 10;

    this.newPostButton = this.newPostButton.bind(this);
    this.renderNewPost = this.renderNewPost.bind(this);
    this.submitPost = this.submitPost.bind(this);
    this.postList = this.postList.bind(this);
    this.getMorePosts = this.getMorePosts.bind(this);
    this.getMorePostsButton = this.getMorePostsButton.bind(this);

    this.enter_filter = this.enter_filter.bind(this);
    this.filterStringMatch = this.filterStringMatch.bind(this);
    this.filterPost = this.filterPost.bind(this);

    if (this.group_id == -1) {
      this.state.group = {
        name: "All posts",
        desc: "Your News Feed",
      };
    }
  }

  newPostButton() {
    this.setState({ newPost: !this.state.newPost });
  }

  enter_filter(event) {
    this.setState({ filter: event.target.value });
  }

  componentDidMount() {
    this.getMorePosts();
    if (this.group_id != -1) {
      fetch(
        "http://" +
          window.location.hostname +
          ":8000/groups/get_id?group_id=" +
          this.group_id
      )
        .then((res) => res.json())
        .then((json) => this.setState({ group: json }));
    }
  }

  getMorePosts() {
    fetch(
      "http://" +
        window.location.hostname +
        ":8000/posts/get?token=" +
        this.state.token +
        "&count=" +
        this.count +
        "&start_id=" +
        this.state.start_id +
        "&group_id=" +
        this.group_id
    )
      .then((res) => {
        if (res.status != 200) {
          window.location.replace("/login");
        }
        return res.json();
      })
      .then((json) => {
        let posts_update = [...this.state.posts, ...json.posts];
        this.setState({
          posts: posts_update,
          start_id: posts_update[posts_update.length - 1].id,
        });
      });
  }

  filterPost(post) {
    let filter_targets = [post.subject, post.body, post.job.name, post.job.location,
                          post.job.company.name, post.user.fname, post.user.lname]
    for(let i = 0; i < post.job.tags.length; i++) {
      filter_targets.push(post.job.tags[i].tag.tag);
    }

    let results = filter_targets.map(this.filterStringMatch)
    return results.some((x) => x == true); 

  }

  filterStringMatch(test_tag) {
    let query_tags = this.state.filter.split(",");
    if(query_tags.length == 0) {
      return true;
    }
    for(let i = 0; i < query_tags.length; i++) {
      if(test_tag.toLowerCase().includes(query_tags[i].toLowerCase())) {
        return true;
      }
    }
    return false;
  }

  postList(group_posts) {
    let out_posts = [];

    let posts = group_posts.filter(this.filterPost);

    for (let i = 0; i < posts.length; i++) {
      out_posts.push(
        <Post
          post={posts[i]}
          key={posts[i].id}
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
    fetch("http://" + window.location.hostname + ":8000/posts/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    })
      .then((res) => res.json())
      .then((json) => {
        let posts_update = [json, ...this.state.posts];
        this.setState({ posts: posts_update });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  getMorePostsButton() {
    this.getMorePosts();
  }

  render() {
    if (!this.state.token) {
      document.location.replace("/login");
    }
    let renderedPosts = this.postList(this.state.posts);
    return (
      <div>
        <Helmet>
          <title>Home</title>
        </Helmet>
        <PageHeader title={this.state.group.name} />
        <FeedContainer>
          <AddPostContainer>
            <AddPostHeader>Add a new post...</AddPostHeader>
            {this.renderNewPost()}
          </AddPostContainer>
          <SearchContainer>
            <SearchHeader>Search</SearchHeader>
            <SearchInput onChange={this.enter_filter}/>
          </SearchContainer>
          {renderedPosts}
          <button onClick={this.getMorePostsButton}>Get More Posts!</button>
        </FeedContainer>
      </div>
    );
  }
}

export default GroupFeed;
