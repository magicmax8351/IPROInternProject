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
  margin-bottom: 10px;
`;

const UserName = styled.h1`
  font-size: 30px;
  margin: 5px;
  display: inline-block;
  color: #ffffff;
  font-family: "Work-Sans-Light";
`;

const UserDiv = styled.div`
  white-space: nowrap;
`;

let userName = Cookies.get("name");
let userImage = Cookies.get("image");

userName = "martin";
userImage =
  "https://play-lh.googleusercontent.com/IeNJWoKYx1waOhfWF6TiuSiWBLfqLb18lmZYXSgsH1fvb8v1IYiZr5aYWe0Gxu-pVZX3";

const userInfo = (
  <UserDiv>
    <UserImage src={userImage} />
    <UserName>{userName}</UserName>
  </UserDiv>
);

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

const Navbar = (props) => (
  <NavbarDiv>
    <BasicLogo>WINGMAN</BasicLogo>
    <NavbarItemBox>{buildNavbarItems(objs)}</NavbarItemBox>
    {userInfo}
  </NavbarDiv>
);

export default Navbar;
