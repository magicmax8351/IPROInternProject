import React from "react";
import styled from "styled-components";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button"
import MDEditor from "@uiw/react-md-editor";
import { faPlusSquare, faMinusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// For icons: https://github.com/FortAwesome/Font-Awesome/tree/master/js-packages/%40fortawesome/free-regular-svg-icons

const BodyText = styled.p`
  line-height: 1.5;
  white-space: pre-wrap;
`;

const Container = styled.div`
  width: 650px;
  margin-left: auto;
  margin-right: auto;
  background-color: lightgrey;
  padding: 15px;
  border-radius: 20px;
  box-shadow: 8px 8px 15px 1px rgba(0, 0, 0, 0.51);
`;

const JobTitle = styled.h3`
  font-size: 36px;
  margin-top: -5px;
`;

const CompanyTitle = styled.h3`
  margin-top: -30px;
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
  margin-bottom: 20px;
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
  position: absolute;
  margin-left: 590px;
  margin-top: -10px;
  font-style: italic;
`;

const CommentAvatar = styled.img`
  width: 60px;
  height: 60px;
  margin-left: 16px;
  margin-bottom: 10px;
`;
const CommentAuthor = styled.p`
  position: relative;
  font-style: italic;
  margin-top: -3px;
  width: 90px;
  font-size: 14px;
  margin-left: 10px;
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
  margin-top: -60px;
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
  margin-rigth: auto;
`;

const Comment = (props) => (
  /* author, author_avatar, reply_to, subject, body */
  <div>
    <CommentAvatar src={props.props.author_avatar} />
    <CommentAuthor>{props.props.author}</CommentAuthor>
    <CommentID>Post #{props.props.post_id}</CommentID>
    <CommentReplyTo>In response to #{props.props.reply_to}</CommentReplyTo>
    <CommentSubject>{props.props.subject}</CommentSubject>
    <CommentBody>{props.props.body}</CommentBody>
    <CommentHRLine />
  </div>
);

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post_expand: 0,
      comment_expand: 0,
      description_expand: 0,
      information_expand: 0,
      comment_expand: 0,
      post_comment: 0
    };

    this.post = props.data;

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

    this.comments = [
      {
        key: 0,
        author: "Justin Schmitz",
        author_avatar:
          "https://www.flaticon.com/svg/static/icons/svg/194/194938.svg",
        post_id: "421",
        reply_to: "443",
        subject: "BIG MOOD ENERGY",
        body:
          "I agree! Wells fargo reminds me of the Big Bad Wolf from Red Riding Hood. I think they're bad :(. ",
      },
      {
        key: 1,
        author: "Maxwell Buffo",
        author_avatar:
          "https://www.flaticon.com/svg/static/icons/svg/1818/1818401.svg",
        post_id: "422",
        reply_to: "445",
        subject: "Totally True 😊",
        body:
          "I agree! I always love the stories you tell <3 Keep it up tiger!! uWu",
      },
      {
        key: 2,
        author: "Alan Cramb",
        author_avatar:
          "https://www.iit.edu/sites/default/files/styles/width_220/public/2019-11/alan_cramb_320x355.jpg?itok=TsAY30A_",
        post_id: "532",
        reply_to: "251",
        subject: "University Communication",
        body:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vel justo vel lectus aliquet pulvinar. Sed dui dolor, hendrerit sit amet velit ac, ornare placerat velit. Sed leo est, mattis vel pulvinar a, rutrum eu mauris. Aliquam vitae pretium lorem. Suspendisse varius arcu velit, a elementum enim pretium vel. uis ut egestas sem. Curabitur efficitur semper elit. Cras condimentum pretium velit, eu ultrices eros dignissim sed. Mauris aliquam faucibus ex, vitae finibus nisl consectetur nec. Suspendisse sed bibendum est. \n\nMorbi eu lacinia urna. Nam a justo id massa porttitor malesuada non eget quam. Nunc ultrices lectus mi, vehicula dapibus ligula pretium non. Praesent sit amet quam diam. Donec vulputate ligula eget felis ultricies, ac lacinia ante faucibus. Duis nec nisi nisi. Aenean sed facilisis felis, et vehicula orci. Maecenas eget mauris eget metus vulputate laoreet quis a ante. Suspendisse id porttitor purus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec fringilla ultrices neque ut feugiat. Fusce eget molestie velit. Sed in enim bibendum ex ullamcorper malesuada et sed risus. Donec consequat nisl est, eu suscipit lacus condimentum id.",
      },
    ];

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
      post_comment: !this.state.post_comment
    })
  }

  renderDescription() {
    if (this.state.description_expand) {
      return (
        <section>
          <SectionTitleActive>Job Description</SectionTitleActive>
          <ButtonStyled onClick={this.description_button_event}>
            <FontAwesomeIcon icon={faMinusSquare}></FontAwesomeIcon>
          </ButtonStyled>
          <BodyText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum
          </BodyText>
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
    for (let i = 0; i < Math.min(num_comments, this.comments.length); i++) {
      ret.push(<Comment props={this.comments[i]} key={this.comments[i].key} />);
    }
    if (num_comments > 1) {
      for (let i = 0; i < Math.min(num_comments, this.comments.length); i++) {
        ret.push(
          <Comment props={this.comments[i]} key={this.comments[i].key} />
        );
      }
    }

    return ret;
  }
  renderCommentSection() {
    if (this.state.comment_expand) {
      return (
        <section>
          <SectionTitleActive>Comments</SectionTitleActive>
          <ButtonStyled onClick={this.comment_button_event}>
            <FontAwesomeIcon icon={faMinusSquare}></FontAwesomeIcon>
          </ButtonStyled>
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
            {this.comments.length - 1} more comments...
          </MoreComments>
        </section>
      );
    }
  }

  renderNewComment() {
    let value = "";
    let setValue = "";
    if(this.state.post_comment) {
       return <Form>
         <Form.Group>
           <Form.Label>Subject</Form.Label>
           <Form.Control placeholder="subject"/>
         </Form.Group>
         <Form.Group>
            <MDEditor value={value} onChange={setValue} />
            <MDEditor.Markdown source={value} />
         </Form.Group>
         <Button>Submit</Button>
         </Form>
    } else {
      return <PostCommentButton onClick={this.post_comment_event}>Post a reply...</PostCommentButton>
    }
  }
  renderPost() {
    let body = "";

    console.log(this.post);
    if (this.state.post_expand) {
      body = this.post.body;
    } else {
      if(this.post.body.length > 140) {
        body = this.post.body.substring(0, 140) + "..." ;
      } else {
        body = this.post.body;
      }
    }
    return (
      <div>
        <h4>{this.post.post_title}</h4>
        <BodyText>{body}</BodyText>
        <p>
          Posted by [PLACEHOLDER] on {this.post.timestamp}
        </p>
      </div>
    );
  }

  render() {
    if(!this.post) {
      return null;
    }
    
    let secondary_content;
    if (this.state.post_expand) {
      secondary_content = (
        <div>
          <HRLine />
          {this.renderDescription()}
          <HRLine />
          {this.renderInformation()}
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
        <GroupPost>ACM-IIT</GroupPost>
        <JobTitle>Software Engineering Internship</JobTitle>
        <CompanyTitle>Wells Fargo</CompanyTitle>
        <HRLine />
        {this.renderPost()}
        {secondary_content}
      </Container>
    );
  }
}

export default Post;
