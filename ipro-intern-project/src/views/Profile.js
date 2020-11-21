import React from "react";
import PageHeader from "../components/PageHeader";
import PageContent from "../components/PageContent";
import { Helmet } from "react-helmet";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: null
    }
  }

  componentDidMount() {
    fetch("http://localhost:8000/groups/get")
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
          <table border="1">
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
          </table>
        </PageContent>
      </div>
    );
  }
}

export default Profile;
