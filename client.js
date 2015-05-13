var tbl = document.getElementById("grid");


var positions = [];
var count = 0;
for (var i = 0, len = 10; i < len; i++)
{

    var tr = document.createElement("tr");

    for (var j = 0; j < 10; j++)
    {
        var td = document.createElement("td");
        td.id = count++;
        td.ondrop = function(event)
        {
            drop(event)
        };
        td.ondragover = function(event)
        {
            gridOpen(event)
        };
        td.ondragenter = function(event)
        {
            gridEnter(event)
        };
        td.ondragleave = function(event)
        {
            gridLeft(event)
        };
        td.ondragstart = function(event)
        {
            startDrag(event)
        };
        tr.appendChild(td);

        var obj = {
            'id': td.id,
            'hasBattleship': false,
            'isClicked': false
        };
        positions.push(obj);
    }

    tbl.appendChild(tr);
}

function cellPress(stat, tArray)
{
    var prefix = stat.substring(0, 1);
    var stat = stat.substring(1, stat.length);

    var gridCell = tArray[stat];
    console.log(stat.substring(0,1) + " " + stat.substring(1,2));

    if (gridCell.isClicked) return;

    gridCell.isClicked = true;

    if (gridCell.hasBattleship)
    {
        destroyShip(prefix + stat);
    }
    else
    {
        showSplash(prefix + stat);
    }
    //..Temp for two players playing;
    if(prefix === "c"){
      letsBomb();
    }
}

var pCount = 0;
var cCount = 0;

function destroyShip(stat)
{
    //... destroy details here
    if(stat.length == 2){
       var tp = 0 + "px";
       var lt = (stat.substring(1,2) * 50) + "px";
    }else{
      var tp = (stat.substring(1,2) * 50) + "px";
      var lt = (stat.substring(2,3) * 53) + "px";
    }

    console.log(lt + " " + tp);

    document.getElementById(stat)
        .innerHTML += "<div class='death' style='top:" + tp + "; left: " + lt +";'></div>";

    if(stat.substring(0, 1) == "p"){
      pCount++;
    }else
    {
      cCount++;
    }

    if(pCount == 7){
      gameOver("lost")
      return;
    }else if(cCount == 7){
      gameOver("win");
      return;
    }
    alert("Destroyed! " + stat);
}

function showSplash(stat)
{
    //... show splash of water here
    document.getElementById(stat).style.background = "#6290C8";
    console.log(document.getElementById(stat));
}

function gridOpen(event)
{
    event.preventDefault();
}

function gridEnter(event)
{
    event.preventDefault();
    document.getElementById(event.target.id)
        .style.backgroundColor = "#FFFFFF";
}

function gridLeft(event)
{
    event.preventDefault();
    document.getElementById(event.target.id)
        .style.backgroundColor = "#247BA0";
}



function drop(event)
{
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    var inBounds = checkBounds(event.target.id, data);
    var onWay = hasShip(event.target.id);

    if(!inBounds || onWay)
    {
      document.getElementById(event.target.id)
          .style.backgroundColor = "#247BA0";
      return;
    }

    positions[event.target.id].hasBattleship = true;
    event.target.appendChild(document.getElementById(data));

    document.getElementById(event.target.id)
        .style.backgroundColor = "#247BA0";

    var sCount = countShip();
    if(sCount == 0){
      document.getElementById("molkie").innerHTML = "<div class='battleButton' onClick = 'passInfo()'>Continue</div>"
    }
}

function countShip()
{
    var container = document.getElementById("menu");
    var sCount = 0;
    for(var i =0; i < container.childNodes.length; i++)
    {
      if(container.childNodes[i].className == "ship"){
        sCount++;
      }
    }
    return sCount;

}

function checkBounds(gridCell, ship)
{
  var tGrid = parseInt(gridCell.substring(gridCell.length - 1, gridCell.length));
  var tShip = parseInt(ship.substring(ship.length - 1, ship.length));

  if( tGrid + tShip < 11)
  {
    return true;
  }
  else
  {
    return false;
  }

}

function startDrag(event)
{
    //...
    var tId = event.target.parentNode.id;
    if (positions[tId].hasBattleship)
    {
        positions[tId].hasBattleship = false;
        document.getElementById(tId).style.backgroundColor = "#247BA0";
    }
}

function drag(event)
{
    event.dataTransfer.setData("text", event.target.id);
}

function hasShip(tCell)
{
  var tCell = parseInt(tCell);

  if(isNaN(tCell)) return true; //Already has battleship

  return false;

}



function passInfo()
{
    for (var i = 0; i < 100; i++)
    {
      var parent = document.getElementById(i);

        if (parent.hasChildNodes() === true)
        {
            var msg = shipSize(parent.firstChild.id, i);
            console.log(msg + " has " + parent.firstChild.id);

        }
    }

    document.getElementById("screen1").style.visibility = "hidden";
    document.getElementById("screen2").style.visibility = "visible";

    initialSeq();
}

function shipSize(tShip, rCell)
{
  //... function to get ship size
  var spaces = parseInt(tShip.substring(tShip.length - 1, tShip.length));
  var tCells = [];

  for(var j = 0; j < spaces; j++)
  {
  //  tCells += i + j + ", ";
    tCells.push(rCell + j);
  }
  shipCoords.push(tCells);
  return tCells;
  //... this should call a function to the server or computer

}


/*
  Functions for the Second Screen
*/
  var pPositions = []; //Stores the position of player table properties
  var cPositions = []; //Stores the position of CPU table properties
  var shipCoords = [];

 function createTables()
 {
   var count = 0;
   var pTable = document.getElementById("gridPlayer");
   var cTable = document.getElementById("gridCPU");
   var x = 0;
   var y = 0;

   for(var i = 0; i < 10; i++)
   {
     var tr = document.createElement("tr");
     var trC = document.createElement("tr");

     for(var j = 0; j < 10; j++)
     {
       var td = document.createElement("td");
       var tdC = document.createElement("td");

       tdC.onclick = function(){ cellPress(this.id, cPositions) }
       tdC.id  = "c" + count;


       for(var p = 0; p < shipCoords.length; p++)
       {
         for(var q = 0; q < shipCoords[p].length; q++)
         {

           if(shipCoords[p][q] == count)
           {

             if(shipCoords[p].length == 1)
             {
               td.innerHTML = '<div class="ship" id="ship1"></div>';
             }
             else if(shipCoords[p].length == 2)
             {

               if(x == 0){
                 td.innerHTML = '<div class="ship" id="ship2"></div>';
                 x++;
               }
             }
             else
             {
               if(y == 0){
                 td.innerHTML = '<div class="ship" id="ship4"></div>';
                 y++;
               }
             }

           }
         }
       }

       td.id = "p" + count++;

       //td.onclick = function(){ cellPress(this.id) };
       tr.appendChild(td);
       trC.appendChild(tdC);

       var obj = {
           'id': td.id,
           'hasBattleship': false,
           'isClicked': false
       };

       var cObj = {
           'id': tdC.id,
           'hasBattleship': false,
           'isClicked': false
       };
       cPositions.push(cObj);
       pPositions.push(obj);
     }
     pTable.appendChild(tr);
     cTable.appendChild(trC);
   }

 }

 //function to prepare CPU game logic
 //CPU game logic

 function cpuShips()
 {
   //... ships that are placed by the CPU
   //... get three random numbers; make sure there in bounds and place them in array
  var ships = ["ship1", "ship2", "ship4"];

  for(var i = 0, len = ships.length; i < len; i++)
  {
      var placeShip = getRandomShip(ships[i]);

      for(var j = 0; j < placeShip.length; j++)
      {
        cPositions[placeShip[j]].hasBattleship = true;
        console.log(cPositions[placeShip[j]].id + " ready for mission " + cPositions[placeShip[j]].hasBattleship);
      }
  }
 }


 function getRandomShip(tShip)
 {
   var status = false;
   var rCell = "" + Math.floor(Math.random() * 100) + "";

   while(cPositions[parseInt(rCell)].hasBattleship || !status ){


     status = checkBounds(rCell, tShip);
     if(status == true && !cPositions[parseInt(rCell)].hasBattleship) continue;

     rCell = "" + Math.floor(Math.random() * 100) + "";
     status = false;

   };
    //Check if the number is in bounds
   console.log(status + " " +rCell);

   var sSize = shipSize(tShip, parseInt(rCell)); //Get the other tiles

   return sSize; //Return array of tiles with ship
 }

 var cpuGuess = [];
 var playerTime = 0;
 var theScore = document.getElementById("timer");

function Shuffle(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
}; //From CSS-tricks

 function initialSeq(){

   createTables();
   cpuShips();

   for(var i = 0; i < 100; i++)
   {
     cpuGuess.push("p" + i);
   }
   //... shuffle the array
   cpuGuess = Shuffle(cpuGuess);



    usrShips();
    window.setInterval(function(){ playerTime++; theScore.innerHTML = playerTime}, 1000)
 }



 function usrShips()
 {
   for (var i = 0; i < 100; i++)
   {
     var parent = document.getElementById(i);

       if (parent.hasChildNodes() === true)
       {
           var msg = shipSize(parent.firstChild.id, i);

           for(var k = 0; k < msg.length; k++)
           {
             pPositions[msg[k]].hasBattleship = true;
           }
           console.log(msg + " has " + parent.firstChild.id);

       }
   }
 }

 function letsBomb()
 {
  //... a function to bomb the player ships
  //... has an array of random positions from 0 to 99 that is bombs

  var location = cpuGuess.shift();
  cellPress(location, pPositions);


 }

 function showScreen2(){

   document.getElementById("screen3").style.visibility = "hidden";
   document.getElementById("screen1").style.visibility = "visible";
 }

function getHighScore(){
  document.getElementById("screen3").style.visibility = "hidden";
  document.getElementById("screen4").style.visibility = "visible";

  showTable();
  showHighScore();
}

function backScore(){
  document.getElementById("screen4").style.visibility = "hidden";
  document.getElementById("screen3").style.visibility = "visible";
}

function gameOver(mStat){
  document.getElementById("screen2").style.visibility = "hidden";
  document.getElementById("screen5").style.visibility = "visible";

  var x = document.getElementById("stat");
  var y = document.getElementById("mScore");

  if(mStat == "win"){
    x.innerHTML = "You win";
    y.innerHTML = Math.floor((0.1 / playerTime) * 3000000);
    //... habari
  }else{
    x.innerHTML = "You lose";
    y.innerHTML = 50;
  }


}
//Initializing

function tableData()
{
  var display_elem = document.getElementById( "table_result" );
 display_elem.innerHTML = JSON.parse( this.responseText );
}

function showTable()
{
  var show_table = new XMLHttpRequest();
  show_table.open( "get", "send_back_table" );
  show_table.onload = tableData;
  show_table.send();

}

function showHighScore()
{
  var show_highscore = new XMLHttpRequest();
  show_highscore.open( "get", "high_score" );
  show_highscore.onload = highscoreData;
  show_highscore.send();

}


function highscoreData()
{
  var display_elem = document.getElementById( "highscore_result" );
 display_elem.innerHTML = JSON.parse( this.responseText );
}

function addName()
{
  var add_sender = new XMLHttpRequest();
  var score = document.getElementById("mScore");
  var name = document.getElementById("name").value;
  var url = "add_data?";
    url += "score=" + score.innerHTML;
    url += "&name=" + name;
    add_sender.open( 'get', url );
    add_sender.send();
}
