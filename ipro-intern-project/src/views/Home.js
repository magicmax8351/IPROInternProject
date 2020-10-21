import React from 'react'
import { Helmet } from 'react-helmet'
import PageHeader from '../components/PageHeader'
import PageContent from '../components/PageContent'

const Home = props => (
  <div>
    <Helmet>
      <title>Home</title>
    </Helmet>
    <PageHeader title="Home Page" />
    <PageContent>
      <p>Welcome home!</p>
      
    </PageContent>
  </div>
)

export default Home