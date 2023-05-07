let ws;
// code for creating and sending messages using the chat log and input
function newRoom(){
    // calling the ChatServlet to retrieve a new room ID
    let code = document.getElementById("room-code").value;
    if(code.length == 0)  // If no code is inputted, fetch a random code from the server at http://.../chat-servlet .
    {
        let callURL= "http://localhost:8080/WSChatServer-1.0-SNAPSHOT/chat-servlet";
        fetch(callURL, {
            method: 'GET',
            headers: {
                'Accept': 'text/plain',
            },
        })
            .then(response => response.text())
            .then(response => enterRoom(response)); // enter the room with the code
    }
    else
    {
        enterRoom(code);
    }

}
function enterRoom(code){
    // create the web socket
    ws = new WebSocket("ws://localhost:8080/WSChatServer-1.0-SNAPSHOT/ws/"+code); // Open WebSocket with the code received.

    document.getElementById("room").innerHTML = "<h3>You are chatting in the room "+code+" </h3>";
    document.getElementById("room").innerHTML += "<h3><button id=\"refresh\" class=\"buttonDes1\" onclick=\"showRooms()\">Refresh</button></h3>";

    // parse messages received from the server and update the UI accordingly
    ws.onmessage = function (event) {
        console.log(event.data);
        // parsing the server's message as json
        let message = JSON.parse(event.data);

        // handle message
        document.getElementById("log").value += "[" + timestamp() + "] " + message.message + "\n";
        // code for displaying game move and posting it to the chat
        let turn = message.message;
        // checks whether it is a 4x4 game
        if(turn.includes("4x4") && turn.includes("Move") && (message.user == "1" || parseInt(message.user)%2==1))
        {
            turn = turn.substring(turn.indexOf("Move")+5);
            turn = turn.substring(0,turn.indexOf(")"));
            // adds player move as O
            document.getElementById(turn).innerHTML = "O";
            // checks win and tie conditions after playing move
            checkWinCircle4x4(turn);
            checkTie4x4();
        }
        // sets up second player for 4x4 game
        else if(turn.includes("4x4") && turn.includes("Move") && (message.user == "2" || parseInt(message.user)%2==0))
        {
            turn = turn.substring(turn.indexOf("Move")+5);
            turn = turn.substring(0,turn.indexOf(")"));
            // adds player move as X
            document.getElementById(turn).innerHTML = "X";
            // checks win and tie conditions after playing move
            checkWinCross4x4(turn);
            checkTie4x4();
        }
        // checks entry order number of user to assign different play pieces for 3x3
        if(turn.includes("Move") && (message.user == "1" || parseInt(message.user)%2==1))
        {
            turn = turn.substring(turn.indexOf("Move")+5);
            turn = turn.substring(0,turn.indexOf(")"));
            // adds player move as O
            document.getElementById(turn).innerHTML = "O";
            // checks win and tie conditions after playing move
            checkWinCircle(turn);
            checkTie();
        }
        // sets up second player for 3x3 game
        else if(turn.includes("Move") && (message.user == "2" || parseInt(message.user)%2==0)){
            turn = turn.substring(turn.indexOf("Move")+5);
            turn = turn.substring(0,turn.indexOf(")"));
            // adds player move as X
            document.getElementById(turn).innerHTML = "X";
            // checks win and tie conditions after playing move
            checkWinCross(turn);
            checkTie();
        }
    }
    // delay necessary to give enough time for the server to receive the data and send it back. If no timeOut is present,
    //  the js will be ahead of the server and it's not going to display the correct list of Rooms when calling showRooms().
    setTimeout(function() {
        showRooms();
    }, 100);
}
function timestamp() {
    // displays time of user chat message
    var d = new Date(), minutes = d.getMinutes();
    if (minutes < 10) minutes = '0' + minutes;
    return d.getHours() + ':' + minutes;
}

document.getElementById("input").addEventListener("keyup", function (event) {
    // handles Enter button press on keyboard when user has written something to input
    if (event.keyCode === 13) {
        let request = {"type":"chat", "msg":event.target.value};
        ws.send(JSON.stringify(request));
        event.target.value = "";
    }
});

function showRooms()
{
    // shows the rooms to the user by calling the display rooms function
    let callURL= "http://localhost:8080/WSChatServer-1.0-SNAPSHOT/testing"; // Grabs the String containing all rooms in Testing.java
    fetch(callURL, {
        method: 'GET',
        headers: {
            'Accept': 'text/plain',
        },
    })
        .then(response => response.text())
        .then(response => displayRooms(response)); // Sends the String to displayRoom function.
}

// Takes a String in the format: "room1,room2,etc..."
function displayRooms(data)
{
    // adds room list to page
    let listOfWords = data.split(","); // Make array of the Strings by splitting by the ','
    listOfWords = listOfWords.filter(function(e){ return e.replace(/(\r\n|\n|\r)/gm,"")}); // Removes unnecessary spaces and characters,
    // basically cleans the array so that it can be worked with

    document.getElementById("roomList").innerHTML = ""; // The element that displays the roomLists has to be emptied before adding
    // , else                                                    // the new rooms, else it may show duplicates when this function is called again.

    listOfWords.forEach(element => addBox(element)); // Pass each string into addBox which will add them into the document.element.
}

function addBox(element)
{
    // adds box around the added room code
    let box = document.getElementById("roomList");
    box.innerHTML += `<button onclick=switchRoom(\"${element}\")>${element}</button> <br> <br>`;// Adds buttons that will contain the
    // function switchRoom(), so that when they are pressed, a switch of room occurs.
}

// Function similar to enterRoom, but this once closes the ws before joining a new one.
function switchRoom(code)
{
    ws.close();
    ws = new WebSocket("ws://localhost:8080/WSChatServer-1.0-SNAPSHOT/ws/"+code);

    let logURL = "http://localhost:8080/ChatResourceAPI-1.0-SNAPSHOT/api/history/"+code;
    fetch(logURL, { // Fetches the chatLog
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    })
        .then(response => response.json())
        .then(response => recoverChat(response.log)); // chatLog is given to recoverChat function.

    document.getElementById("room").innerHTML = "<h3>You are chatting in the room "+code+" </h3>";
    document.getElementById("room").innerHTML += "<h3><button id=\"refresh\" class=\"buttonDes1\" onclick=\"showRooms()\">Refresh</button></h3>";
    ws.onmessage = function (event) {
        console.log(event.data);
        // parsing the server's message as json
        let message = JSON.parse(event.data);
        // handle message
        document.getElementById("log").value += "[" + timestamp() + "] " + message.message + "\n";
    }
}
// This function is to be given a response.json that will contain the chatLog. And append that response into the
// chatbox.
function recoverChat(data)
{
    document.getElementById("log").value += data;
}

// code containing 3x3 Tic Tac Toe game logic
function newGameTrad(){
    // uses JQuery to clear the game board
    $("table td").each(function(i){
        $(this).html("");
    })
}

function checkRow(id, shape){
    let win = false;
    // checks if the row contains all the same game pieces
    // determines win condition
    // uses the first number of the cell's id to determine which row to check
    let row = id[0];
    let cell1 = row + 1;
    let cell2 = row + 2;
    let cell3 = row + 3;
    let html1 = document.getElementById(cell1);
    let html2 = document.getElementById(cell2);
    let html3 = document.getElementById(cell3);
    // checks if all cells in the same row have the same innerHTML
    // prints win statement
    if(html1.innerHTML.includes(shape) && html2.innerHTML.includes(shape) && html3.innerHTML.includes(shape)){
        win = true;
        return win;
    }
}
function checkCol(id, shape){
    let win = false;
    // checks if the column contains all the same game pieces
    // determines win condition
    // uses the second number of the cell's id to determine which row to check
    let col = id[1];
    let cell1 = 1 + col;
    let cell2 = 2 + col;
    let cell3 = 3 + col;
    let html1 = document.getElementById(cell1);
    let html2 = document.getElementById(cell2);
    let html3 = document.getElementById(cell3);
    // checks if all cells in the same column have the same innerHTML
    // prints win statement
    if(html1.innerHTML.includes(shape) && html2.innerHTML.includes(shape) && html3.innerHTML.includes(shape)){
        win = true;
        return win;
    }
}
function checkDiag(shape){
    let win = false
    // checks the diagonals for whether the same shape is in the diagonals
    // determines win condition
    let html1 = document.getElementById("11");
    let html2 = document.getElementById("22");
    let html3 = document.getElementById("33");
    let html4 = document.getElementById("31");
    let html5 = document.getElementById("13");
    // checks top left to bottom right diagonal
    if(html1.innerHTML.includes(shape) && html2.innerHTML.includes(shape) && html3.innerHTML.includes(shape)){
        win = true;
        return win;
    }
    // checks top right to bottom left diagonal
    else if(html5.innerHTML.includes(shape) && html2.innerHTML.includes(shape) && html4.innerHTML.includes(shape)){
        win = true;
        return win;
    }
}
function checkTie(){
    // checks tie condition and logs message to chat log saying game was a tie
    let tie = true;
    let win = false;
    // uses JQuery to check whether all td cells are empty
    // if at least one cell is empty changes tie boolean to false
    $("#3x3 td").each(function(i){
        if($(this).html() == ""){
            tie = false;
        }
        if(checkWinner3x3($(this).attr("id"),"O")==true || checkWinner3x3($(this).attr("id"),"X")==true){
            tie = false;
        }
    })
    // only sends tie message if all cells have been played and no more moves can be made
    // also checks that there is no win on the last placed piece
    if(tie == true && win == false){
        let request = {"type":"chat", "msg":"It is a tie!"};
        ws.send(JSON.stringify(request));
    }
}

// checks all win conditions for the circle user and sends message if there is a win
function checkWinCircle(id){
    if(checkRow(id, "O") == true){
        let request = {"type":"chat", "msg":"Congratulations O won!!!"};
        ws.send(JSON.stringify(request));
    }
    else if(checkCol(id, "O") == true){
        let request = {"type":"chat", "msg":"Congratulations O won!!!"};
        ws.send(JSON.stringify(request));
    }
    else if(checkDiag("O") == true){
        let request = {"type":"chat", "msg":"Congratulations O won!!!"};
        ws.send(JSON.stringify(request));
    }
}
// checks all win conditions for the cross user and sends message if there is a win
function checkWinCross(id){
    if(checkRow(id, "X") == true){
        let request = {"type":"chat", "msg":"Congratulations X won!!!"};
        ws.send(JSON.stringify(request));
    }
    else if(checkCol(id, "X") == true){
        let request = {"type":"chat", "msg":"Congratulations X won!!!"};
        ws.send(JSON.stringify(request));
    }
    else if(checkDiag("X") == true){
        let request = {"type":"chat", "msg":"Congratulations X won!!!"};
        ws.send(JSON.stringify(request));
    }
}
// checks win conditions and returns booleans
function checkWinner3x3(id, shape){
    if(checkRow(id, shape) == true){
        return true;
    }
    if(checkCol(id, shape) == true){
        return true;
    }
    if(checkDiag(shape) == true){
        return true;
    }
    return false;
}
// allows players to make moves on the game board
function play(cell){
    if(cell.innerHTML == ""){
        cell.innerHTML = " ";
        // sends message to chat log detailing where the user placed their piece
        let request = {"type":"chat", "msg":"Your Turn: Move(" +cell.id +")"};
        ws.send(JSON.stringify(request));
    }
    else{
        // if cell already has a piece will ask user to play piece in another square
        let request = {"type":"chat", "msg":"Play in another square"};
        ws.send(JSON.stringify(request));
    }
}

// button to switch to 4x4 game mode
function new4x4(){
    let threeBythree = document.getElementById("3x3");
    threeBythree.style.display = "none";
    let fourByfour = document.getElementById("4x4");
    fourByfour.style.display = "block";
    let threeBythreeBtn = document.getElementById("3x3Btn");
    threeBythreeBtn.style.display = "block";
    let fourByfourBtn = document.getElementById("4x4Btn");
    fourByfourBtn.style.display = "none";
}
// button to switch to 3x3 game mode
function new3x3(){
    let threeBythree = document.getElementById("3x3");
    threeBythree.style.display = "block";
    let fourByfour = document.getElementById("4x4");
    fourByfour.style.display = "none";
    let threeBythreeBtn = document.getElementById("3x3Btn");
    threeBythreeBtn.style.display = "none";
    let fourByfourBtn = document.getElementById("4x4Btn");
    fourByfourBtn.style.display = "block";
}

// 4x4 game Logic
// checks if all cells in a row have one shape 4x4
function checkRow4x4(id, shape){
    let win = false;
    // checks if the row contains all the same game pieces
    // determines win condition
    // uses the first number of the cell's id to determine which row to check
    let row = id[1];
    let cell1 = "c" + row + 1;
    let cell2 = "c" + row + 2;
    let cell3 = "c" + row + 3;
    let cell4 = "c" + row + 4;
    let html1 = document.getElementById(cell1);
    let html2 = document.getElementById(cell2);
    let html3 = document.getElementById(cell3);
    let html4 = document.getElementById(cell4);
    // checks if all cells in the same row have the same innerHTML
    // prints win statement
    if(html1.innerHTML.includes(shape) && html2.innerHTML.includes(shape) && html3.innerHTML.includes(shape) && html4.innerHTML.includes(shape)){
        win = true;
        return win;
    }
}
// checks if all cells in a column have one shape 4x4
function checkCol4x4(id, shape){
    let win = false;
    // checks if the column contains all the same game pieces
    // determines win condition
    // uses the second number of the cell's id to determine which row to check
    let col = id[2];
    let cell1 = "c" + 1 + col;
    let cell2 = "c" + 2 + col;
    let cell3 = "c" + 3 + col;
    let cell4 = "c" + 4 + col;
    let html1 = document.getElementById(cell1);
    let html2 = document.getElementById(cell2);
    let html3 = document.getElementById(cell3);
    let html4 = document.getElementById(cell4);
    // checks if all cells in the same column have the same innerHTML
    // prints win statement
    if(html1.innerHTML.includes(shape) && html2.innerHTML.includes(shape) && html3.innerHTML.includes(shape) && html4.innerHTML.includes(shape)){
        win = true;
        return win;
    }
}
// checks if all cells in either diagonal have one shape 4x4
function checkDiag4x4(shape){
    let win = false
    // checks the diagonals for whether the same shape is in the diagonals
    // determines win condition
    let html1 = document.getElementById("c11");
    let html2 = document.getElementById("c22");
    let html3 = document.getElementById("c33");
    let html4 = document.getElementById("c44");
    let html5 = document.getElementById("c14");
    let html6 = document.getElementById("c23");
    let html7 = document.getElementById("c32");
    let html8 = document.getElementById("c41");
    // checks top left to bottom right diagonal
    if(html1.innerHTML.includes(shape) && html2.innerHTML.includes(shape) && html3.innerHTML.includes(shape) && html4.innerHTML.includes(shape)){
        win = true;
        return win;
    }
    // checks top right to bottom left diagonal
    else if(html5.innerHTML.includes(shape) && html6.innerHTML.includes(shape) && html7.innerHTML.includes(shape) && html8.innerHTML.includes(shape)){
        win = true;
        return win;
    }
}
// checks for a tie; when 4x4 game board is full and no one has won
function checkTie4x4(){
    // checks tie condition and logs message to chat log saying game was a tie
    let tie = true;
    let win = false;
    // uses JQuery to check whether all td cells are empty
    // if at least one cell is empty changes tie boolean to false
    $("#4x4 td").each(function(i){
        if($(this).html() == ""){
            tie = false;
        }
        if(checkWinner4x4($(this).attr("id"),"O")==true || checkWinner4x4($(this).attr("id"),"X")==true){
            tie = false;
        }
    })
    // only sends tie message if all cells have been played and no more moves can be made
    // also checks that there is no win on the last placed piece
    if(tie == true && win == false){
        let request = {"type":"chat", "msg":"It is a tie!"};
        ws.send(JSON.stringify(request));
    }
}
// checks all win 4x4 conditions for the circle user and sends message if there is a win
function checkWinCircle4x4(id){
    if(checkRow4x4(id, "O") == true){
        let request = {"type":"chat", "msg":"Congratulations O won!!!"};
        ws.send(JSON.stringify(request));
    }
    else if(checkCol4x4(id, "O") == true){
        let request = {"type":"chat", "msg":"Congratulations O won!!!"};
        ws.send(JSON.stringify(request));
    }
    else if(checkDiag4x4("O") == true){
        let request = {"type":"chat", "msg":"Congratulations O won!!!"};
        ws.send(JSON.stringify(request));
    }
}
// checks all win 4x4 conditions for the cross user and sends message if there is a win
function checkWinCross4x4(id){
    if(checkRow4x4(id, "X") == true){
        let request = {"type":"chat", "msg":"Congratulations X won!!!"};
        ws.send(JSON.stringify(request));
    }
    else if(checkCol4x4(id, "X") == true){
        let request = {"type":"chat", "msg":"Congratulations X won!!!"};
        ws.send(JSON.stringify(request));
    }
    else if(checkDiag4x4("X") == true){
        let request = {"type":"chat", "msg":"Congratulations X won!!!"};
        ws.send(JSON.stringify(request));
    }
}
// checks all win 4x4 conditions for either shape and returns a boolean
function checkWinner4x4(id, shape){
    if(checkRow4x4(id, shape) == true){
        return true;
    }
    if(checkCol4x4(id, shape) == true){
        return true;
    }
    if(checkDiag4x4(shape) == true){
        return true;
    }
    return false;
}
// allows players to make moves on the 4x4 game board
function play4x4(cell){
    if(cell.innerHTML == ""){
        cell.innerHTML = " ";
        // sends message to chat log detailing where the user placed their piece
        let request = {"type":"chat", "msg":"Your Turn 4x4: Move(" +cell.id +")"};
        ws.send(JSON.stringify(request));
    }
    else{
        // if cell already has a piece will ask user to play piece in another square
        let request = {"type":"chat", "msg":"Play in another square"};
        ws.send(JSON.stringify(request));
    }
}

window.onload = showRooms();// Makes it so that the roomList is displayed once a new instance (tab) is opened.
