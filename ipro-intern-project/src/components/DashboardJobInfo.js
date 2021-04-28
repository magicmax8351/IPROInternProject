import React from "react";
import styled from "styled-components";
import { PostBody } from "./Post";

// For icons: https://github.com/FortAwesome/Font-Awesome/tree/master/js-packages/%40fortawesome/free-regular-svg-icons

const MasterPostContainer = styled.div`
  max-width: 100%;
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const Container = styled.div`
  display: flex;
`;

const PostInfoContainer = styled.div``;

const CompanyInfoContainer = styled.div`
  max-width: 100px;
  margin: 10px;
`;

const PostCardHeading = styled.h2`
  font-size: 22pt;
`;

const CompanyLogo = styled.img`
  width: 80%;
`;

const CompanyInfo = styled.p`
  font-size: 10pt;
  color: darkgrey;
  line-height: 1;
  margin-top: 10px;
  font-style: italic;
  max-width: 80px;
  display: block;
  margin-bottom: 0px;
`;

const UserImage = styled.img`
  border-radius: 100px;
  display: inline-block;
  max-width: 30px;
  max-height: 30px;
  margin-right: 10px;
  border: 1px solid black;
`;

const PostButton = styled.button`
  background-color: #7c79a8;
  border-radius: 5px;
  color: white;
  font-size: 18px;
  border: none;
  padding-left: 10px;
  padding-right: 10px;
  transition: 0.1s all ease-out;

  &:hover {
    background-color: #a7a5c6;
    color: white;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px;
  margin-bottom: 0px;
`;

const RightButtonContainer = styled.div`
  width: 28%;
  display: flex;
  justify-content: space-between;
`;

class DashboardJobInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dashboardStatus: props.dashboardStatus,
      buttonText: props.resume.name
    };
    this.job = props.job;
    this.applyFunc = props.applyFunc;
    this.func = props.func;
    this.jobInfoApplyFunc = this.jobInfoApplyFunc.bind(this);
    this.resume = props.resume;
  }

  jobInfoApplyFunc() {
    if (this.state.dashboardStatus == "in your dashboard") {
      return;
    } else {
      this.applyFunc();
      this.setState({ dashboardStatus: "in your dashboard" });
    }
  }

  render() {
    return (
      <MasterPostContainer>
        <Container>
          <CompanyInfoContainer>
            <CompanyLogo
              src={
                "http://" +
                window.location.hostname +
                ":8000/companies/logo/download?company_id=" +
                this.job.company.id
              }
            />
            <CompanyInfo>{this.job.company.name}</CompanyInfo>
            <CompanyInfo>{this.job.location}</CompanyInfo>
          </CompanyInfoContainer>
          <div>
            <PostCardHeading>{this.job.name} | Summer 2021</PostCardHeading>
            <PostBody>{this.job.description}</PostBody>
          </div>
        </Container>
        <ButtonContainer>
          <PostButton onClick={() => window.open(this.job.link)}>
            Job Link
          </PostButton>
          <RightButtonContainer>
            <PostButton
              style={{width: "140px"}} // HACK
              onMouseOver={() => this.setState({ buttonText: "download" })}
              onMouseOut={() => this.setState({ buttonText: this.resume.name })}>{this.state.buttonText}</PostButton>
            <PostButton onClick={this.func}>share</PostButton>
          </RightButtonContainer>
        </ButtonContainer>
      </MasterPostContainer>
    );
  }
}

export default DashboardJobInfo;
