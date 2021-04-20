import React from 'react'
import PageHeader from '../components/PageHeader'
import PageContent from '../components/PageContent'
import { Helmet } from 'react-helmet'
import DashboardTable from '../components/DashboardTable'
import Cookies from "js-cookie";
import dashboardSlim from '../components/dashboardSlim';


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
        <dashboardSlim color={this.state.color} token={this.state.token}></dashboardSlim>
      </PageContent>
    </PageContent>
    )
  }
}
  
export default Dashboard;