import React from "react";
import styled from "styled-components";

const Container = styled.div`
    width: 500px;
    margin-left: auto;
    margin-right: auto;
    background-color: lightgrey;
    padding: 15px;
    border-radius: 20px;
    box-shadow: 8px 8px 15px 1px rgba(0,0,0,0.51);
`

const JobTitle = styled.h3`
    font-size: 36px;
    margin-top: -5px;
`

const CompanyTitle = styled.h3`
    margin-top: -30px;
    font-size: 24px;
    font-weight: 400;
`

const HRLine = styled.hr`
    margin-right: 30px;
    margin-left: 15px;
`

const SectionTitleActive = styled.h5`
    font-size: 18px;
    font-weight: 400;
`

const SectionTitleClosed = styled.h5`
    font-size: 18px;
    font-weight: 100;
`
    

class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comment_expand: 0,
            description_expand: 0, 
            information_expand: 0
        }

        this.renderDescription = this.renderDescription.bind(this);
        this.description_button_event = this.description_button_event.bind(this);
    }

    description_button_event() {
        this.setState({
            description_expand: !this.state.description_expand
        })
    }

    renderDescription() {
        if(this.state.description_expand) {
            return (
            <section>
                <SectionTitleActive>Job Description</SectionTitleActive>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                    commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                    velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                    mollit anim id est laborum
                </p>
                <button onClick={this.description_button_event}>Click here to contract</button>

            </section>
            )
        } else {
            return (
                <section>
                    <SectionTitleClosed>Job Description</SectionTitleClosed>
                    <button onClick={this.description_button_event}>Click here to expand</button>
                </section>
            )
        }

    }


    render() {
        return (
            <Container>
                <JobTitle>Job Title Name</JobTitle>
                <CompanyTitle>Company Name</CompanyTitle>
                <HRLine/>
                {this.renderDescription()}
                <HRLine/>
                <section>
                <SectionTitleActive>Job Information</SectionTitleActive>
                <p>Job information component</p>
                </section>
            </Container>
        )
    }
};

export default Post;
