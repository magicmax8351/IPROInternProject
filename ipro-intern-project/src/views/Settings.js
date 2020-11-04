import React from 'react';
import PageHeader from '../components/PageHeader';
import PageContent from '../components/PageContent';
import { Helmet } from 'react-helmet';
// import Button from 'react-bootstrap/Button';
import Button from '../components/Button';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';

const Settings = props => (
  <div>
    <Helmet>
      <title>Settings</title>
    </Helmet>
    <PageHeader title="Settings" />
    <PageContent>
    <Button variant="Personal" size="lg">Personal</Button>
    <Button variant="Privacy">Privacy</Button>
    <Button variant="Groups">Groups</Button>
    <Button variant="Resumes">Resumes</Button>
      Personal
      Name
      Email Addresss
      Location
      Languages
      Institution
      Graduation Date
      </PageContent>
      <PageContent>
        Privacy
      </PageContent>
      <PageContent>Who can view my profile?
      Who can view my post history?</PageContent>
  </div>



)

export default Settings