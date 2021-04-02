import React from "react";
import styled from "styled-components";

const CommentContainer = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 10px;
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
      comments = (
        <div>
          {this.state.comments.map((x) => (
            <Comment comment={x} />
          ))}
        </div>
      );
    }
    return <div>{comments}</div>;
  }
}

export default PostComment;
