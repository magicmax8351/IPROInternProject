import React, {Component} from 'react';
import 'antd/dist/antd.css';
import { Avatar } from 'antd';
import CatPhoto from './CatPhoto.jpg';


class ProfilePic extends Component {
    render(){
    return(
        <div className="ProfilePic" >
            <Avatar size = {48} src={CatPhoto} />
        </div>

        );
    }
}

export default ProfilePic;