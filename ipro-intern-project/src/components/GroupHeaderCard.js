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
  max-height: 36px;
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

function buildPopover(url) {
  return (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Group Link</Popover.Title>
      <Popover.Content>
        <p>
          Copied the group link to clipboard! Anyone you share it with can join.
        </p>
        <a href={url}>{url}</a>
      </Popover.Content>
    </Popover>
  );
}

class GroupHeaderCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group: props.group,
      groupUrl:
        "http://" + window.location.hostname + "/group/" + props.group.link,
      buttonText: "in group",
    };
    this.token = props.token;
    this.joinGroup = this.joinGroup.bind(this);
    this.leaveGroup = this.leaveGroup.bind(this);
  }

  joinGroup() {
    fetch(
      "http://" +
        window.location.hostname +
        ":8000/group/join?token=" +
        this.token +
        "&group_link=" +
        this.state.group.link
    )
      .then((res) => res.status)
      .then((status) => {
        if (status == 200) {
          let newGroup = this.state.group;
          newGroup.activeUserInGroup = true;
          this.setState({ group: newGroup });
        } else {
          alert("Failed to join group!");
        }
        return null;
      });
  }

  leaveGroup() {
    fetch(
      "http://" +
        window.location.hostname +
        ":8000/group/leave?group_link=" +
        this.state.group.link,
      {
        method: "POST",
        credentials: "include",
      }
    )
      .then((res) => res.status)
      .then((status) => {
        if (status == 200) {
          this.setState({ buttonText: "left group" });
        } else {
          this.setState({ buttonText: "failed to leave group" });
        }
      });
    return "leaving group";
  }

  render() {
    let userGroupButton;
    if (this.state.group.activeUserInGroup) {
      userGroupButton = (
        <ButtonDiv>
          <ActiveUserInGroupButton
            onMouseOver={() => {
              if (this.state.buttonText == "in group") {
                this.setState({ buttonText: "leave group?" });
              }
            }}
            onMouseOut={() => {
              if (this.state.buttonText == "leave group?") {
                this.setState({ buttonText: "in group" });
              }
            }}
            onClick={() => {
              if (this.state.buttonText == "in group") {
                return;
              } else if (this.state.buttonText == "leave group?") {
                this.setState({ buttonText: "please confirm" });
              } else if (this.state.buttonText == "please confirm") {
                this.setState({
                  buttonText: this.leaveGroup(this.state.group.link),
                });
              } else if (this.state.buttonText == "left group") {
                this.setState({ buttonText: "please stop clicking" });
              }
            }}
          >
            {this.state.buttonText}
          </ActiveUserInGroupButton>
          <OverlayTrigger
            trigger="click"
            placement="right"
            overlay={buildPopover(this.state.groupUrl)}
          >
            <ActiveUserNotInGroupButton
              onClick={() => navigator.clipboard.writeText(this.state.groupUrl)}
              // visibility={(this.state.buttonText == "left group") ? "hidden" : "visible"}
              visibility="hidden"
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

export { ActiveUserNotInGroupButton };
