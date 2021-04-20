import React from "react";
import styled from "styled-components";

const CommentContainer = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 10px;
`;

const NewCommentContainer = styled(CommentContainer)`
  background: #f0f0f0;
  padding: 10px;
  border-radius: 10px;
`;

const ProfilePicContainer = styled.div`
  max-width: 60px;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 5px;
`;

const ProfilePic = styled.img`
  border-radius: 100px;
  border: 1px;
  width: 70%;
`;

const CommentTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 0px 10px 10px 10px;
  background: #f0f0f0;
  padding: 5px;
  width: 100%;
`;

const AuthorContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const AuthorText = styled.p`
  font-size: 10pt;
  font-weight: bold;
`;

const NewCommentInput = styled.textarea`
  width: 100%;
  font-size: 18px;
  margin-top: auto;
  margin-bottom: auto;
  border: none;
  border-radius: 10px;
  padding: 5px;
  margin: 10px;
  height: auto;
`;

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.comment = props.comment;
  }

  render() {
    return (
      <CommentContainer>
        <ProfilePicContainer>
          <ProfilePic src={this.comment.user.pic} />
        </ProfilePicContainer>
        <CommentTextContainer>
          <AuthorContainer>
            <AuthorText>
              {this.comment.user.fname} {this.comment.user.lname}
            </AuthorText>
            <AuthorText>{this.comment.timestamp.substring(0, 10)}</AuthorText>
          </AuthorContainer>
          <p>{this.comment.text}</p>
        </CommentTextContainer>
      </CommentContainer>
    );
  }
}

class NewComment extends React.Component {
  constructor(props) {
    super(props);
    this.token = props.token;
    this.user = props.user;
    this.post_id = props.post_id;
    this.func = props.func;
    this.state = {
      newComment: "",
    };
    this.submitComment = this.submitComment.bind(this);
  }

  submitComment(event) {
    event.preventDefault();
    if (this.state.newComment.length > 2) {
      this.func(this.state.newComment);
      this.setState({ newComment: "" });
    }
  }

  render() {
    return (
      <div>

      <NewCommentContainer>
        <ProfilePicContainer>
          <ProfilePic src={this.user.pic} />
        </ProfilePicContainer>
        <NewCommentInput
          value={this.state.newComment}
          onKeyPress={(event) =>
            event.key === "Enter" ? this.submitComment(event) : null
          }
          rows={Math.max(1, Math.ceil(this.state.newComment.length / 50) + 1)}
          onChange={(event) =>
            this.setState({ newComment: event.target.value })
          }
          placeholder="Write a reply.."
        />
      </NewCommentContainer>
      </div>

    );
  }
}

class PostComment extends React.Component {
  constructor(props) {
    super(props);
    this.user = props.user;
    this.post_id = props.post_id;
    this.state = {
      comments: props.comments,
    };
    this.token = props.token;
  }

  submitComment(commentText, post_id) {
    fetch("http://" + window.location.hostname + ":8000/comments/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: commentText,
        post_id: post_id,
        token: this.token,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        let comments = this.state.comments;
        comments.push(json);
        this.setState({ comments: comments });
      })
      .catch((err) => {
        console.error(err);
      });
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
      comments = (
        <div>
          {this.state.comments.map((x) => (
            <Comment comment={x} />
          ))}
        </div>
      );
    }
    return (
      <div>
        {comments}
        <NewComment
          func={(commentText) => this.submitComment(commentText, this.post_id)}
          token={this.token}
          user={this.user}
        />
      </div>
    );
  }
}

export default PostComment;
