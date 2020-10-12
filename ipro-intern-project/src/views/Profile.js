import React from 'react'
import PageHeader from '../components/PageHeader'
import PageContent from '../components/PageContent'
import { Helmet } from 'react-helmet'

const Profile = props => (
  <div>
    <Helmet>
        <title>Profile</title>
    </Helmet>
    <PageHeader title="Profile Page" />
    <PageContent>
      <p>This is where to build the profile page. Can't wait to do all the inline design lol</p>

    </PageContent>
  </div>
)

export default Profile