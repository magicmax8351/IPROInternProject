import React from "react";
import styled from "styled-components";

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

class GroupHeaderCard extends React.Component {
  constructor(props) {
    super(props);
    this.group = props.group;
  }
  render() {
    let userGroupButton;
    if (this.group.activeUserInGroup) {
      userGroupButton = (
        <ButtonDiv>
          <ActiveUserInGroupButton>in group</ActiveUserInGroupButton>
          <ActiveUserNotInGroupButton>share</ActiveUserNotInGroupButton>
        </ButtonDiv>
      );
    } else {
      userGroupButton = (
        <ButtonDiv>
          <ActiveUserNotInGroupButton>join</ActiveUserNotInGroupButton>
        </ButtonDiv>
      );
    }
    return (
      <GroupImageContainer>
        <GroupImage src={this.group.background} />
        <NameFlexBox>
          <GroupImageName href={"/group/" + this.group.link} >{this.group.name}</GroupImageName>
          {userGroupButton}
        </NameFlexBox>
      </GroupImageContainer>
    );
  }
}

export default GroupHeaderCard;
