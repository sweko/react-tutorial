var dataLocal = [
    {
        id: 1234,
        author: "Wekoslav",
        text: "*Here is my comment*"
    },
    {
        id: 2345,
        author: "Vladimir",
        text: "Here is **vladimir's** comment"
    },
    {
        id: 3456,
        author: "Author",
        text: "    this is code"+"\r\n    this is also code"
    }
];

var Comment = React.createClass({
    rawMarkup: function() {
        var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
        return { __html: rawMarkup };
    },
    render: function() {
        return (
            <div className="comment">
                <h3 className="commentAuthor">
                    Authored by: {this.props.author}
                </h3>
                <span dangerouslySetInnerHTML={this.rawMarkup()} />  {this.props.id}
            </div>
       );
    }
});

var CommentList = React.createClass({
  render: function() {
      var commentNodes=[];
      for (var index = 0; index < this.props.data.length; index++) {
        var comment = this.props.data[index];
        commentNodes.push (
            <Comment author={comment.author} key={comment.id} id={comment.id}>
                {comment.text}
            </Comment>
        );
    }

    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  getInitialState: function() {
    return {author: '', text: ''};
  },
  handleAuthorChange: function(e) {
    this.setState({author: e.target.value});
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();
    if (!text || !author) {
      return;
    };
    this.props.onCommentSubmit({author: author, text: text});
    this.setState({author: '', text: ''});
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" 
            value={this.state.author}
            onChange={this.handleAuthorChange}
        />
        <input type="text" placeholder="Say something..." 
            value={this.state.text}
            onChange={this.handleTextChange}
        />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var CommentBox = React.createClass({
   loadCommentsFromServer: function(){
       var self = this;
    $.ajax({
      url: self.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
          console.log("setState");
        self.setState({data: data});
      },
      error: function(xhr, status, err) {
        console.error(self.props.url, status, err.toString());
      }
    });
   },
  getInitialState: function() {
    console.log("getInitialState");
    return {data: dataLocal};
  },  
  componentDidMount: function() {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, 500);    
  },
  handleCommentSubmit: function(comment) {
      var self = this;
    $.ajax({
      url: self.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        self.setState({data: data});
      },
      error: function(xhr, status, err) {
        console.error(self.props.url, status, err.toString());
      }
    });
  },
  render: function() {
      console.log("render");
    return (
        <div class="commentBox">
            <h1>Comments</h1>
            <CommentList data={this.state.data}/>
            <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
        </div>
    );
  }
});

ReactDOM.render(
    <CommentBox url="/api/comments" />,
  document.getElementById('content')
);