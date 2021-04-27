import React from "react";
import styled from "styled-components";
import Cookies from "js-cookie";
import "../styled";
import { MasterPostContainer, UserImage } from "../components/Post";
import Modal from "react-bootstrap/Modal";
import GroupHeaderCard from "../components/GroupHeaderCard";
import NewGroup from "../components/NewGroup";
import JoinGroup from "../components/JoinGroup";
import { renderGroups } from "./GroupPage";
import { UserInput, SidebarFlexContainer, SidebarContainer } from "./NewsFeed";
import { PostButton } from "../components/Post";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";

import Form from "react-bootstrap/Form";

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
  max-width: 630px;
  min-width: 500px;
`;

const TopRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  border-radius: 10px;
  background: white;
  margin-bottom: 10px;
`;

const SearchContainer = styled.div`
  border: solid grey 1px;
  padding: 5px;
  margin: 10px;
  border-radius: 5px;
  width: 100%;
`;

const CreateGroupButton = styled(PostButton)`
  border: 2px solid white;
  width: 100%;
`;

const JoinGroupButton = styled(PostButton)`
  border: solid 2px white;
  background: none;
  color: black;
  border: solid grey 2px;
  width: 100%;
  &:hover {
    background-color: white;
    color: black;
    border: solid grey 2px;
    text-decoration: none;
    box-shadow: 1px 1px 5px lightgrey;
  }
`;

const MakeNewPostButton = styled.button`
  background: #f0f0f0;
  font-size: 14px;
  width: 100%;
  text-align: left;
  border-radius: 5px;
  border: none;
  color: black;
  padding-left: 2px;
`;

const RowFlex = styled.div`
  display: flex;
  justify-content: space-between;
`;

const OtherOptionsBox = styled(SidebarContainer)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 135px;
`;

class ViewGroups extends React.Component {
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
      groups: null,
      token: Cookies.get("token"),
      filter: "",
      showMyGroups: true,
      sortMethod: "alphabetical",
      joinNewGroupModal: false,
      showNewGroupModal: false,
    };

    this.enter_filter = this.enter_filter.bind(this);
  }

  enter_filter(event) {
    this.setState({ filter: event.target.value });
  }

  compareUserInGroups(a, b) {
    if (a.activeUserInGroup && !b.activeUserInGroup) {
      return -1;
    } else if (!a.activeUserInGroup && b.activeUserInGroup) {
      return 1;
    } else {
      return 0;
    }
  }

  alphabeticalSort(a, b) {
    if (a.name > b.name) {
      return 1;
    } else if (b.name > a.name) {
      return -1;
    } else {
      return 0;
    }
  }

  memberSort(a, b) {
    if (a.memberCount > b.memberCount) {
      return -1;
    } else if (b.memberCount > a.memberCount) {
      return 1;
    } else {
      return 0;
    }
  }

  getNewGroupModal() {
    let newModal = (
      <Modal
        size="lg"
        show={this.state.showNewGroupModal}
        onHide={() => this.setState({ showNewGroupModal: false })}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NewGroup
            token={this.state.token}
            func={() => this.setState({ showNewGroupModal: false })}
          />
        </Modal.Body>
      </Modal>
    );
    return newModal;
  }

  getJoinGroupModal() {
    let newModal = (
      <Modal
        size="lg"
        show={this.state.joinNewGroupModal}
        onHide={() => this.setState({ joinNewGroupModal: false })}
      >
        <Modal.Header closeButton>
          <Modal.Title>Join Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <JoinGroup
            token={this.state.token}
            func={() => this.setState({ joinNewGroupModal: false })}
          />
        </Modal.Body>
      </Modal>
    );
    return newModal;
  }

  componentDidMount() {
    fetch(
      "http://" +
        window.location.hostname +
        ":8000/group/list?browse=true&token=" +
        this.state.token
    )
      .then((res) => res.json())
      .then((json) => {
        let groupsSorted = json.sort(this.alphabeticalSort);
        this.setState({ groups: groupsSorted });
      });
  }

  render() {
    if (this.state.groups == null) {
      return null;
    }

    let groups_sorted = this.state.groups;
    if (this.state.sortMethod == "alphabetical") {
      groups_sorted = groups_sorted.sort(this.alphabeticalSort);
    } else if (this.state.sortMethod == "members") {
      groups_sorted = groups_sorted.sort(this.memberSort);
    } else {
      groups_sorted = shuffle(groups_sorted);
    }

    let groups_rendered = this.state.groups
      .filter((x) =>
        x.name.toLowerCase().includes(this.state.filter.toLowerCase())
      )
      .filter(
        (x) =>
          this.state.showMyGroups || !x.activeUserInGroup || x.preserveGroup
      )
      .map((x) => (
        <GroupHeaderCard
          token={this.state.token}
          key={x.id}
          group={x}
          memberCount={x.memberCount - (x.activeUserInGroup ? 1 : 0)}
          func={() => this.forceUpdate()}
        />
      ));

    let new_group_modal = this.getNewGroupModal();
    let join_group_modal = this.getJoinGroupModal();

    return (
      <div>
        {new_group_modal}
        {join_group_modal}
        <FeedContainer>
          <SidebarFlexContainer>
            <SidebarContainer>
              <h4>your groups</h4>
              {renderGroups(this.state.groups)}
            </SidebarContainer>
            <SidebarContainer>
              <JoinGroupButton
                onClick={() => this.setState({ joinNewGroupModal: true })}
              >
                join a private group
              </JoinGroupButton>
            </SidebarContainer>
            <SidebarContainer>
              <CreateGroupButton
                onClick={() => this.setState({ showNewGroupModal: true })}
              >
                create a new group
              </CreateGroupButton>
            </SidebarContainer>
          </SidebarFlexContainer>
          <PostsContainer>{groups_rendered}</PostsContainer>
          <SidebarFlexContainer>
            <SidebarContainer>
              <h3>public groups</h3>
            </SidebarContainer>
            <SidebarContainer>
              <h4>filter groups</h4>
              <UserInput
                onChange={this.enter_filter}
                placeholder="enter a filter"
              />
            </SidebarContainer>
            <OtherOptionsBox>
              <h4>other options</h4>
              <Form.Check
                type="switch"
                id="my-groups-switch"
                label="Hide my groups"
                onChange={(event) =>
                  this.setState({ showMyGroups: !this.state.showMyGroups })
                }
              />
              <ToggleButtonGroup
                defaultValue={"alphabetical"}
                type="radio"
                name="options"
                onClick={(event) =>
                  this.setState({ sortMethod: event.target.value })
                }
              >
                <ToggleButton
                  style={{ whiteSpace: "nowrap" }}
                  variant="secondary"
                  value="alphabetical"
                >
                  a-z
                </ToggleButton>
                <ToggleButton
                  variant="secondary"
                  value="members"
                  onClick={(event) =>
                    this.setState({ sortMethod: event.target.value })
                  }
                >
                  members
                </ToggleButton>
                <ToggleButton
                  variant="secondary"
                  style={{ whiteSpace: "nowrap" }}
                  value="random"
                  onClick={(event) =>
                    this.setState({ sortMethod: event.target.value })
                  }
                >
                  suprise me
                </ToggleButton>
              </ToggleButtonGroup>
            </OtherOptionsBox>
          </SidebarFlexContainer>
        </FeedContainer>
      </div>
    );
  }
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export default ViewGroups;
