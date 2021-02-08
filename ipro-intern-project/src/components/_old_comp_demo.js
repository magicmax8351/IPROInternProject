
class CreatePost extends Component {
    constructor(props) {
      super(props);
      this.submitPost = this.submitPost.bind(this);
      this.onSubjectchange = this.onSubjectchange.bind(this);
      this.onBodychange = this.onBodychange.bind(this);
    }
  
    submitPost() {
      let path = "http://wingman.justinjschmitz.com:8000/posts/add/";
      console.log("CreatePost button clicked. Fetching " + path);
  
      let post = {
        id: 0,
        subject: this.state.subject,
        body: this.state.body,
        timestamp: Date.now(),
        job_id: 0,
        group_id: 0
      };
  
      console.log(JSON.stringify(post));
  
      fetch(path, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(post)
      })
      .then(response => {
        response.json().then(text => console.log(text));
      })
      .catch(err => {
        console.error(err);
      });
    }
  
    onSubjectchange(event) {
      this.setState({subject: event.target.value});
    }
  
    onBodychange(event) {
      this.setState({body: event.target.value});
    }
  
    render() {
      return (
        <div>
          <span>Subject:</span>
          <input type="text" id="CreatePostSubjectTextbox" onChange={this.onSubjectchange} /><br />
          <span>Body:</span>
          <textarea id="CreatePostBodyTextbox" onChange={this.onBodychange} /><br />
          <button type="button" id="CreatePostSubmitButton" onClick={this.submitPost}>Post</button>
        </div>
      )
    }
  }
  
  class PostsDisplay extends Component {
    constructor(props) {
      super(props);
      this.refreshTable = this.refreshTable.bind(this);
      this.state={retrievedPosts: {posts: [], count: 0}};
    }
  
    refreshTable() {
      // fetch the data, put it in state
      let path = "http://wingman.justinjschmitz.com:8000/posts/get/";
      fetch(path, {
        method: "GET",
        headers: {}
      })
      .then(response => {
        response.json().then(text => this.setState({retrievedPosts: text}));
      })
      .catch(err => {
        console.error(err);
      });
    }
  
    render() {
      return (
        <div>
          <button type="button" onClick={this.refreshTable}>Refresh Table</button>
          <table border="1">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Time</th>
                <th>Body</th>
              </tr>
            </thead>
            <tbody>
              {this.state.retrievedPosts.posts.map(item => {
                return (
                  <tr key={item.id}>
                    <td>{item.subject}</td>
                    <td>{item.timestamp}</td>
                    <td>{item.body}</td>
                  </tr>
              )})}
            </tbody>
          </table>
        </div>
      )
    }
  }
  