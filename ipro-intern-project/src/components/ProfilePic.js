// import React, { Component } from "react";
// import "antd/dist/antd.css";
// import { Avatar } from "antd";
// import styled from "styled-components";
// import Cookies from "js-cookie";

// const StyledButton = styled.button`
//   background-color: lightgrey;
//   padding: 1px;
//   border-radius: 100px;
// `;

// class ProfilePic extends Component {
//   logout() {
//     Cookies.remove("token");
//     Cookies.remove("fname");
//     document.location.replace("/");
//   }
//   render() {
//     const fname = Cookies.get("fname");
//     return (
//       <div className="ProfilePic">
//         <StyledButton>
//           <Avatar size={48} src={CatPhoto} />
//         </StyledButton>
//         <p>Welcome, {fname}!</p> {/* DEBUG ONLY FOR NOW */ }
//         <button onClick={this.logout}>Logout!</button>
//       </div>
//     );
//   }
// }

// export default ProfilePic;
