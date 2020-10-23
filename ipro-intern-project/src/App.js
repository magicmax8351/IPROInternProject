import React, { Component } from 'react'
// eslint-disable-next-line
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

        <div>
          <button type="button" onClick={function() {
            let path = "http://localhost:3000/testpath";
            console.log("The button was clicked. fetching " + path);

            /*var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    console.log(this.responseText);
                }
            };
            xhttp.open("GET", "http://localhost:3000/testpath", true);
            xhttp.send();*/

            fetch(path, {
              "method": "GET",
              "headers": {}
            })
            .then(response => {
              console.log(response);
              response.text().then(function (text) {
                console.log(text);
              });
            })
            .catch(err => {
              console.error(err);
            });

          }}>Enter</button>
        </div>
      </Router>
    )
  }
}

export default App