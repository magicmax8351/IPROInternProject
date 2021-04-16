import React, { Component } from "react";
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from "./views/Home";
import Profile from "./views/Profile";
import Dashboard from "./views/Dashboard";
import Settings from "./views/Settings";
import NewsFeed from "./views/NewsFeed";
import GroupPage from "./views/GroupPage"
import Navbar from "./components/Navbar";
import "antd/dist/antd.css";
import NewUser from "./components/NewUser";
import { CookiesProvider } from "react-cookie";
import Login from "./components/Login";
import styled from "styled-components";
import ViewGroups from "./views/ViewGroups"

const BackgroundGrey = styled.div`
  background-color: #f0f0f0;
`;

class App extends Component {
  componentDidMount() {
    if(window.location.pathname.includes("login")) {
      return;
    }
    fetch(
      "http://" +
        window.location.hostname +
        ":8000/token/test",
        {
          credentials: "include",
          "Cache-Control": "no-store"
        }
    ).then(res => res.status)
    .then(status => {
      if(status == 200) {
        return; 
      } else if (status == 422) {
        window.location.replace("/login")
      } else {
        alert("Some other error!");
      }
    })
  }
  render() {
    return (
      <BackgroundGrey>
        <CookiesProvider>
          <Navbar />
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
