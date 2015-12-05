require('./index.html');
require('./style.js');
require('git-static');

var React = require('react');
var ReactDOM = require('react-dom');
var git = require('git-static');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var Navigation = ReactRouter.Navigation;
var createBrowserHistory = require('history/lib/createBrowserHistory');


var Repos = React.createClass({
  getInitialState : function() {
    return {
      repos : {},
      branches: {}
    }
  },
  componentDidMount : function() {
    this.loadSamples();
  },
  loadSamples : function() {
    this.setState({
      repos : require('./repos-config')
    });
  },
  loadBranches : function(repo) {
    var repo = {};
    git.getBranches(path, function(branches){
      this.setState({
        console.log(branches);
        branches[repo.path] = branches;
      });
    })
  },
  renderRepo : function(key){
    return <RepoIcon key={key} index={key} details={this.state.repos[key]}/>
  },
  render: function() {
    return (
      <div className="repos-wrap">
        <ul className="list-of-repos">
          {Object.keys(this.state.repos).map(this.renderRepo)}
        </ul>
      </div>
    );
  },
});

var RepoIcon = React.createClass({
  onButtonClick : function() {
    console.log("Going to repo: ", this.props.index);
    var key = this.props.index;
    // this.props.addToOrder(key);
  },
  render : function() {
    var details = this.props.details;
    return (
        <li key={details.id}><Link to={`/repo/${this.props.index}`}>{details.name}</Link></li>
    )
  }
});

var Histories = React.createClass({
  componentDidMount : function() {
  },
  render : function() {
    return (
      <div>
        <h2>Inventory</h2>

      </div>
    )
  }
})


var NotFound = React.createClass({
  render : function() {
    return <h1>Not Found!</h1>
  }
});

/*
  Routes
*/

var routes = (
  <Router>
    <Route path="/" component={Repos}/>
    <Route path="/repo/:repoId" component={Histories}/>
    <Route path="*" component={NotFound}/>
  </Router>
)


ReactDOM.render(
  routes,
  document.querySelector("#main")
);
