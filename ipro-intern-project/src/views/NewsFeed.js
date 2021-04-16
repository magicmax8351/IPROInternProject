import React from "react";
import styled from "styled-components";
import Post from "../components/Post";
import Cookies from "js-cookie";
import "../styled";
import { MasterPostContainer, UserImage } from "../components/Post";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import NewPost from "../components/NewPost";

// Group ID of -1 given to "main page" - load in posts from all groups
// user is associated with

const FeedContainer = styled.div`
  display: flex;
  justify-content: center;
  justify-content: center;
`;

const PostsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
  max-width: 700px;
`;

const SidebarFlexContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const SidebarContainer = styled.div`
  background-color: white;
  height: fit-content;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
`;

const UserInput = styled.input`
  background: #f0f0f0;
  border: none;
  font-size: 15px;
  width: 100%;
`;

const WhiteGroupRow = styled.div`
  background: white;
  display: flex;
  padding: 5px;
  justify-content: space-between;
`;

const GreyGroupRow = styled.div`
  background: #f0f0f0;
  display: flex;
  justify-content: space-between;
  padding: 5px;
`;

const GroupRowButton = styled.button`
  border: none;
  background: none;
`;

const GroupRowName = styled.a`
  font-size: 16px;
  margin: 0px;
  color: black;
  text-decoration-line: underline;
`;

const MakeNewPostButton = styled.button`
  background: #f0f0f0;
  font-size: 18px;
  width: 100%;
  text-align: left;
  border-radius: 5px;
  border: solid 1px;
`;

const NewPostContainer = styled(MasterPostContainer)`
  display: flex;
`;

class NewsFeed extends React.Component {
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
      filter: "",
      modal: null,
      showNewPostModal: false,
      showPostSubmittedModal: false,
      showPostCommentsModal: false,
      postSubmitted: 0,
      groups_toggle: null,
      user: null,
      loadNewPosts: false,
      outOfPosts: false
    };
    this.count = 10;

    this.submitPost = this.submitPost.bind(this);
    this.postList = this.postList.bind(this);
    this.getMorePosts = this.getMorePosts.bind(this);
    this.getMorePostsButton = this.getMorePostsButton.bind(this);

    this.enter_filter = this.enter_filter.bind(this);
    this.filterStringMatch = this.filterStringMatch.bind(this);
    this.filterPost = this.filterPost.bind(this);
    this.renderGroups = this.renderGroups.bind(this);

    this.getNewPostModal = this.getNewPostModal.bind(this);
    this.getPostSubmittedModal = this.getPostSubmittedModal.bind(this);

    this.closeNewPostModal = this.closeNewPostModal.bind(this);
    this.closePostSubmittedModal = this.closePostSubmittedModal.bind(this);
    this.closeJobInfoModal = this.closeJobInfoModal.bind(this);
    this.closeShowCommentsModal = this.closeShowCommentsModal.bind(this);

    this.setJobInfoId = this.setJobInfoId.bind(this);

    this.checkbox_map = ["✖", "✔"];

    if (this.group_id == -1) {
      this.state.group = {
        name: "All posts",
        desc: "Your News Feed",
      };
    }
  }

  enter_filter(event) {
    this.setState({ filter: event.target.value });
  }

  componentDidMount() {
    this.getMorePosts();

    window.setInterval(() => {
      if(this.state.loadNewPosts) {
        this.getMorePosts();
        this.setState({ loadNewPosts: false });
      }
    }, 500)

    fetch(
      "http://" +
        window.location.hostname +
        ":8000/group/list?token=" +
        this.state.token
    )
      .then((res) => res.json())
      .then((json) => {
        this.setState({ groups: json });
        let groups_toggle = {};
        for (let i = 0; i < json.length; i++) {
          groups_toggle[json[i].id] = 1;
        }
        this.setState({ groups_toggle: groups_toggle });
      });

    fetch(
      "http://" +
        window.location.hostname +
        ":8000/users/get?token=" +
        this.state.token
    )
      .then((res) => res.json())
      .then((json) => this.setState({ user: json }))

    window.addEventListener("scroll", (event) => {
      var _docHeight = document.documentElement.scrollHeight;
      if ((_docHeight - (window.scrollY + window.innerHeight)) < 500) {
        this.setState({ loadNewPosts: true });
      }
    });
  }

  getMorePosts() {
    if(this.state.outOfPosts) {
      return;
    }
    fetch(
      "http://" +
        window.location.hostname +
        ":8000/posts/get?count=" +
        this.count +
        "&start_id=" +
        this.state.start_id +
        "&group_link=",
      {
        credentials: "include",
        fetchPolicy: "no-cache"
      }
    )
      .then((res) => {
        if(res.status == 200) {
          return res.json();
        } else if (res.status == 450) {
          this.setState({ outOfPosts: true });
          throw new Error("Out of posts!");
        } else {
          throw new Error("Something else broke!");
        }
      })
      .then((json) => {
        let posts_update = [...this.state.posts, ...json.posts];
        this.setState({
          posts: posts_update,
          start_id: posts_update[posts_update.length - 1].id,
        });
      })
      .catch((error) => console.error(error));
  }

  filterPost(post) {
    if (!this.state.groups_toggle) {
      return false;
    }

    if (!this.state.groups_toggle[post.group.id]) {
      return false;
    }

    let filter_targets = [
      post.body,
      post.job.name,
      post.job.location,
      post.job.company.name,
      post.user.fname,
      post.user.lname,
    ];
    for (let i = 0; i < post.job.tags.length; i++) {
      filter_targets.push(post.job.tags[i].tag.tag);
    }

    let results = filter_targets.map(this.filterStringMatch);
    return results.some((x) => x == true);
  }

  filterStringMatch(test_tag) {
    let query_tags = this.state.filter.split(",");
    if (query_tags.length == 0) {
      return true;
    }
    for (let i = 0; i < query_tags.length; i++) {
      if (test_tag.toLowerCase().includes(query_tags[i].toLowerCase())) {
        return true;
      }
    }
    return false;
  }

  setJobInfoId(job, dashboardStatus, applyFunc) {
    this.setState({
      jobInfo: job,
      showJobInfoModal: true,
      dashboardStatus: dashboardStatus,
      applyFunc: applyFunc,
    });
  }

  postList(group_posts) {
    let out_posts = [];
    let posts = group_posts.filter(this.filterPost);

    for (let i = 0; i < posts.length; i++) {
      out_posts.push(
        <Post
          user={this.state.user}
          post={posts[i]}
          key={posts[i].id}
          token={this.state.token}
          jobInfoFunc={(dashboardStatus, applyFunc) =>
            this.setJobInfoId(posts[i].job, dashboardStatus, applyFunc)
          }
          showCommentsFunc={() =>
            this.setState({
              showCommentsData: posts[i].comments,
              showPostCommentsModal: true,
            })
          }
        />
      );
    }
    return out_posts;
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
        this.setState({
          posts: posts_update,
          showNewPostModal: false,
          showPostSubmittedModal: true,
          group_name: json.group.name,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  getMorePostsButton() {
    this.getMorePosts();
  }

  renderGroups() {
    let groups = [];
    if (!this.state.groups || !this.state.groups_toggle) {
      return null;
    }
    for (let i = 0; i < this.state.groups.length; i += 2) {
      let g = this.state.groups[i];
      groups.push(
        <GreyGroupRow>
          <GroupRowName href={"/group/" + g.link}>{g.name}</GroupRowName>
          <GroupRowButton onClick={() => this.flipViewGroupState(g.id)}>
            {this.checkbox_map[this.state.groups_toggle[g.id]]}
          </GroupRowButton>
        </GreyGroupRow>
      );
      if (i + 1 != this.state.groups.length) {
        let g2 = this.state.groups[i + 1];

        groups.push(
          <WhiteGroupRow>
            <GroupRowName href={"/group/" + g2.link}>{g2.name}</GroupRowName>
            <GroupRowButton onClick={() => this.flipViewGroupState(g2.id)}>
              {this.checkbox_map[this.state.groups_toggle[g2.id]]}
            </GroupRowButton>
          </WhiteGroupRow>
        );
      }
    }
    return groups;
  }

  getNewPostModal() {
    let newModal = (
      <Modal
        size="lg"
        show={this.state.showNewPostModal}
        onHide={this.closeNewPostModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NewPost
            token={this.state.token}
            dashboard_add={false}
            func={this.submitPost}
          />
        </Modal.Body>
      </Modal>
    );
    return newModal;
  }

  getPostSubmittedModal() {
    return (
      <Modal
        show={this.state.showPostSubmittedModal}
        onHide={this.closePostSubmittedModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Post submitted!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Successfully submitted post to {this.state.group_name}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.closePostSubmittedModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  closeNewPostModal() {
    this.setState({ showNewPostModal: false });
  }

  closePostSubmittedModal() {
    this.setState({ showPostSubmittedModal: false });
  }

  closeJobInfoModal() {
    this.setState({ showJobInfoModal: false });
  }

  closeShowCommentsModal() {
    this.setState({ showPostCommentsModal: false });
  }

  flipViewGroupState(group_id) {
    let groups_update = this.state.groups_toggle;
    groups_update[group_id] = (groups_update[group_id] + 1) % 2;
    this.setState({ groups_toggle: groups_update });
  }

  render() {
    if (!this.state.token) {
      document.location.replace("/login");
    }
    if (this.state.user == null) {
      return null;
    }
    let renderedPosts = this.postList(this.state.posts);
    let renderedGroups = this.renderGroups();
    let newPostModal = this.getNewPostModal();
    let postSubmittedModal = this.getPostSubmittedModal();
    return (
      <div>
        {newPostModal}
        {postSubmittedModal}
        <FeedContainer>
          <SidebarFlexContainer>
            <SidebarContainer>
              <h4>filter</h4>
              <UserInput
                onChange={this.enter_filter}
                placeholder="enter a filter"
              />
            </SidebarContainer>
            <SidebarContainer>
              <h4>your groups</h4>
              {renderedGroups}
            </SidebarContainer>
          </SidebarFlexContainer>
          <PostsContainer>
            <NewPostContainer>
              <UserImage src="https://play-lh.googleusercontent.com/IeNJWoKYx1waOhfWF6TiuSiWBLfqLb18lmZYXSgsH1fvb8v1IYiZr5aYWe0Gxu-pVZX3" />{" "}
              <MakeNewPostButton
                onClick={() => this.setState({ showNewPostModal: true })}
              >
                Make a new post...
              </MakeNewPostButton>
            </NewPostContainer>
            {renderedPosts}
          </PostsContainer>
        </FeedContainer>
      </div>
    );
  }
}

export default NewsFeed;
