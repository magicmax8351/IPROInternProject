import React from "react";
import styled from "styled-components";


// For icons: https://github.com/FortAwesome/Font-Awesome/tree/master/js-packages/%40fortawesome/free-regular-svg-icons

const MasterPostContainer = styled.div`
  max-width: 900px;
  background-color: white;
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
    background-color: #A7A5C6;
    color: white;
  }

`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px;
  margin-bottom: 0px;
`;

class JobInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        dashboardStatus: props.dashboardStatus
    }
    this.job = props.job;
    this.applyFunc = props.applyFunc;
    this.jobInfoApplyFunc = this.jobInfoApplyFunc.bind(this);
  }

  jobInfoApplyFunc() {
      if(this.state.dashboardStatus == "in your dashboard") {
          return;
      } else {
          this.applyFunc();
          this.setState({dashboardStatus: "in your dashboard"});
      }
  }

  render() {
    return (
      <MasterPostContainer>
        <Container>
          <CompanyInfoContainer>
            <CompanyLogo src={"http://" + window.location.hostname +":8000/companies/logo/download?company_id=" + this.job.company.id} />
            <CompanyInfo>{this.job.company.name}</CompanyInfo>
            <CompanyInfo>{this.job.location}</CompanyInfo>
          </CompanyInfoContainer>
          <div>
            <PostCardHeading>
              {this.job.name} | Summer 2021
            </PostCardHeading>
            <p>{this.job.description}</p>
          </div>
        </Container>
        <ButtonContainer>
          <PostButton>company info</PostButton>
          <PostButton>view posts</PostButton>
          <PostButton disabled={this.state.dashboardStatus.includes("in")} onClick={this.jobInfoApplyFunc}>{this.state.dashboardStatus}</PostButton>
          <PostButton onClick={() => window.open(this.job.link)}>apply</PostButton>
        </ButtonContainer>
      </MasterPostContainer>
    );
  }
}

export default JobInfo;
