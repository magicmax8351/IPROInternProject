import React from "react";
import styled from "styled-components";
import Modal from "react-bootstrap/Modal";
import JobInfo from "../components/JobInfo";
import PostComment from "../components/PostComment";
import Button from "react-bootstrap/Button";

// For icons: https://github.com/FortAwesome/Font-Awesome/tree/master/js-packages/%40fortawesome/free-regular-svg-icons

const MasterPostContainer = styled.div`
  background-color: white;
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 10px;
  width: 100%;
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
  white-space: nowrap;
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
  white-space: nowrap;

  &:hover {
    background-color: #a7a5c6;
    color: white;
  }
`;

const RowFlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const ButtonContainer = styled(RowFlexContainer)`
  padding: 5px;
`;

const WideDiv = styled.div`
  max-width: 100%;
  display: flex;
  flex-flow: nowrap;
`;

const ThumbButton = styled.button`
  border: none;
  background: none;
  font-size: 10pt;
`;

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: props.post,
      showPostCommentsModal: false,
      showJobInfoModal: false,
    };
    this.addJobButtonText = ["add to dashboard", "in your dashboard"];
    this.likeIcon = ["⚫", "👍"];

    this.user = props.user;
    this.token = props.token;
    this.addJobFromPost = this.addJobFromPost.bind(this);
    this.getJobInfoModal = this.getJobInfoModal.bind(this);
    this.getPostCommentsModal = this.getPostCommentsModal.bind(this);
    this.getButtonText = this.getButtonText.bind(this);
    this.likePost = this.likePost.bind(this);
  }

  getButtonText() {
    let dashboardAdditions = this.calcDashboardAdditions(
      this.state.post.activity,
      this.state.post.applied,
      this.user.id,
      this.state.post
    );
    return this.addJobButtonText[this.state.post.applied] + " (" + dashboardAdditions + ")";
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
          let post_update = this.state.post;
          post_update.applied = 1;
          this.setState({ post: post_update });
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

  likePost() {
    let like = (this.state.post.userLike + 1) % this.likeIcon.length;
    let newPost = this.state.post;
    newPost.userLike = like;
    this.setState({ post: newPost });
    fetch(
      "http://" +
        window.location.hostname +
        ":8000/posts/like?post_id=" +
        this.state.post.id +
        "&like=" +
        like +
        "&dashboard=" +
        this.state.post.applied,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.status)
      .then((status) => {
        if (status != 200) {
          alert("Failed to like post!");
        }
      });
  }

  getPostCommentsModal() {
    return (
      <Modal
        show={this.state.showPostCommentsModal}
        onHide={() => this.setState({ showPostCommentsModal: false })}
        scrollable={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>comments</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PostComment
            post_id={this.state.post.id}
            comments={this.state.post.comments}
            token={this.token}
            user={this.user}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => this.setState({ showPostCommentsModal: false })}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  getJobInfoModal() {
    let newModal = (
      <Modal
        size="lg"
        show={this.state.showJobInfoModal}
        onHide={() => this.setState({ showJobInfoModal: false })}
      >
        <Modal.Header closeButton>
          <Modal.Title>Job Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <JobInfo
            job={this.state.post.job}
            dashboardStatus={this.getButtonText()}
            applyFunc={this.addJobFromPost}
          />
        </Modal.Body>
      </Modal>
    );
    return newModal;
  }

  calcDashboardAdditions(activityArray, userDashboard, uid, post) {
    if(activityArray == null || userDashboard == null) {
      return 0;
    }
    let count = 0;
    for (let i = 0; i < activityArray.length; i++) {
      if (activityArray[i].dashboard == 1 && activityArray[i].uid != uid) {
        count += 1;
      }
    }
    if (userDashboard == 1 && post.uid != uid) {
      count += 1;
    }
    return count;
  }

  calcLikes(activityArray, userLike, userId) {
    if(activityArray == null || userLike == null) {
      return 0;
    }
    let count = 0;
    for (let i = 0; i < activityArray.length; i++) {
      if (activityArray[i].like != 0 && activityArray[i].uid != userId) {
        count += 1;
      }
    }
    if (userLike != 0) {
      count += 1;
    }
    return count;
  }

  render() {
    let jobInfoModal = this.getJobInfoModal();
    let postCommentsModal = this.getPostCommentsModal();

    return (
      <div>
        {jobInfoModal}
        {postCommentsModal}
        <MasterPostContainer>
          <RowFlexContainer>
            <WideDiv>
              <UserImage src={this.state.post.user.pic} />
              <PostAuthor>
                {this.state.post.user.fname} {this.state.post.user.lname} |{" "}
                {this.state.post.group.name}{" "}
              </PostAuthor>
            </WideDiv>
            <div>
              <PostAuthor>
                {this.calcLikes(
                  this.state.post.activity,
                  this.state.post.userLike,
                  this.user.id
                )}{" "}
                |{" "}
              </PostAuthor>
              <ThumbButton onClick={this.likePost}>
                {this.likeIcon[this.state.post.userLike]}
              </ThumbButton>
            </div>
          </RowFlexContainer>
          <Container>
            <CompanyInfoContainer>
              <CompanyLogo
                src={
                  "http://" +
                  window.location.hostname +
                  ":8000/companies/logo/download?company_id=" +
                  this.state.post.job.company.id
                }
              />
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
            <PostButton
              onClick={() => this.setState({ showJobInfoModal: true })}
            >
              job info
            </PostButton>
            <PostButton
              onClick={() => this.setState({ showPostCommentsModal: true })}
            >
              comments ({this.state.post.comments.length})
            </PostButton>
            <PostButton disabled={this.state.post.applied == 1} onClick={this.addJobFromPost}>
              {this.getButtonText()}
            </PostButton>
            <PostButton onClick={() => window.open(this.state.post.job.link)}>
              apply
            </PostButton>
          </ButtonContainer>
        </MasterPostContainer>
      </div>
    );
  }
}

export default Post;

export { MasterPostContainer, UserImage };
