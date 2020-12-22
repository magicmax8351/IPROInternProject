import React, { Component } from "react";
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from "./views/Home";
import Profile from "./views/Profile";
import Dashboard from "./views/Dashboard";
import Settings from "./views/Settings";
import GroupFeed from "./views/GroupFeed";
import NewsFeed from "./views/NewsFeed";
import Nav from "./components/Nav";
import "antd/dist/antd.css";
import ProfilePic from "./components/ProfilePic";
import NewUser from "./components/NewUser";
import { CookiesProvider } from "react-cookie";

class App extends Component {
  render() {
    return (
      <CookiesProvider>
        <Router>
          <div>
            <Nav />
            <Route exact path="/" component={NewsFeed} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/settings" component={Settings} />
            <Route exact path="/group/id/:id" component={GroupFeed} />
            <Route exact path="/newuser" component={NewUser} />
          </div>
        </Router>
      </CookiesProvider>
    );
  }
}

export default App;
