import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import CatPhoto from './CatPhoto.jpg';
import ProfilePic from '../components/ProfilePic';

const Nav = styled.nav`
  display: flex;
  padding: 1.5rem;
  background-color: #7dcfff;
  justify-content: center;

  a {
    margin-right: 5rem;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: inherit;

    &:hover,
    &.active {
      text-decoration: underline;
    }
  }
`


export default props => (
  <Nav>
    <NavLink exact to="/">
      Home
    </NavLink>
    <NavLink to="/profile/">Profile</NavLink>
    <NavLink to="/dashboard/">Dashboard</NavLink>
    <NavLink to="/settings/">Settings</NavLink>
    <ProfilePic />
  </Nav>
)