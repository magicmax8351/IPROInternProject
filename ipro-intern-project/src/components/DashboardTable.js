import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import BootstrapTable from 'react-bootstrap-table-next';


class App extends Component {

  // Will need to pull all data from get functions from backend API to pull real data.

  //https://github.com/react-bootstrap-table/react-bootstrap-table2/issues/215 to get carets working when CSS happens


  state = {
    
    data: [
      {
        // Gets the users profile pic via function or API call
        company: <td><p>Microsoft</p><p>Data Scientist Intern - Summer 2021</p></td>,
        // Card that provides details on 
        tags: 'Martin Shray',
        // Card that provides Job details i.e. Group, post date, application status, location
        location: 'Chicago, IL',
        status: 'Applied',
        resume: 'resume.pdf',
        notes: 'this company is awesome!! :)'
      },
      {
        company: <td><p>DRW</p><p>Quant Trader Intern - Summer 2021</p></td>,
        tags: 'Fin Tech',
        location: 'Chicago, IL',
        status: 'Applied',
        resume: 'resume2.pdf',
        notes: 'Hard interviews'
      },
      {
        company: <td><p>Texas Instruments</p><p>Software Engineering Intern - Summer 2021</p></td>,
        tags: 'CS',
        location: 'Dallas, TX',
        status: 'Applied',
        resume: 'resume.pdf',
        notes: 'I love their products'
      }],
      columns: [       
        {
        dataField: 'company',
        text: 'Post Information',
        sort: true,
        headerStyle:{minWidth: '350px'}
      },
      {
          dataField: 'tags',
          text: 'Tags',
          sort: false,
          headerStyle:{minWidth: '100px'}
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
        formatter: (cellContent, row) => (
            <div className="Checkbox">
              <label>
                <input type="checkbox" checked={ row.applied } />
              </label>
            </div>
          )
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
        formatter: (cellContent, row) => (
            <div className="Checkbox">
              <label>
                <input type="checkbox" checked={ row.r1 } />
              </label>
            </div>
        )
      },
      {
        dataField: 'round2',
        text: 'Round 2',
        sort: true,
        headerStyle:{minWidth: '100px'},
        formatter: (cellContent, row) => (
            <div className="Checkbox">
              <label>
                <input type="checkbox" checked={ row.r2 } />
              </label>
            </div>
        )
      },
      {
        dataField: 'offer',
        text: 'Offer?',
        sort: true,
        headerStyle:{minWidth: '100px'}
      },
      {
        dataField: 'notes',
        text: 'Notes',
        sort: true,
        headerStyle:{minWidth: '300px'}

      }]

  } 


  render() {
    // const selectRow = {
    //     mode: 'checkbox',
    //     clickToSelect: true
    //   };

    return (
      <div className="container" style={{ marginTop: 50 }}>
        

        <BootstrapTable 
        striped
        keyField='id' 
        data={ this.state.data } 
        columns={ this.state.columns } 
        //selectRow={ selectRow }        
        bordered={false}
        header = {true} />
      </div>

    );
  }
}

export default App;