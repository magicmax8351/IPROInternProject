import React from "react";
import styled from "styled-components";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import MDEditor from "@uiw/react-md-editor";
import {
  faPlusSquare,
  faMinusSquare,
  faBorderNone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// For icons: https://github.com/FortAwesome/Font-Awesome/tree/master/js-packages/%40fortawesome/free-regular-svg-icons

const BodyText = styled.p`
  line-height: 1.5;
  white-space: pre-wrap;
`;

const Container = styled.div`
  font-family: "Open Sans", sans-serif;
  width: 650px;
  margin-left: auto;
  margin-right: auto;
  background-color: lightgrey;
  padding: 15px;
  border-radius: 20px;
  box-shadow: 8px 8px 15px 1px rgba(0, 0, 0, 0.51);
  margin-bottom: 30px;
`;

const JobTitle = styled.h3`
  font-size: 36px;
  margin-top: -5px;
`;

const JobLocation = styled.h3`
  margin-top: -20px;
  font-size: 24px;
  font-weight: 400;
`;

const HRLine = styled.hr`
  margin-right: 30px;
  margin-left: 15px;
  margin-bottom: 20px;
`;

const CommentHRLine = styled.hr`
  margin-right: 35px;
  margin-left: 120px;
  margin-bottom: 40px;
`;

const SectionTitleActive = styled.h5`
  font-size: 22px;
  font-weight: 400;
`;

const SectionTitleClosed = styled.h5`
  font-size: 22px;
  font-weight: 100;
`;

const GroupPost = styled.p`
  font-style: italic;
`;

const CommentAvatar = styled.img`
  width: 60px;
  height: 60px;
  margin-left: 16px;
  // margin-bottom: 10px;
`;
const CommentAuthor = styled.p`
  position: relative;
  font-style: italic;
  width: 90px;
  font-size: 12px;
  margin-left: 10px;
  margin-bottom: -3px;
`;

const CommentReplyTo = styled.p`
  position: absolute;
  margin-top: -130px;
  margin-left: 480px;
  float: right;
  font-style: italic;
`;

const CommentBody = styled.p`
  width: 70%;
  margin-left: 120px;
  margin-top: -100px;
  margin-bottom: 60px;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const CommentSubject = styled.p`
  position: absolute;
  margin-top: -130px;
  margin-left: 120px;
  font-size: 18px;
`;

const CommentID = styled.p`
  position: relative;
  font-style: italic;
  width: 80px;
  font-size: 14px;
  margin-left: 10px;
  margin-top: -10px;
  margin-bottom: 5px;
`;

const ButtonStyled = styled.button`
  position: absolute;
  border: none;
  background-color: transparent;
  font-size: 20px;
  margin-left: 160px;
  margin-top: -40px;
`;

const AddJobButton = styled.button`
    margin: 0;
    color: white;
    background-color: #06094f;
    border-color: #06094f;
    border-radius: 12px;
    font-size: inherit;
    font-family: inherit;
    line-height: inherit;
    margin-top: 15px;
    font-weight: bold;
    :hover{
      background-color :#185ea3;
      border-color: #185ea3;
      box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
    }
`;

const MoreComments = styled.p`
  font-style: italic;
  margin-left: 15px;
`;

const PostCommentButton = styled.button`
  background: #ffffff;
  margin-left: 120px;
  border: none;
  font-size: 18px;
  font-style: italic;
  border-radius: 10px;
`;
const PostExpandButton = styled.button`
  border: none;
  border-radius: 10px;
  background: none;
  font-size: 22px;
  font-style: italic;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
`;

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.text = props.text;
    this.timestamp = props.timestamp;
    this.fname = props.fname;
    this.pic = props.pic;
  }

  render() {
    return (
      <div>
        <CommentAvatar src={this.pic} />
        <CommentAuthor>By: {this.fname}</CommentAuthor>
        <CommentAuthor>{this.timestamp.substring(0, 10)}</CommentAuthor>
        <CommentBody>{this.text}</CommentBody>
        <CommentHRLine />
      </div>
    );
  }
}

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: props.post,
      post_expand: 0,
      comment_expand: 0,
      description_expand: 0,
      information_expand: 0,
      comment_expand: 0,
      post_comment: 0,
      job: null,
      group: null,
      user: null,
      company: null,
      comments: props.comments,
      addJobButtonText: "Add job to Dashboard"
    };

    this.token = props.token;

    this.renderDescription = this.renderDescription.bind(this);
    this.renderInformation = this.renderInformation.bind(this);
    this.renderComments = this.renderComments.bind(this);
    this.renderCommentSection = this.renderCommentSection.bind(this);
    this.renderNewComment = this.renderNewComment.bind(this);
    this.renderPost = this.renderPost.bind(this);

    this.description_button_event = this.description_button_event.bind(this);
    this.information_button_event = this.information_button_event.bind(this);
    this.comment_button_event = this.comment_button_event.bind(this);
    this.post_button_event = this.post_button_event.bind(this);
    this.post_comment_event = this.post_comment_event.bind(this);
    this.addJobFromPost = this.addJobFromPost.bind(this);

    this.submitComment = this.submitComment.bind(this);
    this.writeComment = this.writeComment.bind(this);
  }

  description_button_event() {
    this.setState({
      description_expand: !this.state.description_expand,
    });
  }
  information_button_event() {
    this.setState({
      information_expand: !this.state.information_expand,
    });
  }
  comment_button_event() {
    this.setState({
      comment_expand: !this.state.comment_expand,
    });
  }
  post_button_event() {
    this.setState({
      post_expand: !this.state.post_expand,
    });
  }

  post_comment_event() {
    this.setState({
      post_comment: !this.state.post_comment,
    });
  }

  renderDescription() {
    if (this.state.description_expand) {
      return (
        <section>
          <SectionTitleActive>Job Description</SectionTitleActive>
          <ButtonStyled onClick={this.description_button_event}>
            <FontAwesomeIcon icon={faMinusSquare}></FontAwesomeIcon>
          </ButtonStyled>
          <BodyText>{this.state.post.job.description}</BodyText>
        </section>
      );
    } else {
      return (
        <section>
          <SectionTitleClosed>Job Description</SectionTitleClosed>
          <ButtonStyled onClick={this.description_button_event}>
            <FontAwesomeIcon icon={faPlusSquare}></FontAwesomeIcon>
          </ButtonStyled>
        </section>
      );
    }
  }
  renderInformation() {
    if (this.state.information_expand) {
      return (
        <section>
          <SectionTitleActive>Job Information</SectionTitleActive>
          <ButtonStyled onClick={this.information_button_event}>
            <FontAwesomeIcon icon={faMinusSquare}></FontAwesomeIcon>
          </ButtonStyled>
          <p>Job information component</p>
        </section>
      );
    } else {
      return (
        <section>
          <SectionTitleClosed>Job Information</SectionTitleClosed>
          <ButtonStyled onClick={this.information_button_event}>
            <FontAwesomeIcon icon={faPlusSquare}></FontAwesomeIcon>
          </ButtonStyled>
        </section>
      );
    }
  }
  renderComments(num_comments) {
    let ret = [];
    if (this.state.post.comments.length == 0) {
      return (
        <div>
          <p>Start the conversation!</p>
        </div>
      );
    }
    for (let i = 0; i < Math.min(num_comments, this.state.post.comments.length); i++) {
      ret.push(
        <Comment
          text={this.state.post.comments[i].text}
          timestamp={this.state.post.comments[i].timestamp}
          fname={this.state.post.comments[i].user.fname}
          pic={this.state.post.comments[i].user.pic}
          key={this.state.post.comments[i].id}
        />
      );
    }
    return ret;
  }

  closedCommentButton() {
    if (this.state.post.comments.length > 4) {
      return (
        <ButtonStyled onClick={this.comment_button_event}>
          <FontAwesomeIcon icon={faMinusSquare}></FontAwesomeIcon>
        </ButtonStyled>
      );
    } else {
      return null;
    }
  }
  renderCommentSection() {
    if (this.state.comment_expand || this.state.post.comments.length <= 3) {
      return (
        <section>
          <SectionTitleActive>Comments</SectionTitleActive>
          {this.closedCommentButton()}
          {this.renderComments(100)}
          {this.renderNewComment()}
        </section>
      );
    } else {
      return (
        <section>
          <SectionTitleClosed>Comments</SectionTitleClosed>
          <ButtonStyled onClick={this.comment_button_event}>
            <FontAwesomeIcon icon={faPlusSquare}></FontAwesomeIcon>
          </ButtonStyled>
          {this.renderComments(1)}
          <MoreComments>
            {this.state.post.comments.length - 1} more comments...
          </MoreComments>
        </section>
      );
    }
  }

  submitComment(event) {
    event.preventDefault();
    if (
      this.state.new_comment.length > 2
    ) {
      fetch("http://" + window.location.hostname + ":8000/comments/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: this.state.new_comment,
          post_id: this.state.post.id,
          token: this.token
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          let post_update = this.state.post; 
          post_update.comments.push(json);
          this.setState({ post: post_update });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  writeComment(event) {
    this.setState({new_comment: event})
  }

  renderNewComment() {
    let value = "";
    let setValue = "";
    if (this.state.post_comment) {
      return (
        <Form>
          <Form.Group>
            <MDEditor value={value} onChange={this.writeComment} />
            <MDEditor.Markdown source={value} />
          </Form.Group>
          <Button onClick={this.submitComment}>Submit</Button>
        </Form>
      );
    } else {
      return (
        <PostCommentButton onClick={this.post_comment_event}>
          Post a reply...
        </PostCommentButton>
      );
    }
  }

  addJobFromPost() {
    fetch("http://" + window.location.hostname + ":8000/applications/add", {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": JSON.stringify({
        job_id: this.state.post.job.id,
        token: this.token,
        resume_id: 1
      })
    })
    .then((res) => {
      if(res.status == 200) {
        this.setState({addJobButtonText: "Added!"});
      } else if (res.status == 411) {
        //throw new Error("Job already added!");
        this.setState({addJobButtonText: "Already added!"}); // this can be handled better
                                                             // for example, display "added" on post load
      } else {
        throw new Error("Something else broke!");
      }
    }).catch(error => {
      alert(error);
    })
  }

  renderPost() {
    let body = "";

    if (this.state.post_expand) {
      body = this.state.post.body;
    } else {
      if (this.state.post.body.length > 140) {
        body = this.state.post.body.substring(0, 140) + "...";
      } else {
        body = this.state.post.body;
      }
    }
    return (
      <div>
        <h4>{this.state.post.post_title}</h4>
        <BodyText>{body}</BodyText>
      </div>
    );
  }

  render() {
    let secondary_content;
    if (this.state.post_expand) {
      secondary_content = (
        <div>
          <HRLine />
          {this.renderDescription()}
          <HRLine />
          {this.renderCommentSection()}
        </div>
      );
    } else {
      secondary_content = (
        <div>
          <PostExpandButton onClick={this.post_button_event}>
            <FontAwesomeIcon icon={faPlusSquare}></FontAwesomeIcon>
          </PostExpandButton>
        </div>
      );
    }

    return (
      <Container>
        
        <JobTitle>{this.state.post.job.name}</JobTitle>
        <JobLocation>{this.state.post.job.company.name} - {this.state.post.job.location}</JobLocation>
        <GroupPost>
          Posted by PLACEHOLDER via {this.state.post.group.name} on{" "}   
          {this.state.post.timestamp.substring(0, 10)}
        </GroupPost>
        <HRLine />
        {this.renderPost()}
        {secondary_content}
        <AddJobButton onClick={this.addJobFromPost}>{this.state.addJobButtonText}</AddJobButton>
      </Container>
    );
  }
}

export default Post;
