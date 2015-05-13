var fs = require("fs");
var http = require("http");
var sqlite = require("sqlite3");



function sendBackTable( res )
{
    var db = new sqlite.Database( "battleship.sqlite" );
    var resp_text = "<tr>" + "<th>Username</th>" + "<th>Score</th>"+ "<th>Date</th>" +  "</tr>";
    var data = [];
    db.each("SELECT * FROM Users",
    function (err, row)
    {
      resp_text += "<tr><td>" + row.Username +"</td><td>"+ row.Score + "</td><td>" + row.Date +"</td></tr>"
    });
    db.close(
    function()
    {
      res.writeHead(200);
      res.end(JSON.stringify(resp_text));
    } );
}

function highScore ( res )
{
    var db = new sqlite.Database( "battleship.sqlite" );
    var resp_text = ""
    var data = [];
    db.each("SELECT MAX(Score) AS HighScore, * FROM Users",
    function (err, row)
    {
      data.push(row);
      resp_text += " " + row.Username + " "+ row.HighScore + " " + row.Date + " "
    });
    db.close(
    function()
    {
      res.writeHead(200);
      res.end(JSON.stringify(resp_text));
    } );
}

function addData( req, res )
{

  var x = req.url.split( "?" );
  var data = x[1].split("&")
  var s = data[0].split( "=" )[ 1 ];
  var n = data[1].split( "=" )[ 1 ].replace("%20", " ");
  var d = new Date();
  var day = d.getMonth() + "/" + d.getDay() + "/" + d.getFullYear();
  var db = new sqlite.Database( "battleship.sqlite" );
  db.run("INSERT INTO USERS ('Username', 'Score', 'Date') VALUES ( '" + n + "', '" + s + "',  '" + day + "')",
  function( err ){
    if( err!== null )
    {
      console.log(err);
    }
  });
  db.close(
    function(){
      res.writeHead( 200 );
      res.end( "" );
    }
  );


}


function giveBackFile( name, res )
{
    var contents = "";
    try
    {
    	contents = fs.readFileSync( name );
    }
    catch( e )
    {
    	console.log(
    	    "Error: Something bad happened trying to open "+ name );
        res.writeHead( 404 );
        res.end( "" );
        return;
    }

    res.writeHead( 200 );
    res.end( contents );
}

function doServer( req, res)
{
  var filename = req.url.substring(0,9);
  console.log(req.url);

  if (req.url == "/send_back_table")
  {
        sendBackTable( res );
  }
  else if (req.url == "/high_score")
  {
        highScore( res );
  }
  else if (filename == "/add_data")
  {
        console.log("req" + filename);

        addData( req, res );
  }

  else if(req.url == "/images/battleship.jpg")
    {
      giveBackFile("images/battleship.jpg", res);
    }
    else if(req.url == "/images/fire.gif")
    {
      giveBackFile("images/fire.gif", res);
    }
   else if(req.url == "/images/ship1.png")
    {
      giveBackFile("images/ship1.png", res);
    }
   else if(req.url == "/images/ship2.png")
    {
      giveBackFile("images/ship2.png", res);
    }   
    else if(req.url == "/images/ship4.png")
    {
      giveBackFile("images/ship4.png", res);
    }
    else if(req.url == "/images/walkie.png")
    {
      console.log("Me");
      giveBackFile("images/walkie.png", res);
    }
  else if(req.url == "/client.css")
    {
      giveBackFile("client.css", res);
    }
  else if (req.url == "/client.js")
    {
      giveBackFile("client.js", res);
    }
  else
    {
      giveBackFile("index.html", res);
    }
}

var server = http.createServer(doServer);
server.listen(8080);
