import React from "react";
import styled from "styled-components";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

const GroupImageContainer = styled.div`
  max-width: 700px;
  margin-bottom: 10px;
  border-radius: 5px;
`;

const GroupImage = styled.img`
  max-width: 100%;
  max-height: 100px;
  object-fit: cover;
  width: 100%;
  border-radius: 5px 5px 0px 0px;
`;

const NameFlexBox = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  background: white;
  border-radius: 0px 0px 5px 5px;
  padding: 5px;
`;

const GroupImageName = styled.a`
  margin-bottom: 0px;
  max-height: 200px;
  padding: 5px;
  font-size: 24px;
  color: black;
  transition: 0.1s;
  border-radius: 10px;
  border: solid white 2px;
  &:hover {
    color: black;
    border: solid grey 2px;
    text-decoration: none;
  }
`;

const ActiveUserInGroupButton = styled.button`
  height: 80%;
  margin-top: auto;
  margin-bottom: auto;
  border-radius: 5px;
  background: white;
  margin-left: 10px;
  font-size: 18px;
  padding: 10px;
  border: solid;
  padding-top: 3px;
`;

const ActiveUserNotInGroupButton = styled(ActiveUserInGroupButton)`
  background: #7c79a8;
  color: white;
  border: none;
  white-space: nowrap;
`;

const ButtonDiv = styled(NameFlexBox)`
  max-width: 300px;
  margin-left: auto;
  justify-content: flex-end;
`;

const popover = (
  <Popover id="popover-basic">
    <Popover.Title as="h3">Group Link</Popover.Title>
    <Popover.Content>
      Copied the group link to clipboard! Anyone you share it with can join.
    </Popover.Content>
  </Popover>
);



class GroupHeaderCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group: props.group,
      groupUrl: ("http://" + window.location.hostname + "/group/" + props.group.link)
    }
    this.token = props.token;
    this.joinGroup = this.joinGroup.bind(this);
  }

  joinGroup() {
    console.log(this);
    fetch(
      "http://" +
        window.location.hostname +
        ":8000/group/join?token=" + this.token + "&group_link=" + this.state.group.link)
      .then((res) => res.status)
      .then((status) => {
        if(status == 200) {
          let newGroup = this.state.group
          newGroup.activeUserInGroup = true;
          this.setState({group: newGroup});
        } else {
          alert("Failed to join group!");
        }
        return null;
      });
    }
  

  render() {
    let userGroupButton;
    if (this.state.group.activeUserInGroup) {
      userGroupButton = (
        <ButtonDiv>
          <ActiveUserInGroupButton>in group</ActiveUserInGroupButton>
          <OverlayTrigger
            trigger="click"
            placement="right"
            overlay={popover}
          >
            <ActiveUserNotInGroupButton
              onClick={() => navigator.clipboard.writeText(this.state.groupUrl)}
            >
              share
            </ActiveUserNotInGroupButton>
          </OverlayTrigger>
        </ButtonDiv>
      );
    } else {
      userGroupButton = (
        <ButtonDiv>
            <ActiveUserNotInGroupButton onClick={this.joinGroup}>
              join
            </ActiveUserNotInGroupButton>
        </ButtonDiv>
      );
    }
    return (
      <GroupImageContainer>
        <GroupImage src={this.state.group.background} />
        <NameFlexBox>
          <GroupImageName href={"/group/" + this.state.group.link}>
            {this.state.group.name}
          </GroupImageName>
          {userGroupButton}
        </NameFlexBox>
      </GroupImageContainer>
    );
  }
}

export default GroupHeaderCard;
