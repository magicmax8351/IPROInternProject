import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor'
import ToolkitProvider from "react-bootstrap-table2-toolkit";



class App extends Component {

  // Will need to pull all data from get functions from backend API to pull real data.

  //https://github.com/react-bootstrap-table/react-bootstrap-table2/issues/215 to get carets working when CSS happens




  data = [
    {
      // Gets the users profile pic via function or API call
      company: <td><p>Microsoft</p><p>Data Scientist Intern - Summer 2021</p></td>,
      // Card that provides details on 
      tags: 'Martin Shray',
      // Card that provides Job details i.e. Group, post date, application status, location
      location: 'Chicago, IL',
      status: false,
      resume: 'resume.pdf',
      round1: true,
      round2: true,
      offer: true,
      notes: 'this company is awesome!! :)'
    },
    {
      company: <td><p>DRW</p><p>Quant Trader Intern - Summer 2021</p></td>,
      tags: 'Fin Tech',
      location: 'Chicago, IL',
      status: true,
      resume: 'resume2.pdf',
      round1: true,
      round2: false,
      offer: false,
      notes: 'Hard interviews'
    },
    {
      company: <td><p>Texas Instruments</p><p>Software Engineering Intern - Summer 2021</p></td>,
      tags: 'CS',
      location: 'Dallas, TX',
      status: true,
      resume: 'resume.pdf',
      round1: true,
      round2: true,
      offer: false,
      notes: 'I love their products'
    }]
  
  //Setup REST endpoint

  getTableData() {
    var jobs =[];
    var jobIDs = [];

    // Get all Job IDs -> Store in jobIDs


    // For each item in the array, call get_job(jobID) ---> Store relevant details into array of dictionaries corresponding to table columns 

    for (var i=0; i < jobIDs.length; i++){
      // Call get_job(jobID) with jobIDs[i]

      // Parse to dictionary
      //Columns --> 'company', 'tags', 'location', 'status' (applied/not applied),'resume', 'round1', 'round2', 'offer', 'notes'

      //Append dictionary to jobs array
      jobs[jobs.length] = null; // Dictionary with 1 job's information
      
    }
    return jobs;
  }
  
  updateCheckbox(rowID){
    //Must be jobs and general rowID once backend integration completes
    //Toggles boolean
    this.data[0]['status'] = !this.data[0]['status'];
    return(this.data[0]['status'])
    //Make sure column formatter is applied again?
  }

  columns = [
    {
      dataField: 'company',
      text: 'Post Information',
      sort: true,
      headerStyle:{minWidth: '350px'}
    },
    {
      dataField: 'tags',
      sort: false,
      //https://www.npmjs.com/package/react-bootstrap-table2-filter
      filter: textFilter({
        placeholder: 'Search tags',
        className: 'tag-filter',
        style: {marginBottom: '-10px'}
      }),
      headerStyle:{minWidth: '200px'}
    },
    {
      dataField: 'location',
      text: 'Location',
      sort: true,
      headerStyle:{minWidth: '150px'}
    },
    {
      dataField: 'status',
      text: 'Applied?',
      sort:true,
      formatter: (is_checked,row) => {
          var temp;
          if (is_checked) {
            // Have checked checkbox
            return(
                <input type="checkbox" checked={ true } onClick={this.updateCheckbox(row)} />
              )
            
          }
          else {
            // Have unchecked box
            return(
              <input type="checkbox" checked={ false } onClick={this.updateCheckbox(row)} />
            )
          }
        }
    },
    {
      dataField: 'resume',
      text: 'Resume',
      sort: true
    },
    {
      dataField: 'round1',
      text: 'Round 1',
      sort: true,
      headerStyle:{minWidth: '100px'},
      formatter: (is_checked,row) => {
        var temp;
        if (is_checked) {
          // Have checked checkbox
          return(
              <input type="checkbox" checked={ true } onClick={this.updateCheckbox(row)} />
            )
          
        }
        else {
          // Have unchecked box
          return(
            <input type="checkbox" checked={ false } onClick={this.updateCheckbox(row)} />
          )
        }
    }
    },
    {
      dataField: 'round2',
      text: 'Round 2',
      sort: true,
      headerStyle:{minWidth: '100px'},
      formatter: (is_checked,row) => {
        var temp;
        if (is_checked) {
          // Have checked checkbox
          return(
              <input type="checkbox" checked={ true } onClick={this.updateCheckbox(row)} />
            )
          
        }
        else {
          // Have unchecked box
          return(
            <input type="checkbox" checked={ false } onClick={this.updateCheckbox(row)} />
          )
        }
    }
    },
    {
      dataField: 'offer',
      text: 'Offer?',
      sort: true,
      headerStyle:{minWidth: '100px'},
      formatter: (is_checked,row) => {
        var temp;
        if (is_checked) {
          // Have checked checkbox
          return(
              <input type="checkbox" checked={ true } onClick={this.updateCheckbox(row)} />
            )
          
        }
        else {
          // Have unchecked box
          return(
            <input type="checkbox" checked={ false } onClick={this.updateCheckbox(row)} />
          )
        }
    }
    },
    {
      dataField: 'notes',
      text: 'Notes',
      sort: true,
      headerStyle:{minWidth: '300px'}

    }];



  


  


  render() {
    // const selectRow = {
    //     mode: 'checkbox',
    //     clickToSelect: true
    //   };
    
    
  


    return (
      
      <ToolkitProvider
        keyField="_id"
        data = { this.data }
        columns = { this.columns }
        bootstrap4
        search
        >
        {props => (
          <div className="container" style={{ marginTop: 50 }}>
            <BootstrapTable
              keyField='id' 
              striped
              bordered={false}
              {...props.baseProps}
              cellEdit={cellEditFactory({
                //mode:"click",
                //blurToSave: true,
                afterSaveCell: (oldValue, newValue, row,column) => {}
              })}
              filter={ filterFactory() }
              header = {true} 
              />  
          </div>
        )}
      </ToolkitProvider>
    );
  }
}

export default App;