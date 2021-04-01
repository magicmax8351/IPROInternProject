import React from "react";
import styled from "styled-components";


// For icons: https://github.com/FortAwesome/Font-Awesome/tree/master/js-packages/%40fortawesome/free-regular-svg-icons

const MasterPostContainer = styled.div`
  max-width: 700px;
  background-color: white;
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const Container = styled.div`
  display: flex;
`;

const PostInfoContainer = styled.div``;

const CompanyInfoContainer = styled.div`
  max-width: 100px;
  margin: 10px;
`;

const PostCardHeading = styled.h2`
  font-size: 22pt;
`;

const CompanyLogo = styled.img`
  width: 80%;
`;

const CompanyInfo = styled.p`
  font-size: 10pt;
  color: darkgrey;
  line-height: 1;
  margin-top: 10px;
  font-style: italic;
  max-width: 80px;
  display: block;
  margin-bottom: 0px;
`;

const PostAuthor = styled.p`
  font-size: 10pt;
  color: darkgrey;
  font-style: italic;
  margin-bottom: 0px;
  display: inline-block;
`;

const UserImage = styled.img`
  border-radius: 100px;
  display: inline-block;
  max-width: 30px;
  max-height: 30px;
  margin-right: 10px;
  border: 1px solid black;
`;

const PostButton = styled.button`
  background-color: #7c79a8;
  border-radius: 5px;
  color: white;
  font-size: 18px;
  border: none;
  padding-left: 10px;
  padding-right: 10px;
  transition: 0.1s all ease-out;

  &:hover {
    background-color: #A7A5C6;
    color: white;
  }

`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px;
`;

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
      addJobState: props.post.applied,
      func: props.func
    };

    this.addJobButtonText = ["add to dashboard", "in your dashboard"];

    this.token = props.token;

    this.addJobFromPost = this.addJobFromPost.bind(this);
  }


  addJobFromPost() {
    fetch("http://" + window.location.hostname + ":8000/applications/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        job_id: this.state.post.job.id,
        token: this.token,
        resume_id: 1,
      }),
    })
      .then((res) => {
        if (res.status == 200) {
          this.setState({ addJobState: 1 });
        } else if (res.status == 411) {
          this.setState({ addJobState: 1 });
          throw new Error("Job already added!");
        } else {
          throw new Error("Something else broke!");
        }
      })
      .catch((error) => {
        alert(error);
      });
  }

  render() {
    let addJobButtonText = this.addJobButtonText[this.state.addJobState];
    return (
      <MasterPostContainer>
        <div>
          <UserImage src="https://play-lh.googleusercontent.com/IeNJWoKYx1waOhfWF6TiuSiWBLfqLb18lmZYXSgsH1fvb8v1IYiZr5aYWe0Gxu-pVZX3" />
          <PostAuthor>
            {this.state.post.user.fname} {this.state.post.user.lname} |{" "}
            {this.state.post.group.name}{" "}
          </PostAuthor>
        </div>
        <Container>
          <CompanyInfoContainer>
            <CompanyLogo src="https://cdn.pixabay.com/photo/2013/02/12/09/07/microsoft-80660_960_720.png" />
            <CompanyInfo>{this.state.post.job.company.name}</CompanyInfo>
            <CompanyInfo>{this.state.post.job.location}</CompanyInfo>
            <CompanyInfo>Posted 3/23</CompanyInfo>
          </CompanyInfoContainer>
          <div>
            <PostCardHeading>
              {this.state.post.job.name} | Summer 2021
            </PostCardHeading>
            <p>{this.state.post.body}</p>
          </div>
        </Container>
        <ButtonContainer>
          <PostButton onClick={() => this.state.func(addJobButtonText, this.addJobFromPost)}>job info</PostButton>
          <PostButton onClick={this.addJobFromPost}>{addJobButtonText}</PostButton>
          <PostButton onClick={() => window.open(this.state.post.job.link)}>apply</PostButton>
        </ButtonContainer>
      </MasterPostContainer>
    );
  }
}

export default Post;

export {
  MasterPostContainer,
  UserImage
}