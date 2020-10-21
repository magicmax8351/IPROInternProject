import React from 'react'
import PageHeader from '../components/PageHeader'
import PageContent from '../components/PageContent'
import { Helmet } from 'react-helmet'

const Dashboard = props => (
    <div>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <PageHeader title="Dashboard" />
      <PageContent>
        <p>This is where Dashboard components will go when built :)</p>
      </PageContent>
    </div>
  )
  
  export default Dashboard