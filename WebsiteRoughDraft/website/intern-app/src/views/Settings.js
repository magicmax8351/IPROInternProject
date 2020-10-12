import React from 'react'
import PageHeader from '../components/PageHeader'
import PageContent from '../components/PageContent'
import { Helmet } from 'react-helmet'

const Settings = props => (
    <div>
      <Helmet>
        <title>Settings</title>
      </Helmet>
      <PageHeader title="Settings" />
      <PageContent>
        <p>This is where we wil build the settings page as well :)</p>
      </PageContent>
    </div>
  )
  
  export default Settings