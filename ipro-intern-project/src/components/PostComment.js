import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// For icons: https://github.com/FortAwesome/Font-Awesome/tree/master/js-packages/%40fortawesome/free-regular-svg-icons

const Container = styled.div`
  min-width: 500px;
  background-color: white;
  padding: 15px;
  border-radius: 5px;
  margin: 20px;
`;

const PostCardHeading = styled.h2`
  font-size: 22pt;
`;

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.comment = props.comment;
  }

  render() {
    return (
      <div>
        <img src={this.comment.user.pic} />
        <p>By: {this.comment.user.fname}</p>
        <p>{this.comment.timestamp.substring(0, 10)}</p>
        <p>{this.comment.text}</p>
      </div>
    );
  }
}

class PostComment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: props.comments,
    };
    this.token = props.token;
  }
  render() {
    let comments;
    if (this.state.comments.length == 0) {
      comments = (
        <div>
          <p>No comments!</p>
        </div>
      );
    } else {
      comments = <div>{this.state.comments.map((x) => <Comment comment={x} />)}</div>;
    }
    return <div>{comments}</div>;
  }
}

export default PostComment;
