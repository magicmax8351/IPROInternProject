import React, {Component} from 'react';
import 'antd/dist/antd.css';
import { Avatar } from 'antd';
import CatPhoto from './CatPhoto.jpg';
import styled from "styled-components";

const StyledButton = styled.button`
    background-color: lightgrey;
    padding: 2px;
    border-radius: 100px;
`

class ProfilePic extends Component {
    render(){
    return(
        <div className="ProfilePic" >
            <StyledButton>
            <Avatar size = {48} src={CatPhoto} />
            </StyledButton>
        </div>

        );
    }
}

export default ProfilePic;