var fs = require("fs");

var express = require("express");
var optimist = require("optimist");
var gitstatic = require("git-static");
var repos = require('./src/repos-config');


var argv = optimist.usage("Usage: $0")
    .options("h", {
      alias: "help",
      describe: "display this help text"
    })
    .options("repository", {
      default: ".git",
      describe: "path to bare git repository"
    })
    .options("port", {
      default: 3000,
      describe: "http port"
    })
    .check(function(argv) {
      if (argv.help) throw "";
      try { var stats = fs.statSync(argv.repository); } catch (e) { throw "Error: " + e.message; }
      if (!stats.isDirectory()) throw "Error: invalid --repository directory.";
    })
    .argv;

var server = express();
server.set('views', __dirname + '/views');
server.set('view engine', 'jade');
// server.use(express.logger('dev'))

// server.use(express.static(__dirname + '/public'));

server.get('/', function (req, res) {
  var repoMap = Object.keys(repos).map(function(k) { return repos[k]; })
  res.render('index', { title: 'Hey', repos: repoMap});
});

server.get('/repo/:name', function (req, res) {
  var repos = require('./src/repos-config');
  var repo = repos[req.params.name];
  gitstatic.listAllCommits(repo.path,function(error, commits){
    if(error) {
      console.log(error)
      commits = []
    }

    res.render('repo', { repo: repo, commits: commits, error:error});
  })
});

server.get("/serve/:name/:sha", gitstatic.route()
    .repository(function(url) {
      var name = url.split("/")[2]
      return repos[name].path;
    })
    .revision(function(url) {
      return url.split("/")[3];
    })
    .file(function(url) {
      return "index.html" ;
    })
  )


// server.get(/^\/.*/, gitstatic.route()
//     .repository(argv.repository));

server.listen(argv.port);
