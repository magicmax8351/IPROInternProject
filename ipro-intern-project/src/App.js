import React, { Component } from "react";
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from "./views/Home";
import Profile from "./views/Profile";
import Dashboard from "./views/Dashboard";
import Settings from "./views/Settings";
import NewsFeed from "./views/NewsFeed";
import GroupPage from "./views/GroupPage";
import Navbar from "./components/Navbar";
import "antd/dist/antd.css";
import NewUser from "./components/NewUser";
import { CookiesProvider } from "react-cookie";
import Login from "./components/Login";
import styled from "styled-components";
import ViewGroups from "./views/ViewGroups";
import Cookies from "js-cookie";

const BackgroundGrey = styled.div`
  background-color: rgb(242, 242, 242);
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      token: Cookies.get("token"),
      loading: 1,
    };
  }
  componentDidMount() {
    if (window.location.pathname.includes("login")) {
      return;
    }
    fetch(
      "http://" +
        window.location.hostname +
        ":8000/users/get?token=" +
        this.state.token,
      {
        credentials: "include",
        "Cache-Control": "no-store",
      }
    )
      .then((res) => {
        if (res.status != 200) {
          console.log(res);
          throw new Error("Invalid user creds!");
        }
        return res.json();
      })
      .then((json) => this.setState({ user: json, loading: 0 }))
      .catch((error) => {
        Cookies.remove("token");
        this.setState({ loading: 0 });
        if (Document.location) {
          Document.location.replace("/login");
        }
      });
  }

  render() {
    return (
      <BackgroundGrey>
        <CookiesProvider>
          <Navbar
            user={this.state.user}
            key={
              this.state.user != null
                ? this.state.user.id
                : Math.floor(Math.random() * 25565)
            }
            loading={this.state.loading}
          />
          <Router>
            <div>
              <Route exact path="/" component={NewsFeed} />
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/dashboard" component={Dashboard} />
              <Route exact path="/settings" component={Settings} />
              <Route exact path="/group/:link" component={GroupPage} />
              <Route exact path="/groups" component={ViewGroups} />
              <Route exact path="/newuser" component={NewUser} />
              <Route exact path="/login" component={Login} />
            </div>
          </Router>
        </CookiesProvider>
      </BackgroundGrey>
    );
  }
}

export default App;
