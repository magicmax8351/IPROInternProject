import React from "react";
import styled from "styled-components";
// Investigate https://fontawesome.com/how-to-use/on-the-web/using-with/react

const Container = styled.div`
    width: 650px;
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
    margin-bottom: 20px;
`

const SectionTitleActive = styled.h5`
    font-size: 22px;
    font-weight: 400;
`

const SectionTitleClosed = styled.h5`
    font-size: 22px;
    font-weight: 100;
`

const GroupPost = styled.p`
    position: absolute;
    margin-left: 590px;
    margin-top: -10px;
    font-style: italic;
`
    
const CommentAvatar = styled.img`
    width: 60px;
    height: 60px;
    margin-left: 16px;
    margin-bottom: 10px;
`
const CommentAuthor = styled.p`
    position: relative;
    font-style: italic;
    margin-top: -3px;
    width: 90px;
    font-size: 14px;
    margin-left: 10px; 

`

const CommentReplyTo = styled.p`
    position: absolute;
    margin-top: -130px;
    margin-left: 480px;
    float: right;
    font-style: italic;
`

const CommentBody = styled.p`
    width: 70%;
    margin-left: 120px;
    margin-top: -100px;
    margin-bottom: 60px;
    
`

const CommentSubject = styled.p`
    position: absolute;
    margin-top: -130px;
    margin-left: 120px;
    font-size: 18px;
`

const CommentID = styled.p`
    position: relative;
    font-style: italic;
    width: 80px;
    font-size: 14px;
    margin-left: 10px;
    margin-top: -10px; 
    margin-bottom: 5px;
`

const Comment = props => (
    /* author, author_avatar, reply_to, subject, body */
    <div>
        <CommentAvatar src={props.props.author_avatar}/> {console.log(props)}
        <CommentAuthor>{props.props.author}</CommentAuthor>
        <CommentID>Post #{props.props.post_id}</CommentID>
        <CommentReplyTo>In response to #{props.props.reply_to}</CommentReplyTo>
        <CommentSubject>{props.props.subject}</CommentSubject>
        <CommentBody>{props.props.body}</CommentBody>
        <HRLine/>
    </div>
)

class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comment_expand: 0,
            description_expand: 0, 
            information_expand: 0,
            comment_expand: 0
        }

        this.renderDescription = this.renderDescription.bind(this);
        this.renderInformation = this.renderInformation.bind(this);
        this.renderComments = this.renderComments.bind(this);
        this.renderCommentSection = this.renderCommentSection.bind(this);

        this.description_button_event = this.description_button_event.bind(this);
        this.information_button_event = this.information_button_event.bind(this);
        this.comment_button_event = this.comment_button_event.bind(this);

        this.comments = [
        {
            key: 0,
            author:"Justin Schmitz",
            author_avatar:"https://www.flaticon.com/svg/static/icons/svg/194/194938.svg",
            post_id:"421",
            reply_to:"443",
            subject:"BIG MOOD ENERGY",
            body:"I agree! Wells fargo reminds me of the Big Bad Wolf from Red Riding Hood. I think they're bad :(. "
        }, 
        {
            key: 1,
            author:"Maxwell Buffo",
            author_avatar:"https://www.flaticon.com/svg/static/icons/svg/1818/1818401.svg",
            post_id:"422",
            reply_to:"445",
            subject:"Totally True 😊",
            body:"I agree! I always love the stories you tell <3 Keep it up tiger!! uWu"
        },
        {
            key: 2,
            author: "Alan Cramb",
            author_avatar: "https://www.iit.edu/sites/default/files/styles/width_220/public/2019-11/alan_cramb_320x355.jpg?itok=TsAY30A_",
            post_id: "532",
            reply_to: "251",
            subject: "University Communication",
            body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vel justo vel lectus aliquet pulvinar. Sed dui dolor, hendrerit sit amet velit ac, ornare placerat velit. Sed leo est, mattis vel pulvinar a, rutrum eu mauris. Aliquam vitae pretium lorem. Suspendisse varius arcu velit, a elementum enim pretium vel. Duis ut egestas sem. Curabitur efficitur semper elit. Cras condimentum pretium velit, eu ultrices eros dignissim sed. Mauris aliquam faucibus ex, vitae finibus nisl consectetur nec. Suspendisse sed bibendum est. \n\nMorbi eu lacinia urna. Nam a justo id massa porttitor malesuada non eget quam. Nunc ultrices lectus mi, vehicula dapibus ligula pretium non. Praesent sit amet quam diam. Donec vulputate ligula eget felis ultricies, ac lacinia ante faucibus. Duis nec nisi nisi. Aenean sed facilisis felis, et vehicula orci. Maecenas eget mauris eget metus vulputate laoreet quis a ante. Suspendisse id porttitor purus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec fringilla ultrices neque ut feugiat. Fusce eget molestie velit. Sed in enim bibendum ex ullamcorper malesuada et sed risus. Donec consequat nisl est, eu suscipit lacus condimentum id."
        }
        ]
    }

    description_button_event() {
        this.setState({
            description_expand: !this.state.description_expand
        })
    }
    information_button_event() {
        this.setState({
            information_expand: !this.state.information_expand
        })
    }
    comment_button_event() {
        this.setState({
            comment_expand: !this.state.comment_expand
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

    renderInformation() {
        if(this.state.information_expand) {
            return (
                <section>
                <SectionTitleActive>Job Information</SectionTitleActive>
                <p>Job information component</p>
                <button onClick={this.information_button_event}>Click here to contract</button>
                </section>
            )
        } else {
            return (
                <section>
                    <SectionTitleClosed>Job Information</SectionTitleClosed>
                    <button onClick={this.information_button_event}>Click here to expand</button>
                </section>
            )
        }
    }

    renderComments(num_comments) {
        let ret = [];
        for(let i = 0; i < Math.min(num_comments, this.comments.length); i++) {
            ret.push(<Comment props={this.comments[i]} key={this.comments[i].key}/>)
        }
        if(num_comments > 1) {
            for(let i = 0; i < Math.min(num_comments, this.comments.length); i++) {
                ret.push(<Comment props={this.comments[i]} key={this.comments[i].key}/>)
            }
            for(let i = 0; i < Math.min(num_comments, this.comments.length); i++) {
                ret.push(<Comment props={this.comments[i]} key={this.comments[i].key}/>)
            }
            for(let i = 0; i < Math.min(num_comments, this.comments.length); i++) {
                ret.push(<Comment props={this.comments[i]} key={this.comments[i].key}/>)
            }
            for(let i = 0; i < Math.min(num_comments, this.comments.length); i++) {
                ret.push(<Comment props={this.comments[i]} key={this.comments[i].key}/>)
            }
        }

        
        console.log(ret);
        return ret;
    }

    renderCommentSection() {
        if(this.state.comment_expand) {
            return (
                <section>
                    <SectionTitleActive>Comments</SectionTitleActive>
                    <HRLine/>                
                    {this.renderComments(100)}
                    <button onClick={this.comment_button_event}>Click here to contract</button>
                    
                </section>
            )
        } else {
            return (
                <section>
                    <SectionTitleClosed>Comments</SectionTitleClosed>
                    {this.renderComments(1)}
                    <button onClick={this.comment_button_event}>Click here to expand</button>
                </section>
            )
        }
    }

    render() {
        return (
            <Container>
                <GroupPost>ACM-IIT</GroupPost>
                <JobTitle>Software Engineering Internship</JobTitle>
                <CompanyTitle>Wells Fargo</CompanyTitle>
                <HRLine/>
                <h4>Bad Corporate Culture Alert: The Dangers of A Boring Bank</h4>
                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. <br/><br/>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. <br/><br/>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>
                <p><em>Posted by Justin Schmitz on 2009-06-15</em></p>
                <HRLine/>
                {this.renderDescription()}
                <HRLine/>
                {this.renderInformation()}
                <HRLine/>
                {this.renderCommentSection()}
            </Container>
        )
    }
};

export default Post;
