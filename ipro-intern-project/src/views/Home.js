import React from 'react'
import { Helmet } from 'react-helmet'
import PageHeader from '../components/PageHeader'
import PageContent from '../components/PageContent'
import Post from '../components/Post'

const Home = props => (
  <div>
    <Helmet>
      <title>Home</title>
    </Helmet>
    <PageHeader title="Home Page" />
    <PageContent>
      <Post></Post>
    </PageContent>
  </div>
)

export default Home