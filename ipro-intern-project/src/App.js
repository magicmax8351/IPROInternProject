import React, { Component } from 'react'
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import Home from './views/Home'
import Profile from './views/Profile'
import Dashboard from './views/Dashboard'
import Settings from './views/Settings'
import GroupFeed from './views/GroupFeed'
import NewsFeed from './views/NewsFeed'
import Nav from './components/Nav'
import 'antd/dist/antd.css';
import ProfilePic from './components/ProfilePic';



class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Nav />
          <Route exact path="/" component={Home} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/dashboard" component ={Dashboard}/>
          <Route exact path="/settings" component ={Settings}/>
          <Route exact path="/group/id/:id" component={GroupFeed}/>
          <Route exat path="/feed" component={NewsFeed}/>
        </div>
      </Router>
    )
  }
}

export default App