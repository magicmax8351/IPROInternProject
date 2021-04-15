import React from "react";
import styled from "styled-components";
import Cookies from "js-cookie";
import "../styled";
import { MasterPostContainer, UserImage } from "../components/Post";
import Modal from "react-bootstrap/Modal";
import GroupHeaderCard from "../components/GroupHeaderCard";
import NewGroup from "../components/NewGroup";

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

const UserInput = styled.input`
  background: #f0f0f0;
  border: none;
  font-size: 14px;
  width: 100%;
  color: black;
`;

const NewPostContainer = styled(MasterPostContainer)`
  display: flex;
`;

const GroupDescription = styled.p`
  margin-bottom: 0px;
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

  componentDidMount() {
    fetch(
      "http://" +
        window.location.hostname +
        ":8000/group/list?browse=true&token=" +
        this.state.token
    )
      .then((res) => res.json())
      .then((json) => {
        let groupsSorted = json
          .sort(this.alphabeticalSort)
          .sort(this.compareUserInGroups);
        this.setState({ groups: groupsSorted });
      });
  }

  render() {
    if (this.state.groups == null) {
      return null;
    }
    let groups_rendered = this.state.groups
        .filter((x) => x.name.toLowerCase().includes(this.state.filter.toLowerCase()))
        .map((x) => <GroupHeaderCard token={this.state.token} key={x.id} group={x} />)
    
    let new_group_modal = this.getNewGroupModal();
    return (
      <div>
        {new_group_modal}
        <FeedContainer>
          <PostsContainer>
            <TopRowContainer>
              <SearchContainer>
                <h4>filter</h4>
                <UserInput
                  onChange={this.enter_filter}
                  placeholder="enter a filter"
                />
              </SearchContainer>
              <SearchContainer>
                <h4>create a new group</h4>
                <MakeNewPostButton onClick={() => this.setState({ showNewGroupModal: true })}>Group Name</MakeNewPostButton>
              </SearchContainer>
            </TopRowContainer>
            {groups_rendered}
          </PostsContainer>
        </FeedContainer>
      </div>
    );
  }
}

export default ViewGroups;
