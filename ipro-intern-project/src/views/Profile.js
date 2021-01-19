import React from "react";
import styled from "styled-components";
import PageHeader from "../components/PageHeader";
import PageContent from "../components/PageContent";
import { Helmet } from "react-helmet";
import Cookies from "js-cookie";

const Container = styled.div`
  font-family: "Open Sans", sans-serif;
  width: 650px;
  margin-left: auto;
  margin-right: auto;
  background-color: lightgrey;
  padding: 15px;
  border-radius: 20px;
  box-shadow: 8px 8px 15px 1px rgba(0, 0, 0, 0.51);
  margin-bottom: 30px;
`;

const GroupName = styled.h3`
  font-size: 36px;
  margin-top: -5px;
`;

const TitleHyperlink = styled.a`
  color: #000;
  -o-transition: none;
  -ms-transition: none;
  -moz-transition: none;
  -webkit-transition: none;
  transition: none;
  &:hover {
    text-decoration: underline;
  }
`;

const GroupDescription = styled.h3`
  margin-top: -20px;
  font-size: 24px;
  font-weight: 400;
`;

const HRLine = styled.hr`
  margin-right: 30px;
  margin-left: 15px;
  margin-bottom: 20px;
`;

const GroupButton = styled.button`
  margin: .5em;
`;

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: null,
      token: Cookies.get("token")
    }
  }

  componentDidMount() {
    fetch("http://localhost:8000/groups/get?token=" + this.state.token)
      .then((res) => res.json())
      .then((json) => {
        this.setState({ groups: json });
      });
  }

  render() {
    if(!this.state.groups) {
      return null;
    }
    return (
      <div>
        <Helmet>
          <title>Profile</title>
        </Helmet>
        <PageHeader title="Profile Page" />
        <PageContent>
          <h1>My Groups</h1>
          {/*}<table border="1">
            <tbody>
              {this.state.groups.map((g) => {
                return (
                  <tr>
                    <td>
                      <img src={g.icon} />
                    </td>
                    <td key={"group_" + g.id}>
                      <a href={"http://localhost:3000/group/id/" + g.id}>
                        {g.name}
                      </a>
                    </td>
                    <td>
                      <button type="button">Leave Group</button>
                    </td>
                    <td>
                      <button type="button">Add Member</button>
                    </td>
                    <td>
                      <button type="button">create Post</button>
                    </td>
                    <td>
                      <button type="button">View Statistics</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            </table>{*/}
            {this.state.groups.map((g) => {
                return (
                  <Container>
                    <GroupName><TitleHyperlink href={"http://localhost:3000/group/id/" + g.id}>{g.name}</TitleHyperlink></GroupName>
                    <GroupDescription>{g.desc}</GroupDescription>
                    <HRLine />
                    <GroupButton type="button">View Group</GroupButton>
                    <GroupButton type="button">Leave Group</GroupButton>
                    <GroupButton type="button">Add Member</GroupButton>
                    <GroupButton type="button">Create Post</GroupButton>
                    <GroupButton type="button">View Statistics</GroupButton>
                  </Container>
                );
              })}
        </PageContent>
      </div>
    );
  }
}

export default Profile;
