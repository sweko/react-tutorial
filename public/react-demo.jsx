var data = [
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
  render: function() {
    return (
      <div className="commentForm">
        Hello, world! I am a CommentForm.
      </div>
    );
  }
});

var CommentBox = React.createClass({
  render: function() {
    return (
        <div class="commentBox">
            <h1>Comments</h1>
            <CommentList data={this.props.data}/>
            <CommentForm />
        </div>
    );
  }
});

ReactDOM.render(
    <CommentBox data={data} />,
  document.getElementById('content')
);