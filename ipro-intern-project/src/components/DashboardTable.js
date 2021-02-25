import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor'
import ToolkitProvider from "react-bootstrap-table2-toolkit";



class App extends Component {

  // Will need to pull all data from get functions from backend API to pull real data.

  //https://github.com/react-bootstrap-table/react-bootstrap-table2/issues/215 to get carets working when CSS happens

  constructor(props) {
    super(props);
    this.state = {
      data: null,
      token: props.token
    }
  }

  componentDidMount() {
    console.log(this.state.token);
    fetch("http://localhost:8000/applications/get?token=" + this.state.token, {
      "method": "GET",
      "headers": {}
    })
    .then((res) => res.json())
    .then((json) => this.setState({ data: json.result }));
  }
  
  render() {
    console.log(this.state.data);
    return (
      <h1>Dashboard table is kill</h1>
    );
  }
}

export default App;