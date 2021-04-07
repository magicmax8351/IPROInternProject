import React from 'react'
import PageHeader from '../components/PageHeader'
import PageContent from '../components/PageContent'
import { Helmet } from 'react-helmet'
import DashboardTable from '../components/DashboardTable'
import Cookies from "js-cookie";


class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: Cookies.get("token"),
    };
  }

  render() {
    return (
      <PageContent>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <PageContent>
        <DashboardTable color={this.state.color} token={this.state.token}></DashboardTable>
      </PageContent>
    </PageContent>
    )
  }
}
  
export default Dashboard;