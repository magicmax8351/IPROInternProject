import React from "react";
import styled from "styled-components";
import Post from "../components/Post";
import Cookies from "js-cookie";
import "../styled";
import { MasterPostContainer, UserImage } from "../components/Post";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import NewPost from "../components/NewPost";
import GroupHeaderCard from "../components/GroupHeaderCard";
import { UserInput } from "./NewsFeed";

// Group ID of -1 given to "main page" - load in posts from all groups
// user is associated with

const FeedContainer = styled.div`
  display: flex;
  justify-content: center;
  justify-content: center;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
`;

const PostsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
  max-width: 630px;
  min-width: 500px;
`;

const SidebarFlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 224px;
  min-width: 100px;
  width: 40%;
`;

const SidebarContainer = styled.div`
  background-color: white;
  height: fit-content;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
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

const GroupRowName = styled.a`
  font-size: 16px;
  margin: 0px;
  color: black;
  text-decoration-line: underline;
`;

const UserRowName = styled.p`
  font-size: 16px;
  margin: 0px;
  color: black;
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

const GroupDescription = styled.p`
  margin-bottom: 0px;
`;

const GroupStatsHeader = styled.p`
  font-size: .8em;
  font-weight: bold;
  margin-bottom: 0px;
  padding-bottom: 0px;
`;

const GroupStatsItem = styled.p`
  margin-bottom: 0px;
  padding-bottom: 0px;
`;

class GroupPage extends React.Component {
  constructor(props) {
    super(props);

    const regex = /\/group\/.*/;
    let match = document.location.pathname.match(regex)[0];
    this.group_link = match.substring(7);

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
      groupStats: {
        avgJobsInDashboard: null,
        mostPopularCompany: null,
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
      outOfPosts: false,
    };
    this.count = 5;

    this.submitPost = this.submitPost.bind(this);
    this.postList = this.postList.bind(this);
    this.getMorePosts = this.getMorePosts.bind(this);
    this.getMorePostsButton = this.getMorePostsButton.bind(this);

    this.enter_filter = this.enter_filter.bind(this);
    this.filterStringMatch = this.filterStringMatch.bind(this);
    this.filterPost = this.filterPost.bind(this);
    this.renderMembers = this.renderMembers.bind(this);

    this.getNewPostModal = this.getNewPostModal.bind(this);
    this.getPostSubmittedModal = this.getPostSubmittedModal.bind(this);

    this.closeNewPostModal = this.closeNewPostModal.bind(this);
    this.closePostSubmittedModal = this.closePostSubmittedModal.bind(this);
    this.closeJobInfoModal = this.closeJobInfoModal.bind(this);
    this.closeShowCommentsModal = this.closeShowCommentsModal.bind(this);

    this.setJobInfoId = this.setJobInfoId.bind(this);
  }

  enter_filter(event) {
    this.setState({ filter: event.target.value });
  }

  componentDidMount() {
    this.getMorePosts();

    window.setInterval(() => {
      if (this.state.loadNewPosts) {
        this.getMorePosts();
        this.setState({ loadNewPosts: false });
      }
    }, 250);

    window.setInterval(() => {
      if (document.documentElement.scrollHeight < window.innerHeight) {
        this.setState({ loadNewPosts: true });
      }
    }, 250);

    if (this.group_id != -1) {
      fetch(
        "http://" +
          window.location.hostname +
          ":8000/groups/" +
          this.group_link +
          "/" +
          this.state.token
      )
        .then((res) => res.json())
        .then((json) => {
          console.log(json.membership.length);
          return json;
        })
        .then((json) => this.setState({ groupMembership: json }));

        fetch(
          "http://" +
            window.location.hostname +
            ":8000/groups_stats/" +
            this.group_link
        )
        .then((res) => res.json())
        .then((json) => {
          this.setState({ groupStats: json })
          console.log(json)
        })
    }
    fetch(
      "http://" +
        window.location.hostname +
        ":8000/group/list?token=" +
        this.state.token
    )
      .then((res) => res.json())
      .then((json) => this.setState({ groups: json }));

    fetch(
      "http://" +
        window.location.hostname +
        ":8000/users/get?token=" +
        this.state.token
    )
      .then((res) => res.json())
      .then((json) => this.setState({ user: json }));

    window.addEventListener("scroll", (event) => {
      var _docHeight = document.documentElement.scrollHeight;
      if (_docHeight - (window.scrollY + window.innerHeight) < 500) {
        this.setState({ loadNewPosts: true });
      }
    });
  }

  getMorePosts() {
    if (this.state.outOfPosts) {
      return;
    }
    fetch(
      "http://" +
        window.location.hostname +
        ":8000/posts/get?token=" +
        this.state.token +
        "&count=" +
        this.count +
        "&start_id=" +
        this.state.start_id +
        "&group_link=" +
        this.group_link +
        "&nonce=" +
        Math.floor(Math.random() * 25565),
      {
        credentials: "include",
        "Cache-Control": "no-store",
      }
    )
      .then((res) => {
        if (res.status == 200) {
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
        if (posts_update.length == 0) {
          return;
        }
        this.setState({
          posts: posts_update,
          start_id: posts_update[posts_update.length - 1].id,
        });
      })
      .catch((error) => console.error(error));
  }

  filterPost(post) {
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
        window.location.replace("/login");
      });
  }

  getMorePostsButton() {
    this.getMorePosts();
  }

  renderMembers() {
    let members = [];

    for (let i = 0; i < this.state.groupMembership.membership.length; i += 2) {
      let m = this.state.groupMembership.membership[i].user;
      members.push(
        <GreyGroupRow>
          <UserRowName>
            {m.fname} {m.lname}
          </UserRowName>
        </GreyGroupRow>
      );
      if (i + 1 != this.state.groupMembership.membership.length) {
        let m2 = this.state.groupMembership.membership[i + 1].user;
        members.push(
          <WhiteGroupRow>
            <UserRowName>
              {m2.fname} {m2.lname}
            </UserRowName>
          </WhiteGroupRow>
        );
      }
    }
    return members;
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
            force_group={this.state.groupMembership.group}
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

    if (this.state.user == null || this.state.groupMembership == null) {
      return null;
    }

    let renderedPosts = this.postList(this.state.posts);
    let newPostModal = this.getNewPostModal();
    let postSubmittedModal = this.getPostSubmittedModal();
    let renderedMembers = this.renderMembers();
    let renderedGroups = renderGroups(this.state.groups);

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
            <GroupHeaderCard
              token={this.state.token}
              group={this.state.groupMembership.group}
              memberCount={
                this.state.groupMembership.membership.length -
                (this.state.groupMembership.group.activeUserInGroup ? 1 : 0)
              }
            />
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
          <SidebarFlexContainer>
            <SidebarContainer>
              <h4>description</h4>
              <GroupDescription>
                {this.state.groupMembership.group.desc}
              </GroupDescription>
            </SidebarContainer>
            <SidebarContainer>
              <h4>stats</h4>
              <GreyGroupRow><GroupStatsHeader>Average Jobs in Dashboard</GroupStatsHeader></GreyGroupRow>
              <WhiteGroupRow><GroupStatsItem>{this.state.groupStats.avgJobsInDashboard}</GroupStatsItem></WhiteGroupRow>
              <GreyGroupRow><GroupStatsHeader>Most Popular Company</GroupStatsHeader></GreyGroupRow>
              <WhiteGroupRow><GroupStatsItem>{this.state.groupStats.mostPopularCompany}</GroupStatsItem></WhiteGroupRow>
              <GreyGroupRow><GroupStatsHeader>Posts per Day</GroupStatsHeader></GreyGroupRow>
              <WhiteGroupRow><GroupStatsItem>{this.state.groupStats.postsPerDay}</GroupStatsItem></WhiteGroupRow>
              <GreyGroupRow><GroupStatsHeader>Average Number of Offers</GroupStatsHeader></GreyGroupRow>
              <WhiteGroupRow><GroupStatsItem>{this.state.groupStats.avgNumberOffers}</GroupStatsItem></WhiteGroupRow>
              {/*<GroupStatsList>
                <GroupStatsItem>Average Jobs in Dashboard {this.state.groupStats.avgJobsInDashboard}</GroupStatsItem>
                <GroupStatsItem>Most Popular Company: {this.state.groupStats.mostPopularCompany}</GroupStatsItem>
              </GroupStatsList>*/}
            </SidebarContainer>
            <SidebarContainer>
              <h4>members</h4>
              {renderedMembers}
            </SidebarContainer>
          </SidebarFlexContainer>
        </FeedContainer>
      </div>
    );
  }
}

export default GroupPage;

const renderGroups = (groups) => {
  if (groups == null) {
    return null;
  }
  groups = groups.filter((x) => x.activeUserInGroup);
  let grouplist = [];
  for (let i = 0; i < groups.length; i += 2) {
    let g = groups[i];
    grouplist.push(
      <GreyGroupRow>
        <GroupRowName href={"/group/" + g.link}>{g.name}</GroupRowName>
      </GreyGroupRow>
    );
    if (i + 1 != groups.length) {
      let g2 = groups[i + 1];

      grouplist.push(
        <WhiteGroupRow>
          <GroupRowName href={"/group/" + g2.link}>{g2.name}</GroupRowName>
        </WhiteGroupRow>
      );
    }
  }
  return grouplist;
};

export { renderGroups };
