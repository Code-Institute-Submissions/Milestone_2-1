function Game(halfSize = 3, nrOfPlayers = 2, allowJump = 2, allowHorizontal = 1, allowBackwards = 1, secondChance = 1, allowNoJumps = 1, nrOfRows = 2, horizontal = 1) {

    this.nrOfPlayers = nrOfPlayers; // Play Vs computer - will NOT make this
    this.allowHorizontal = allowHorizontal; //1 true 2 false // pieces can move sideways in vertical mode only
    this.allowBackwards = allowBackwards; //1 true 2 false // pieces can move bacwards on grid
    this.secondChance = secondChance; //1 true 2 false // moving piece ends turn OR turn only ends with button press
    this.allowNoJumps = allowNoJumps; // 0 true 1 false // if a jump move is available, player has to take it
    this.halfSize = halfSize; // radius of the grid
    this.nrOfRows = nrOfRows; // how many rows of player pieces
    this.horizontal = horizontal; // 0 horizontal, 1 vertical // player pieces placement on grid
    this.allowJump = allowJump; //1 true 2 false // player can jump over theyir own pieces

    this.playerTurn = 1;

    this.startGame = function () {
        this.Grid = new gameGrid();
        this.Grid.makeHexagonalShape(this.halfSize, this.nrOfRows, this.horizontal);
        this.Grid.startPlayerTurn(this.playerTurn);
        this.Grid.setAllowedMoves();
    }

    this.showPlayerNr = function (nr) {
        console.log(nr);
    }
};

//game grid handles pieces moving on grid
//has hexagons functions
function gameGrid() {

    currentChance = myGame.secondChance;
    let currentPlayer = myGame.playerTurn;

    let playerPiecesNr = {
        1: 0,
        2: 0
    }

    let newGame = true;
    let showPossibleMoves = true;
    let freeMove = true; /// if not forced jump move or no jump detected
    let origAxial = '';

    function Hex(x, y, z) {
        this.q = x;
        this.r = y;
        this.s = z;
    };

    function Point(a, b) {
        this.x = a;
        this.y = b;
    }

    anyHex = function (x, y, z) {
        this.q = x;
        this.r = y;
        this.s = z;

        if (typeof (z) == "number") {
            return new Hex(this.q, this.r, this.s);
        }
        else {
            return new Hex(this.q, -this.q - this.r, this.r);
        }
    }

    const hexDirections = [anyHex(1, 0, -1), anyHex(1, -1, 0), anyHex(0, -1, 1),
    anyHex(-1, 0, 1), anyHex(-1, 1, 0), anyHex(0, 1, -1)];

    function hexDirection(direction) {
        return hexDirections[direction];
    }

    const hexDiagonals = [anyHex(2, -1, -1), anyHex(1, -2, 1), anyHex(-1, -1, 2), anyHex(-2, 1, 1), anyHex(-1, 2, -1), anyHex(1, 1, -2)];

    let allowedNeigh = [anyHex(1, 0, -1), anyHex(1, -1, 0), anyHex(0, -1, 1),
    anyHex(-1, 0, 1), anyHex(-1, 1, 0), anyHex(0, 1, -1)];

    function setAllowedNeigh(playerNr) {

        let removeNeigh = [];

        if (myGame.horizontal == 1) { // Horizontal Align   - does NOT have SIDE movement
            if (myGame.allowBackwards == 1) { //  not allowed backwards
                if (playerNr == 1) {
                    // not allowed 0 -1, -1 0, -1 1
                    // allowed 1 -1, 1 0, 0 1
                    removeNeigh = [anyHex(1, -1), anyHex(1, 0), anyHex(0, 1)];

                } else {
                    removeNeigh = [anyHex(0, -1), anyHex(-1, 0), anyHex(-1, 1)];
                }
            }
        }
        else { //Vertical Align - HAVE side movemet and backwards

            if (myGame.allowBackwards == 1) { //  not allowed backwards
                if (playerNr == 1) {
                    // not allowed 0 -1, 1 -1
                    // allowed -1 1, 0 1
                    removeNeigh = [anyHex(-1, 1), anyHex(0, 1)];
                } else {
                    removeNeigh = [anyHex(0, -1), anyHex(1, -1)];
                }
            }
            if (myGame.allowHorizontal == 1) {  // No sideways movement  
                removeNeigh.push(anyHex(-1, 0), anyHex(1, 0));
            }
        }
        // allowedNeigh = allowedNeigh.filter((item) => !removeNeigh.includes(item));

        for (var i = allowedNeigh.length - 1; i >= 0; i--) {
            for (var j = 0; j < removeNeigh.length; j++) {
                //   if(myArray[i] === toRemove[j]) 
                if (hexEquals(allowedNeigh[i], removeNeigh[j])) {
                    allowedNeigh.splice(i, 1);
                }
            }
        }

        return allowedNeigh;

    }

    this.setAllowedMoves = function () {
        setAllowedNeigh(currentPlayer);
    }

    function isRestrictedMove(hex) {
        ret = false;
        let t = $(last).attr("axial").split(" ");
        selectedAxial = anyHex(parseInt(t[0]), parseInt(t[1]));

        if (currentPlayer == 1) {
            dir = hexSubtract(selectedAxial, hex);
        }
        else {
            dir = hexSubtract(hex, selectedAxial);
        }

        found = allowedNeigh.find(function (value, index, array) {

            ret = hexEquals(dir, value);
            return ret;
        });

        if (typeof (found) === "undefined") {
            return true;
        }
        else return false;
    }


    //simple math
    function hexAdd(a, b) {
        let q = parseInt(a.q) + parseInt(b.q);
        let r = parseInt(a.r) + parseInt(b.r);
        let s = parseInt(a.s) + parseInt(b.s);
        return anyHex(q, r, s);
    }

    function hexSubtract(a, b) {
        let q = parseInt(a.q) - parseInt(b.q);
        let r = parseInt(a.r) - parseInt(b.r);
        let s = parseInt(a.s) - parseInt(b.s);
        return anyHex(q, r, s);
    }

    function hexMultiply(a, k) {
        let q = parseInt(a.q) * k;
        let r = parseInt(a.r) * k;
        let s = parseInt(a.s) * k;
        return anyHex(q, r, s);
    }

    function hexEquals(a, b) {
        let result = false;
        result = (Boolean(parseInt(a.q) === parseInt(b.q)) && Boolean(parseInt(a.r) === parseInt(b.r)) && Boolean(parseInt(a.s) === parseInt(b.s)));
        return result;
    }

    function hexFind(el, index, arr) {
        let f = 0;
        if (hexEquals(el, hex)) {
            f++;
        }
        return;
    }


    function hexToPixel(hex) {

        //TODO maybe dynamic size from css
        let size = 60;
        let x = size * (3. / 2 * hex.q);
        let y = size * (Math.sqrt(3) / 2 * hex.q + Math.sqrt(3) * hex.s);
        return new Point(x, y);
    }

    function hexToPixelHoriz(hex) {
        let size = 60;
        let x = size * (Math.sqrt(3) * hex.q + Math.sqrt(3) / 2 * hex.r);
        let y = size * (3. / 2 * hex.r);
        return new Point(x, y);
    }

    function neighbour(center, direction) {
        let dir = hexDirection(direction);
        let result = hexAdd(center, dir);
        return result;
    }

    function getDistance(a, b) {
        return Math.max(Math.abs(parseInt(a.q) - parseInt(b.q)), Math.abs(parseInt(a.r) - parseInt(b.r)), Math.abs(parseInt(a.s) - parseInt(b.s)));
    }

    function getHexRing(center, radius) {
        let results = [];

        let cube = hexAdd(center, hexMultiply(hexDirection(4), radius)); // start on one side than go round

        for (let side = 0; side < 6; side++) { //direction 
            for (let step = 0; step < radius; step++) {
                results.push(cube);
                cube = neighbour(cube, side);
            }
        }
        return results;
    }



    function setAllowFreeMove() {
        freeMove = true;
        

        testing = $(`.player${currentPlayer}`);

        $(testing).each(function () {
            t = $(this).attr("axial").split(" ");

            for (let i = 0; i < 6; i++) {
                neighPice = neighbour(anyHex(t[0], t[1]), i);

               
                if ($(`[player='${nextPlayer(currentPlayer)}'][axial='${neighPice.q} ${neighPice.s}']`).length) {
                    neighSpace = neighbour(anyHex(neighPice.q, neighPice.s), i);
                    console.log("neigh player" + neighPice.q + " " + neighPice.s);

                    // console.log("testing piece " + t[0] + " " + t[1]);
                    // console.log("aa " + neighPice.q + " " + neighPice.s);
                    // console.log("neigh spce" + neighSpace.q + " " + neighSpace.s);
                    //break;
                   

                    //  $()
                    if ($(`[hex='${neighSpace.q} ${neighSpace.s}']:not([player]`).length) {
                        // $(`[hex='${neighSpace.q} ${neighSpace.s}']:not([player]`).addClass("test");
                        setHelperText(5);
                        freeMove = false;

                        return;

                        // found = allowedNeigh.find(function (value, index, array) { //TODO fix this
                        //     if (currentPlayer == 1) {
                        //         dir = hexDirection(i);
                        //     }
                        //     else {
                        //         dir = hexMultiply(hexDirection(i), -1);
                        //     }
                        //     ret = hexEquals(dir, value); //DUPLICATE functionality here
                        //     return ret; //DUPLICATE functionality here
                        // }); //DUPLICATE functionality here

                        // if (typeof (found) === "undefined") {


                        //     return;
                        // }

                    }

                }
            }

        });
    }



    function getJumps(center) {
        let results = [];
        let testing, ret;

        for (let side = 0; side < 6; side++) { //direction 

            cube = neighbour(center, side);
            if ((myGame.allowJump == 2)) {
                    testing = $(`[hex='${cube.q} ${cube.s}'][player]`); // allow self jump ONLY if free move
console.log("Free Move " + freeMove);
            }
            else testing = $(`[hex='${cube.q} ${cube.s}'][player=${nextPlayer(currentPlayer)}]`); //jump over other player
            if (testing.length) {
                newMove = hexAdd(cube, hexSubtract(cube, center));

                found = allowedNeigh.find(function (value, index, array) { //TODO fix this
                    if (currentPlayer == 1) {
                        dir = hexSubtract(cube, center);
                    }
                    else {
                        dir = hexSubtract(center, cube);
                    }
                    ret = hexEquals(dir, value); //DUPLICATE functionality here
                    return ret; //DUPLICATE functionality here
                }); //DUPLICATE functionality here

                if (typeof (found) === "undefined") {
                    results.push(newMove);
                }
            }
        }
        return results;
    }

    function nextPlayer(player) {
        newPlayer = player == 1 ? 2 : 1;
        return newPlayer;
    }
    this.setPlayer = function (pl) {
        currentPlayer = pl;
    }

    this.makeHexagonalShape = function (N, rows, horizontal) {

        $(".grid_bg").css("width", `${290 * N + 100}px`).css("height", `${200 * N + 100}px`).css("margin-left", `${10 * N}px`);
        let results = [];
        for (let q = -N; q <= N; q++) {

            for (let r = N; r >= -N; r--) {

                let hex = anyHex(q + N, r + N, -q - r + N);

                let axialQ = q + N;
                let axialR = -q - r + N;


                let hex2 = anyHex(axialQ, axialR);

                coord = hexToPixel(hex2);

                if (((Math.abs(q) + Math.abs(r) + Math.abs(-q - r)) / 2) <= N) {
                    results.push(hex);

                    //REMINDER - changed  $("#grid div").first() to $("#grid")

                    $("#grid").prepend(`<div class='hex' style="top:${coord.x}px; left:${coord.y}px"  hex="${axialR} ${axialQ}">
                    ${axialR}xxxxxxxxx${axialQ}</div>`);

                    if (!horizontal) {

                        //TODO convert to function
                        if (axialQ == 0) {
                            $("#grid div").first().attr("player", "1");
                            $("#grid").append(`<div class='cylinder player1' axial="${axialR} ${axialQ}" player="1" style="top:${coord.x}px; left:${coord.y}px;"></div>`);
                            playerPiecesNr[1]++;

                        }
                        else if ((axialQ == 1) && (rows >= 2)) {
                            $("#grid div").first().attr("player", "1");
                            $("#grid").append(`<div class='cylinder player1' axial="${axialR} ${axialQ}" player="1"  style="top:${coord.x}px; left:${coord.y}px;"></div>`);
                            playerPiecesNr[1]++;
                        }
                        else if ((axialQ == 2) && (rows == 3)) {
                            $("#grid div").first().attr("player", "1");
                            $("#grid").append(`<div class='cylinder player1' axial="${axialR} ${axialQ}" player="1"  style="top:${coord.x}px; left:${coord.y}px;"></div>`);
                            playerPiecesNr[1]++;
                        }

                        else if (axialQ == 2 * N) {
                            $("#grid div").first().attr("player", "2");
                            $("#grid").append(`<div class='cylinder player2' axial="${axialR} ${axialQ}" player="2"  style="top:${coord.x}px; left:${coord.y}px;"></div>`);
                            playerPiecesNr[2]++;
                        }

                        else if ((axialQ == 2 * N - 1) && (rows >= 2)) {
                            $("#grid div").first().attr("player", "2");
                            $("#grid").append(`<div class='cylinder player2' axial="${axialR} ${axialQ}" player="2"  style="top:${coord.x}px; left:${coord.y}px;"></div>`);
                            playerPiecesNr[2]++;
                        }

                        else if ((axialQ == 2 * N - 2) && (rows == 3)) {
                            $("#grid div").first().attr("player", "2");
                            $("#grid").append(`<div class='cylinder player2' axial="${axialR} ${axialQ}" player="2"  style="top:${coord.x}px; left:${coord.y}px;"></div>`);
                            playerPiecesNr[2]++;
                        }
                    }

                }

                else {
                    // if put nonplayable hexes
                    //   $("#grid").append(`<div class='hex test' style="top:${coord.x}px; left:${coord.y}px">${axialR}xxxxxxxxx${axialQ}</div>`); 
                }
            }
        }
        if (horizontal) {
            // make rings here 
            //TODO convert to function

            let allRings = [];
            for (i = 1; i <= rows; i++) {
                allRings.push(getHexRing(anyHex(0, N), i, hexDirections));
            }
            allRings.push([anyHex(0, N)]);
            allRings.forEach(function (el) {
                el.forEach(function (hex) {

                    if ($(`[hex='${hex.q} ${hex.s}']`).length) {

                        coord.y = $(`[hex='${hex.q} ${hex.s}']`).css("left");
                        coord.x = $(`[hex='${hex.q} ${hex.s}']`).css("top");

                        $("#grid").append(`<div class='cylinder player1' axial="${hex.q} ${hex.s}" player="1" style="top:${coord.x}; left:${coord.y};"></div>`);
                        $(`[hex='${hex.q} ${hex.s}']`).attr("player", "1");
                        playerPiecesNr[1]++;
                    }
                });
            });

            allRings = [];
            for (i = 1; i <= rows; i++) {
                allRings.push(getHexRing(anyHex(2 * N, N), i, hexDirections));
            }
            allRings.push([anyHex(2 * N, N)]);
            allRings.forEach(function (el) {
                el.forEach(function (hex) {

                    if ($(`[hex='${hex.q} ${hex.s}']`).length) {

                        coord.y = $(`[hex='${hex.q} ${hex.s}']`).css("left");
                        coord.x = $(`[hex='${hex.q} ${hex.s}']`).css("top");

                        $("#grid").append(`<div class='cylinder player2' axial="${hex.q} ${hex.s}" player="2" style="top:${coord.x}; left:${coord.y};"></div>`);
                        $(`[hex='${hex.q} ${hex.s}']`).attr("player", "2");
                        playerPiecesNr[2]++;
                    }
                });
            });
        }
        return results;
    }

    function showMove(item, jump) {
        // console.log(jump);

        if ((isRestrictedMove(anyHex(parseInt(`${item.q}`), parseInt(`${item.s}`)))) && (jump == false)) return;

        if (jump) $(`[hex='${item.q} ${item.s}']:not([player]`).addClass("allowMove allowJump");
        else $(`[hex='${item.q} ${item.s}']:not([player]`).addClass("allowMove");
        $(`[hex='${item.q} ${item.s}']:not([player]`).droppable({
            accept: '.blink',

            hoverClass: 'hexHover',
            disabled: false,
            drop: function (event, ui) {

                let dropHex = $(event.target);

                if (dropHex.hasClass("allowMove")) {
                    //TODO z-idex depends on rows

                    let t = last.attr("axial").split(" ");

                    let coordX = dropHex.css("top");
                    let coordY = dropHex.css("left");

                    let lastPlayer = last.attr("player");

                    $(last).animate(
                        {
                            top: coordX,
                            left: coordY,
                        }, 100, function () {
                            last.attr("axial", dropHex.attr("hex"));
                            dropHex.attr("player", lastPlayer);

                            $(`[hex='${t[0]} ${t[1]}']`).removeAttr("player");
                        }
                    );

                    if (currentChance === 1) {
                        currentPlayer = nextPlayer(currentPlayer);
                        prepare(`${currentPlayer}`);
                    }
                    else {
                        $(`.player${currentPlayer}`).unbind("click");
                        $(`.player${currentPlayer}`).not($(last)).draggable('disable');

                        showPossibleMoves = false;
                    }
                }
            }
        });
    }

    function jumpOne(hex) {

        // use direction and distance
        // than add direction  and test
        //difference player - destination -  will make direction/

        gridPos = $(hex).attr("hex").split(" ");
        playerPos = $(last).attr("axial").split(" ");

        let dirHex = hexSubtract(anyHex(gridPos[0], gridPos[1]), anyHex(playerPos[0], playerPos[1]));

        dirHex = anyHex(Math.sign(dirHex.q), Math.sign(dirHex.s));
        distance = getDistance(anyHex(gridPos[0], gridPos[1]), anyHex(playerPos[0], playerPos[1]));

        let testPos = anyHex(playerPos[0], playerPos[1]);

        for (let i = 0; i < distance; i++) {

            testPos = hexAdd(testPos, dirHex);
            testing = $(`[axial='${testPos.q} ${testPos.s}'][player=${nextPlayer(currentPlayer)}]`); //jump over other player
            if (testing.length) {
                removePlayerPiece(testing);
                playerPiecesNr[currentPlayer]--;
                myGame.showPlayerNr(playerPiecesNr);
            }

        }

    }

    function removePlayerPiece(piece) {
        $(piece).addClass("scale animate");
        setTimeout(function () { $(piece).remove(); }, 1200);
    }

    $(document).on('click', ".allowMove", function moveOne() {

        //TODO z-idex depends on rows
        let t = last.attr("axial").split(" ");
        let currentHex = anyHex(t[0], t[1]);

        let coordX = $(this).css("top");
        let coordY = $(this).css("left");

        let lastUsehex = $(this).attr("hex");
        let clickHex = $(this);

        let lastPlayer = last.attr("player");

        if ($(this).hasClass("allowJump")) {
            jumpOne($(this));
        }


        last.attr("axial", lastUsehex);
        clickHex.attr("player", lastPlayer);
        $(`[hex='${t[0]} ${t[1]}']`).removeAttr("player");


        $(last).animate(
            {
                top: `${coordX}`,
                left: `${coordY}`,
            }, 200
        );

        if (currentChance == 1) {
            currentPlayer = nextPlayer(currentPlayer);
            prepare(`${currentPlayer}`);
        }
        else {
            $(`.player${currentPlayer}`).unbind("click");
        }
    });

    function playerPiceSelect(el) {

        setHelperText(2);

        $(".blink").removeClass("blink");
        $($(el)).removeClass("short_blink");

        $(el).not(".grid_bg").addClass("blink");

        let t = $(el).attr("axial").split(" ");

        // REMOVED - conflict with movement animation
        // if (last && (last.attr("axial") != $(this).attr("axial"))) {
        //     blinkingStop(last);
        // }
        // blinking($(this));
        last = $(el);

        if (showPossibleMoves == true) {
            let neighs = getHexRing(anyHex(t[0], t[1]), 1);
            $("div .allowMove").removeClass("allowMove");
            // neighs.forEach(showMove);
           if (freeMove) neighs.forEach(element => showMove(element, false));

            let jumps = getJumps(anyHex(t[0], t[1]));
            jumps.forEach(element => showMove(element, true));
        }

        if (origAxial.length === 0) {
            origAxial = `${t[0]} ${t[1]}`;
            $(`[hex='${t[0]} ${t[1]}']`).droppable({ disabled: true });
        } else {
        }
    }

    function prepare(player) {

        setHelperText(1);
        showPossibleMoves = true;

        if (myGame.allowNoJumps == 1) { // player have to jump if possible dd


            setAllowFreeMove();
        }


        $("h2 span").html(player + " ");

        if (player == 2) {
            $("#player_turn").addClass("playerTwoTransp");
            $(".grid_bg").addClass("playerTwoTransp");

            $(".player2").addClass("short_blink");
            $(".player1").removeClass("short_blink");
        }
        else {
            $("#player_turn").removeClass("playerTwoTransp");
            $(".grid_bg").removeClass("playerTwoTransp");

            $(".player1").addClass("short_blink");
            $(".player2").removeClass("short_blink");
        }

        $("div .allowMove").removeClass("allowMove");
        $(last).removeClass("blink");

        $(`.player${player}`).bind("click", function () { playerPiceSelect($(this)) });

        $(`.player${player == 1 ? 2 : 1}`).unbind("click");


        $(`.player${player}`).draggable({
            start: (function (event, ui) {
                //console.log("start");
                playerPiceSelect($(event.target));
            }),

            stop: (function (event, ui) {
                // console.log("stop");
            }),
            drag: (function (event, ui) {
                //console.log("drag");
                setHelperText(3);
            }),
            revert: 'invalid',
            revertDuration: 200,
        });

        if (newGame) {
            newGame = false;
        } else {
            $(`.player${player == 1 ? 2 : 1}`).draggable('disable');
            $(`.player${player}`).draggable('enable');

            origAxial = '';
        }
    }

    this.startPlayerTurn = function (player) {
        prepare(player);
    }
}; //END gameGrid


var timer;
var last;


function blinking(elm) {

    if (!($(elm).hasClass("blinking"))) {
        timer = setInterval(blink, 10);
        $(elm).addClass("blinking");
        function blink() {
            // $(elm).fadeTo(20, 0.7, function () { $(elm).fadeTo(20, 1.0); });
        }
    }

}

function blinkingStop(elm) {
    elm.stop(true, true);
    clearTimeout(timer);
    clearInterval(timer);
    $(elm).removeClass("blinking");


}


function isDoubleClicked(element) {
    //if already clicked return TRUE to indicate this click is not allowed
    if (element.data("isclicked")) return true;

    //mark as clicked for 1 second
    element.data("isclicked", true);
    setTimeout(function () {
        element.removeData("isclicked");
    }, 500);

    //return FALSE to indicate this click was allowed
    return false;
}

let myGame;

// PAGE Load
$(document).ready(function () {
    myGame = new Game();
    myGame.startGame();
    // console.log("doc ready: " + myGame.gameStart());
    setHelperText(1);

    $("#end_turn").click(function () {

        //prevent accidentaly skipped turn
        if (isDoubleClicked($(this))) return;
        myGame.playerTurn = myGame.playerTurn == 1 ? 2 : 1;
        myGame.Grid.startPlayerTurn(myGame.playerTurn);
        myGame.Grid.setPlayer(myGame.playerTurn);
    });
});


// ADMIN
$("#generate").click(function () {
    $("#grid").empty();
    myGame = null;
    myGame = new Game();

    myGame.halfSize = parseInt($("#half_size").val());
    myGame.nrOfPlayers = parseInt($("#players").val());
    myGame.allowHorizontal = $("#allow_horizontal:checked").val() ? parseInt($("#allow_horizontal:checked").val()) : 1;
    myGame.allowBackwards = $("#allow_backwards:checked").val() ? parseInt($("#allow_backwards:checked").val()) : 1;
    myGame.secondChance = $("#second_chance:checked").val() ? parseInt($("#second_chance:checked").val()) : 1;
    myGame.allowNoJumps = parseInt($("[name='allow_nojumps']:checked").val());
    myGame.nrOfRows = parseInt($("[name='nr_of_rows']:checked").val());
    myGame.horizontal = parseInt($("[name='horiz']:checked").val());
    myGame.allowJump = $("#allow_jump:checked").val() ? parseInt($("#allow_jump:checked").val()) : 1;

    myGame.startGame();

});

//Misc

function setHelperText(textId) {
    let helperText;
    switch (textId) {
        case 1:
            helperText = "Click on game piece or start dragging";
            break;
        case 2:
            helperText = "Click on a blue hexagon or drag to set destination";
            break;
        case 3:
            helperText = "Drop on a blue hexagon to set destination";
            break;
        case 4:
            helperText = "Click on a blue hexagon to set destination";
            break;
        case 5:
            helperText = "Jump Move detected: Click on game piece or start dragging";
            break;

        default:
            helperText = "Click on game piece or start dragging";
    }
    $("#move_info").text(helperText);
}

