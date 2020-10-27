import React, { Component } from 'react'
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import Home from './views/Home'
import Profile from './views/Profile'
import Dashboard from './views/Dashboard'
import Settings from './views/Settings'
import Nav from './components/Nav'

class HunterTable extends Component {
  render() {
    return (
      <table border="1">
        <thead>
          <tr>
            <th>Text Received</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{this.props.textRecieved}</td>
          </tr>
        </tbody>
      </table>
    )
  }
}

class HunterTest extends Component {
  constructor(props) {
    super(props);
    this.enterButton = this.enterButton.bind(this);
    this.onTextChange = this.onTextChange.bind(this);

    this.state = {
      name: '',
      textRecieved: ''
    }
  }

  onTextChange(event) {
    this.setState({name: event.target.value});
  }

  processRecievedText(text) {
    console.log(text);
    this.setState({textRecieved: text.textRecieved});
  }

  enterButton() {
    let path = "http://localhost:8000/testpath";
    console.log("The button was clicked. fetching " + path);

    let data = {
      name: this.state.name,
      price: 10.5
    };

    fetch(path, {
      method: "POST",
      headers: { 
        'Content-Type':  
            'application/json;charset=utf-8' 
      }, 
      body: JSON.stringify(data)
    })
    .then(response => {
      response.json().then(text => this.processRecievedText(text));
    })
    .catch(err => {
      console.error(err);
    });
  }

  render() {
    return (
      <div>
        <span>Enter Text:</span>
        <input type="text" id="hunterText" onChange={this.onTextChange} />
        <button type="button" onClick={this.enterButton}>Enter</button>
        <HunterTable textRecieved={this.state.textRecieved} />
      </div>
    )
  }
}

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

        <HunterTest />
      </Router>
    )
  }
}

export default App