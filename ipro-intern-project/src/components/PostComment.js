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

const Container = styled.div`
  min-width: 500px;;
  background-color: white;
  padding: 15px;
  border-radius: 5px;
  margin: 20px;
`;

const PostCardHeading = styled.h2`
  font-size: 22pt;
`

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

class PostComment extends React.Component {
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
      addJobState: props.post.applied
    };

    this.addJobButtonText = ["Add job to Dashboard", "Added!"]

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
    let tags = [];
    for(let i = 0; i < this.state.post.job.tags.length; i++) {
      tags.push(<PostTag>{this.state.post.job.tags[i].tag.tag}</PostTag>);
    }
    if (this.state.description_expand) {
      return (
        <section>
          <SectionTitleActive>Job Description</SectionTitleActive>
          <ButtonStyled onClick={this.description_button_event}>
            <FontAwesomeIcon icon={faMinusSquare}></FontAwesomeIcon>
          </ButtonStyled>
          <BodyText>{this.state.post.job.description}</BodyText>
          <a href={this.state.post.job.link}>{this.state.post.job.link}</a>
          <SectionTitleActive>Tags</SectionTitleActive>
          <div>{tags}</div>
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
  // renderComments(num_comments) {
  //   let ret = [];
  //   if (this.state.post.comments.length == 0) {
  //     return (
  //       <div>
  //         <p>Start the conversation!</p>
  //       </div>
  //     );
  //   }
  //   console.log(this.state.post);
  //   for (let i = 0; i < Math.min(num_comments, this.state.post.comments.length); i++) {
  //     ret.push(
  //       <Comment
  //         text={this.state.post.comments[i].text}
  //         timestamp={this.state.post.comments[i].timestamp}
  //         fname={this.state.post.comments[i].user.fname}
  //         pic={this.state.post.comments[i].user.pic}
  //         key={this.state.post.comments[i].id}
  //       />
  //     );
  //   }
  //   return ret;
  // }

  // closedCommentButton() {
  //   if (this.state.post.comments.length > 4) {
  //     return (
  //       <ButtonStyled onClick={this.comment_button_event}>
  //         <FontAwesomeIcon icon={faMinusSquare}></FontAwesomeIcon>
  //       </ButtonStyled>
  //     );
  //   } else {
  //     return null;
  //   }
  // }
  // renderCommentSection() {
  //   if (this.state.comment_expand || this.state.post.comments.length <= 3) {
  //     return (
  //       <section>
  //         <SectionTitleActive>Comments</SectionTitleActive>
  //         {this.closedCommentButton()}
  //         {this.renderComments(100)}
  //         {this.renderNewComment()}
  //       </section>
  //     );
  //   } else {
  //     return (
  //       <section>
  //         <SectionTitleClosed>Comments</SectionTitleClosed>
  //         <ButtonStyled onClick={this.comment_button_event}>
  //           <FontAwesomeIcon icon={faPlusSquare}></FontAwesomeIcon>
  //         </ButtonStyled>
  //         {this.renderComments(1)}
  //         <MoreComments>
  //           {this.state.post.comments.length - 1} more comments...
  //         </MoreComments>
  //       </section>
  //     );
  //   }
  // }

  // submitComment(event) {
  //   event.preventDefault();
  //   if (
  //     this.state.new_comment.length > 2
  //   ) {
  //     fetch("http://" + window.location.hostname + ":8000/comments/add", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         text: this.state.new_comment,
  //         post_id: this.state.post.id,
  //         token: this.token
  //       }),
  //     })
  //       .then((res) => res.json())
  //       .then((json) => {
  //         let post_update = this.state.post; 
  //         post_update.comments.push(json);
  //         this.setState({ post: post_update });
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //       });
  //   }
  // }

  // writeComment(event) {
  //   this.setState({new_comment: event})
  // }

  // renderNewComment() {
  //   let value = "";
  //   if (this.state.post_comment) {
  //     return (
  //       <Form>
  //         <Form.Group>
  //           <MDEditor value={value} onChange={this.writeComment} />
  //           <MDEditor.Markdown source={value} />
  //         </Form.Group>
  //         <Button onClick={this.submitComment}>Submit</Button>
  //       </Form>
  //     );
  //   } else {
  //     return (
  //       <PostCommentButton onClick={this.post_comment_event}>
  //         Post a reply...
  //       </PostCommentButton>
  //     );
  //   }
  // }

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
        this.setState({addJobState: 1});
      } else if (res.status == 411) {
        this.setState({addJobState: 1});
        throw new Error("Job already added!");
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
    let buttonText = this.addJobButtonText[this.state.addJobState];
    let button = null;
    if(this.state.addJobState == 1) {
      button = <AlreadyAddedJobButton disabled={1}>{buttonText} </AlreadyAddedJobButton>
    } else {
      button = <AddJobButton onClick={this.addJobFromPost}> {buttonText} </AddJobButton>
    }
    return (
      <Container>
        <PostCardHeading>{this.state.post.job.name} | Summer 2021</PostCardHeading>
        <JobLocation>{this.state.post.job.company.name} - {this.state.post.job.location}</JobLocation>
        <GroupPost>
          Posted by PLACEHOLDER via {this.state.post.group.name} on{" "}   
          {this.state.post.timestamp.substring(0, 10)}
        </GroupPost>
        <HRLine />
        {this.renderPost()}
        {secondary_content}
        {button}
      </Container>
    );
  }
}

export default Post;
