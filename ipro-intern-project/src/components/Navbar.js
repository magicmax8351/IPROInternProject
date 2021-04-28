import React from "react";
import styled from "styled-components";
import Cookies from "js-cookie";

const NavbarDiv = styled.div`
  width: 100%;
  background-color: #7c79a8;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
`;

const NavbarItemBox = styled.ul`
  display: flex;
  max-width: 575px;
  width: 100%;
  justify-content: space-between;
`;
const NavbarItem = styled.a`
  margin: 0px 5px 0px 5px;
  font-family: "Work-Sans-Light", sans-serif;
  font-size: 30px;
  color: #ffffff;
`;

const BasicLogo = styled.h1`
  color: #ffffff;
  display: inline-block;
  margin: 10px;
  font-size: 30px;
  width: 150px;
`;

const UserImage = styled.img`
  border-radius: 100px;
  max-height: 30px;
  border: 1px;
`;

const UserName = styled.h1`
  font-size: 30px;
  margin: 5px;
  color: #ffffff;
  font-family: "Work-Sans-Light";
  white-space: nowrap;
`;

const UserNameLink = styled.a`
  font-size: 30px;
  margin: 5px;
  color: #ffffff;
  font-family: "Work-Sans-Light";
`;

const UserDiv = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const LogoImage = styled.img`
  max-height: 50px;
  padding: 5px;
  margin-bottom: 9px;
  margin-right: -7px;
`;

const LogoContainer = styled.div`
  white-space: nowrap;
`;

const getNavbarItem = (obj) => (
  <NavbarItem href={obj.link}>{obj.name}</NavbarItem>
);

// Jank way to stitch the objects together
let names = ["feed", "dashboard", "groups", "jobs"];
let links = ["/", "/dashboard", "/groups", "/jobs"];

let objs = [];
for (let i = 0; i < names.length; i++) {
  objs.push({ link: links[i], name: names[i] });
}

function buildNavbarItems(objs) {
  let outItems = [];
  for (let i = 0; i < objs.length; i++) {
    outItems.push(getNavbarItem(objs[i]));
  }
  return outItems;
}

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.user = props.user;
    this.loading = props.loading;
  }
  render() {
    let userDiv = null;
    if (this.loading == 0 && this.user == null) {
      userDiv = <UserNameLink href="/login">login</UserNameLink>;
    } else if (this.user != null) {
      userDiv = (
        <UserDiv>
          {/* <UserImage src={this.user.pic} /> */}
          <UserName>{this.user.fname.toLowerCase()}</UserName>
        </UserDiv>
      );
    }
    return (
      <NavbarDiv>
        <LogoContainer>
          <LogoImage src="/logo.png" />
          <BasicLogo>wingman</BasicLogo>
        </LogoContainer>
        <NavbarItemBox>{buildNavbarItems(objs)}</NavbarItemBox>
        {userDiv}
      </NavbarDiv>
    );
  }
}

export default Navbar;
