import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import Home from './views/Home'
import Profile from './views/Profile'
import Dashboard from './views/Dashboard'
import Settings from './views/Settings'
import Nav from './components/Nav'


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
        </div>
      </Router>
    )
  }
}

export default App