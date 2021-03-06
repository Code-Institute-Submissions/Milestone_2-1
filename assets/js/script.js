function Game(halfSize = 3, allowJump = 2, allowHorizontal = 2, allowBackwards = 2, secondChance = 1, allowNoJumps = 0, nrOfRows = 2, horizontal = 0) {


    this.halfSize = halfSize; // radius of the grid
    this.horizontal = horizontal; // 0 horizontal, 1 vertical // player pieces placement on grid

    this.allowBackwards = allowBackwards; //1 true 2 false // pieces can move bacwards on grid
    this.secondChance = secondChance; //1 true 2 false // moving piece ends turn OR turn only ends with button press
    this.allowNoJumps = allowNoJumps; // 0 true 1 false // if a jump move is available, player has to take it
    this.allowHorizontal = allowHorizontal; //1 true 2 false // pieces can move sideways in vertical mode only
    this.nrOfRows = nrOfRows; // how many rows of player pieces
    this.allowJump = allowJump; //1 true 2 false // player can jump over theyir own pieces

    this.playerTurn = 1;

    this.startGame = function () { // new game
        this.Grid = new gameGrid();
        this.Grid.makeHexagonalShape(this.halfSize, this.nrOfRows, this.horizontal);
        this.Grid.startPlayerTurn(this.playerTurn);
        this.Grid.setAllowedMoves();
    }

    this.showPlayerNr = function (player, nr) {  // show win dialog
        if (nr == 1) {
            setTimeout(function () { // allow piece to dissapear
                $("#win-dialog h2").html(`Player <strong>${player}</strong> wins !`);
                $("#win-dialog").dialog("open");
            }, 1000);
        }
    }
};

//game grid handles pieces moving on grid
//has hexagons functions
function gameGrid() {

    currentChance = myGame.secondChance; // end turn auto
    let currentPlayer = myGame.playerTurn; 

    let playerPiecesNr = {
        1: 0,
        2: 0
    }

    let newGame = true;
    let showPossibleMoves = true;
    let freeMove = true; /// if not forced jump move or no jump detected
    let origAxial = '';
    let lastJump = false;
    let lastJumpPos;

    function Hex(x, y, z) { //grid coordonates
        this.q = x;
        this.r = y;
        this.s = z;
    };

    function Point(a, b) { // screen coordonates
        this.x = a;
        this.y = b;
    }

    anyHex = function (x, y, z) { // trnasform from axial to cube if needeed
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
    anyHex(-1, 0, 1), anyHex(-1, 1, 0), anyHex(0, 1, -1)]; //all possible neighbours

    function hexDirection(direction) {
        return hexDirections[direction];
    }

    const hexDiagonals = [anyHex(2, -1, -1), anyHex(1, -2, 1), anyHex(-1, -1, 2), anyHex(-2, 1, 1), anyHex(-1, 2, -1), anyHex(1, 1, -2)];

    let allowedNeigh = [anyHex(1, 0, -1), anyHex(1, -1, 0), anyHex(0, -1, 1),
    anyHex(-1, 0, 1), anyHex(-1, 1, 0), anyHex(0, 1, -1)]; // allowed moves (Admin only - experimental)

    function setAllowedNeigh(playerNr) {

        let removeNeigh = [];

        if (myGame.horizontal == 1) { // Horizontal Align   - does NOT have SIDE movement
            if (myGame.allowBackwards == 1) { //  not allowed backwards
                if (playerNr == 1) {
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


    //simple hex math
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

        let size = .06 * vw;
        let x = size * (3. / 2 * hex.q);
        let y = size * (Math.sqrt(3) / 2 * hex.q + Math.sqrt(3) * hex.s);
        return new Point(x, y);
    }

    function hexToPixelHoriz(hex) { // flat or pointy hexes, not used so far
        let size = 60;
        let x = size * (Math.sqrt(3) * hex.q + Math.sqrt(3) / 2 * hex.r);
        let y = size * (3. / 2 * hex.r);
        return new Point(x, y);
    }

    function neighbour(center, direction) { //gets neighbour in a given direction
        let dir = hexDirection(direction);
        let result = hexAdd(center, dir);
        return result;
    }

    function getDistance(a, b) { //gets distance in hexes
        return Math.max(Math.abs(parseInt(a.q) - parseInt(b.q)), Math.abs(parseInt(a.r) - parseInt(b.r)), Math.abs(parseInt(a.s) - parseInt(b.s)));
    }

    function getHexRing(center, radius) { //gets a ring at a given distance
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



    function setAllowFreeMove() { // if user forced to make jumps if available (ADMIN only - experimental)
        freeMove = true;
        $(`[hex]`).removeClass("test");

        testing = $(`.player${currentPlayer}`);

        $(testing).each(function () {
            t = $(this).attr("axial").split(" ");

            for (let i = 0; i < 6; i++) {
                neighPice = neighbour(anyHex(t[0], t[1]), i);

                if ($(`[player='${nextPlayer(currentPlayer)}'][axial='${neighPice.q} ${neighPice.s}']`).length) {
                    neighSpace = neighbour(anyHex(neighPice.q, neighPice.s), i);
                    // console.log("neigh player" + neighPice.q + " " + neighPice.s);

                    if ($(`[hex='${neighSpace.q} ${neighSpace.s}']:not([player]`).length) {
                        $(`[hex='${neighSpace.q} ${neighSpace.s}']:not([player]`).addClass("test");
                        setHelperText(5);
                        freeMove = false;
                        return;
                    }
                }
            }
        });
    }



    function getJumps(center) { // returns hexes where a piece can jump

        let results = [];
        let testing, ret;

        for (let side = 0; side < 6; side++) { //direction 
            cube = neighbour(center, side);
            if ((myGame.allowJump == 2)) {
                testing = $(`[hex='${cube.q} ${cube.s}'][player]`); // allow self jump ONLY if free move
            }
            else testing = $(`[hex='${cube.q} ${cube.s}'][player=${nextPlayer(currentPlayer)}]`); //jump over other player

            if (testing.length) {
                newMove = hexAdd(cube, hexSubtract(cube, center));
                found = allowedNeigh.find(function (value, index, array) {
                    if (currentPlayer == 1) {
                        dir = hexSubtract(cube, center);
                    }
                    else {
                        dir = hexSubtract(center, cube);
                    }
                    ret = hexEquals(dir, value); 
                    return ret;
                }); 
                if (typeof (found) === "object") {
                    results.push(newMove);
                }
            }
        }
        let filtered = $.grep(results, function (v) {
            return $(`[hex='${v.q} ${v.s}']:not([player]`).length;
        });

        if (lastJumpPos.length == 3) { ////// duble check required if user re-selects piece by dragging
            filtered2 = $.grep(filtered, function (v) {
                t = lastJumpPos.split(" ");
                return !hexEquals(anyHex(t[0], t[1]), v);
            });
        }
        else filtered2 = filtered;
        return filtered2;
    }

    function nextPlayer(player) { //returns nex player turn
        newPlayer = player == 1 ? 2 : 1;
        return newPlayer;
    }
    this.setPlayer = function (pl) {
        currentPlayer = pl;
    }

    this.makeHexagonalShape = function (N, rows, horizontal) { // make the grid

        $("#grid").empty();

        $(".grid_bg").css("width", `${.28 * vw * N + 50}px`).css("height", `${.245 * vw * N + 100}px`).css("margin-left", `10px`);
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
                    $("#grid").prepend(`<div class='hex' style="top:${coord.x}px; left:${coord.y}px"  hex="${axialR} ${axialQ}"></div>`);
                    //${axialR}xxxxxxxxx${axialQ}
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
                    // nonplayable hexes
                    // $("#grid").append(`<div class='hex test' style="top:${coord.x}px; left:${coord.y}px">${axialR}xxxxxxxxx${axialQ}</div>`); 
                }
            }
        }
        if (horizontal) {
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

    function showMove(item, jump) { // shows available moves
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
                lastJump = false;

                if (dropHex.hasClass("allowMove")) { 

                    let t = last.attr("axial").split(" ");
                    let coordX = dropHex.css("top");
                    let coordY = dropHex.css("left");
                    let lastPlayer = last.attr("player");
                    gridPos = dropHex.attr("hex").split(" ");

                    $(last).animate(
                        {
                            top: coordX,
                            left: coordY,
                        },
                        {
                            duration: 100,
                            start: function () {
                                // console.log("start");
                                $(`[hex='${t[0]} ${t[1]}']`).removeAttr("player"); //last player position hex
                                $(dropHex).droppable({ disabled: true });
                                distance = getDistance(anyHex(gridPos[0], gridPos[1]), anyHex(t[0], t[1])); // one tile or longer jump
                                if (distance > 1) {
                                    lastJumpPos = last.attr("axial");
                                    jumpOne(dropHex);
                                }

                                last.attr("axial", dropHex.attr("hex")); //update player
                                dropHex.attr("player", lastPlayer); // update hex

                                if (currentChance === 1) { // end turn automatic
                                    if (lastJump == false) {
                                        currentPlayer = nextPlayer(currentPlayer);
                                        prepare(`${currentPlayer}`);

                                    } else {
                                        console.log("continue turn drop ");
                                        $(`.player${currentPlayer}`).unbind("click");
                                        $(`.player${currentPlayer}`).not($(last)).draggable('disable');

                                        if (playerPiceSelect(last) == 0) { // no more jumps
                                            currentPlayer = nextPlayer(currentPlayer);
                                            prepare(`${currentPlayer}`);
                                        }
                                        else if (playerPiceSelect(last) == 1) { // a single jump available, and that is last position
                                            onlyOption = $(".allowMove").attr("hex");
                                            if (onlyOption === lastJumpPos) {
                                                currentPlayer = nextPlayer(currentPlayer);
                                                prepare(`${currentPlayer}`);
                                            }
                                        }
                                        else {  //multiple jumps available
                                            // console.log($(`[hex="${lastJumpPos}"]`));
                                            $(`[hex="${lastJumpPos}"]`).removeClass("allowMove");
                                            $(`[hex="${lastJumpPos}"]`).droppable('disable');
                                        }
                                    }
                                }
                                else { //end turn with button only
                                    $(`.player${currentPlayer}`).unbind("click");
                                    $(`.player${currentPlayer}`).not($(last)).draggable('disable');

                                    showPossibleMoves = false;
                                }
                            }
                        }
                    );
                } //has class allowmove
            } // drop event
        });
    } // function show move end

    function jumpOne(hex) { // jump over another piece
        lastJump = true;

        $(hex).removeClass("allowJump");
        gridPos = $(hex).attr("hex").split(" ");
        playerPos = $(last).attr("axial").split(" ");

        let dirHex = hexSubtract(anyHex(gridPos[0], gridPos[1]), anyHex(playerPos[0], playerPos[1]));
        dirHex = anyHex(Math.sign(dirHex.q), Math.sign(dirHex.s));
        distance = getDistance(anyHex(gridPos[0], gridPos[1]), anyHex(playerPos[0], playerPos[1]));
        let testPos = anyHex(playerPos[0], playerPos[1]);

        for (let i = 0; i < distance; i++) { // test in one direction
            testPos = hexAdd(testPos, dirHex);
            testing = $(`[axial='${testPos.q} ${testPos.s}'][player=${nextPlayer(currentPlayer)}]`);
            if (testing.length) {
                removePlayerPiece(testing);
                playerPiecesNr[currentPlayer]--;
                myGame.showPlayerNr(currentPlayer, playerPiecesNr[currentPlayer]);
            }
        }
    }

    function removePlayerPiece(piece) { //remove piece from grid

        t = $(piece).attr("axial").split(" ");
        $(`[hex='${t[0]} ${t[1]}']`).removeAttr("player");
        $(piece).addClass("scale animate");

        setTimeout(function () {
            $(piece).remove();
        }, 1200);
    }

    $(document).off().on('click', ".allowMove", function moveOne() { //click to move - TODO  - needs refactor
        lastJump = false;
        //  console.log(arguments.callee.caller.name);
        let t = last.attr("axial").split(" ");
        let currentHex = anyHex(t[0], t[1]);
        let coordX = $(this).css("top");
        let coordY = $(this).css("left");
        let lastUsehex = $(this).attr("hex");
        let t2 = lastUsehex.split(" ");
        let clickHex = $(this);
        let lastPlayer = last.attr("player");

        //use distance
        distance = getDistance(anyHex(t2[0], t2[1]), anyHex(t[0], t[1]));
        if (distance > 1) {
            lastJumpPos = last.attr("axial");
            jumpOne($(this));
        }
        last.attr("axial", lastUsehex);
        clickHex.attr("player", currentPlayer);

        $(`[hex='${t[0]} ${t[1]}']`).removeAttr("player");
        $(this).droppable({ disabled: true });  

        $(last).animate(
            {
                top: `${coordX}`,
                left: `${coordY}`,
            }, 200, function () { // TODO replace with start and test
                if (currentChance == 1) {
                    if (lastJump == false) {
                        currentPlayer = nextPlayer(currentPlayer);
                        prepare(`${currentPlayer}`);
                    } else {
                        console.log("continue turn click");

                        $(`.player${currentPlayer}`).unbind("click");
                        $(`.player${currentPlayer}`).not($(last)).draggable('disable');
                        setTimeout(function () { // allow piece to dissapear ---- can be fixed
                            if (playerPiceSelect(last) == 0) {
                                currentPlayer = nextPlayer(currentPlayer);  
                                prepare(`${currentPlayer}`);  
                            }
                            else if (playerPiceSelect(last) == 1) {
                                onlyOption = $(".allowMove").attr("hex");
                                //console.log(onlyOption, lastJumpPos);
                                if (onlyOption === lastJumpPos) {
                                    currentPlayer = nextPlayer(currentPlayer);  
                                    prepare(`${currentPlayer}`); 
                                }
                            }
                            else {
                                $(`[hex="${lastJumpPos}"]`).removeClass("allowMove");
                                $(`[hex="${lastJumpPos}"]`).droppable('disable');
                            }
                        }, 1200);
                    }
                }
                else {
                    $(`.player${currentPlayer}`).unbind("click");
                }
            }
        );
    });

    function playerPiceSelect(el) { //piece gets selected on click or drag
        jumpsNr = 0;
        setHelperText(2);

        $(".blink").removeClass("blink");
        $($(el)).removeClass("short_blink");
        $(el).not(".grid_bg").addClass("blink");
        let t = $(el).attr("axial").split(" ");
        last = $(el);

        $(".ui-droppable").droppable({ disabled: true });

        if (showPossibleMoves == true) {
            let neighs = getHexRing(anyHex(t[0], t[1]), 1);
            $("div .allowMove").removeClass("allowMove");
            // neighs.forEach(showMove);
            // if (freeMove) neighs.forEach(element => showMove(element, false));
            if (!lastJump) neighs.forEach(element => showMove(element, false));

            let jumps = getJumps(anyHex(t[0], t[1]));
            jumpsNr = jumps.length;
            // console.log(jumpsNr);
            jumps.forEach(element => showMove(element, true));
        }

        if (origAxial.length === 0) {
            origAxial = `${t[0]} ${t[1]}`;
            $(`[hex='${t[0]} ${t[1]}']`).droppable({ disabled: true });
        }
        // console.log(" jumps length " + jumpsNr);
        return (jumpsNr);
    }

    function prepare(player) { // new turn, reset player
        lastJump = false;
        lastJumpPos = "";
        setHelperText(1);
        showPossibleMoves = true;

        if (myGame.allowNoJumps == 1) { // player have to jump if possible
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
            $(`.player${nextPlayer(player)}`).draggable('disable');
            $(`.player${player}`).draggable('enable');
            origAxial = '';
        }
    }
    this.startPlayerTurn = function (player) {
        prepare(player);
    }
}; //END gameGrid


let timer;
let last;
let vw;
if (window.matchMedia("(orientation: portrait)").matches) {
    vw = $(document).width();
}
else vw = $(document).height();

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
    if (element.data("isclicked")) return true; //if already clicked return TRUE to indicate this click is not allowed
    element.data("isclicked", true);
    setTimeout(function () {
        element.removeData("isclicked");
    }, 500);
    return false; //return FALSE to indicate this click was allowed
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

    function fixCSS(el) { // reposition hexes on grid - NOT working when changing devices on 
        var attr = $(this).attr('hex');
        if (typeof attr !== typeof undefined && attr !== false) {
            // Element has this attribute
            t = $(this).attr("hex").split(" ");
            let size = .06 * vw2;
            let x = size * (Math.sqrt(3) * t[0] + Math.sqrt(3) / 2 * t[1]);
            let y = size * (3. / 2 * t[1]);

            $(this).css("left", x + "px");
            $(this).css("top", y + "px");
        }
        else {
            attr = $(this).attr('axial');
            if (typeof attr !== typeof undefined && attr !== false) {
                // Element has this attribute
                t = $(this).attr("axial").split(" ");
                let size = .06 * vw2;
                let x = size * (Math.sqrt(3) * t[0] + Math.sqrt(3) / 2 * t[1]);
                let y = size * (3. / 2 * t[1]);

                $(this).css("left", x + "px");
                $(this).css("top", y + "px");
            }
        }
    }

    $(window).resize(function () {
        if (window.matchMedia("(orientation: portrait)").matches) {
            vw2 = $(document).width();
        }
        else vw2 = $(document).height();

        $('[hex]').each(fixCSS);
        $('[axial]').each(fixCSS);
        $(".grid_bg").css("width", `${.28 * vw2 * myGame.halfSize + 50}px`).css("height", `${.245 * vw2 * myGame.halfSize + 10}px`).css("margin-left", `10px`);
    });
});


// ADMIN
$("#generate").click(function () { // makes new game  - Adimn ONLY
    $("#grid").empty();

    myGame = null;
    myGame = new Game();

    myGame.halfSize = parseInt($("#half_size").val());
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

function setHelperText(textId) { // returns User help text
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

