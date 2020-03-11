function Game(halfSize = 3, nrOfPlayers = 2, allowJump = 2, allowHorizontal = true, allowBackwards = false, secondChance = 1, allowNoJumps = false, nrOfRows = 2, horizontal = true) {

    this.nrOfPlayers = nrOfPlayers;
    this.allowHorizontal = allowHorizontal;
    this.allowBacwards = allowBackwards;
    this.secondChance = secondChance;
    this.allowNoJumps = allowNoJumps;
    this.halfSize = halfSize;
    this.nrOfRows = nrOfRows;
    this.horizontal = horizontal;
    this.allowJump = allowJump;

    this.playerTurn = 1;

    // console.log(this.secondChance);

    this.startGame = function () {
        this.Grid = new gameGrid();
        this.Grid.makeHexagonalShape(this.halfSize, this.nrOfRows, this.horizontal);
        this.Grid.startPlayerTurn(this.playerTurn);

    }


    // this.gameStart = function () {
    //     makeHexagonalShape(this.halfSize, this.nrOfRows);
    // };

};


function gameGrid() {

    currentChance = myGame.secondChance;
    // console.log("grid start " + myGame.secondChance);
    // let currentChance = 99;
    let currentPlayer = myGame.playerTurn;
    let newGame = true;
    let showPossibleMoves = true;
    let origAxial = '';

    // console.log("grid chance " + currentChance + " grid player " + currentPlayer);

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

    // console.log(hexMultiply(anyHex(1,2,3), 4));

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
        // console.log("dir in [" + dir.q + "] [" + dir.s + "] center [" + center.q + "] [" + center.s + "] result [" + result.q + "] [" + result.s + "]");
        return result;
    }


    function getHexRing(center, radius) {
        let results = [];

        let cube = hexAdd(center, hexMultiply(hexDirection(4), radius));
        // let cube = hexAdd(center, hexDirection(4));

        // console.log("cube [" + cube.q + "] [" + cube.r + "] [" + cube.s + "]");

        for (let side = 0; side < 6; side++) {
            for (let step = 0; step < radius; step++) {
                results.push(cube);
                cube = neighbour(cube, side);
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


        // console.log("make hexagonal called " + N);

        $(".grid_bg").css("width", `${290 * N + 100}px`).css("height", `${200 * N + 100}px`).css("margin-left", `${10 * N}px`);
        let results = [];
        for (let q = -N; q <= N; q++) {

            // for (let r = -N; r <= N; r++) {
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

                        }
                        else if ((axialQ == 1) && (rows >= 2)) {
                            $("#grid div").first().attr("player", "1");
                            $("#grid").append(`<div class='cylinder player1' axial="${axialR} ${axialQ}" player="1"  style="top:${coord.x}px; left:${coord.y}px;"></div>`);

                        }
                        else if ((axialQ == 2) && (rows == 3)) {
                            $("#grid div").first().attr("player", "1");
                            $("#grid").append(`<div class='cylinder player1' axial="${axialR} ${axialQ}" player="1"  style="top:${coord.x}px; left:${coord.y}px;"></div>`);

                        }

                        else if (axialQ == 2 * N) {
                            $("#grid div").first().attr("player", "2");
                            $("#grid").append(`<div class='cylinder player2' axial="${axialR} ${axialQ}" player="2"  style="top:${coord.x}px; left:${coord.y}px;"></div>`);
                        }

                        else if ((axialQ == 2 * N - 1) && (rows >= 2)) {
                            $("#grid div").first().attr("player", "2");
                            $("#grid").append(`<div class='cylinder player2' axial="${axialR} ${axialQ}" player="2"  style="top:${coord.x}px; left:${coord.y}px;"></div>`);
                        }

                        else if ((axialQ == 2 * N - 2) && (rows == 3)) {
                            $("#grid div").first().attr("player", "2");
                            $("#grid").append(`<div class='cylinder player2' axial="${axialR} ${axialQ}" player="2"  style="top:${coord.x}px; left:${coord.y}px;"></div>`);
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
                allRings.push(getHexRing(anyHex(0, N), i));
            }
            allRings.push([anyHex(0, N)]);
            allRings.forEach(function (el) {
                el.forEach(function (hex) {

                    if ($(`[hex='${hex.q} ${hex.s}']`).length) {

                        coord.y = $(`[hex='${hex.q} ${hex.s}']`).css("left");
                        coord.x = $(`[hex='${hex.q} ${hex.s}']`).css("top");

                        $("#grid").append(`<div class='cylinder player1' axial="${hex.q} ${hex.s}" player="1" style="top:${coord.x}; left:${coord.y};"></div>`);
                        $(`[hex='${hex.q} ${hex.s}']`).attr("player", "1");
                    }
                });
            });

            allRings = [];
            for (i = 1; i <= rows; i++) {
                allRings.push(getHexRing(anyHex(2 * N, N), i));
            }
            allRings.push([anyHex(2 * N, N)]);
            allRings.forEach(function (el) {
                el.forEach(function (hex) {
                    // console.log(hex);
                    if ($(`[hex='${hex.q} ${hex.s}']`).length) {

                        coord.y = $(`[hex='${hex.q} ${hex.s}']`).css("left");
                        coord.x = $(`[hex='${hex.q} ${hex.s}']`).css("top");

                        $("#grid").append(`<div class='cylinder player2' axial="${hex.q} ${hex.s}" player="2" style="top:${coord.x}; left:${coord.y};"></div>`);
                        $(`[hex='${hex.q} ${hex.s}']`).attr("player", "2");
                    }
                });
            });

            // console.log(allRings);
        }




        return results;
    }


    function showMove(item) {
        //console.log("showMove");


        $(`[hex='${item.q} ${item.s}']:not([player]`).addClass("allowMove");
        $(`[hex='${item.q} ${item.s}']:not([player]`).droppable({
            accept: '.blink',

            hoverClass: 'hexHover',
            disabled: false,
            drop: function (event, ui) {

                // console.log("dropped");
                // console.log(ui);

                let dropHex = $(event.target);
                // console.log($(last).attr("axial") + " vs " +dropHex.attr("hex"));

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


    $(document).on('click', ".allowMove", function moveOne() {

        console.log("Allow move");
        //TODO z-idex depends on rows
        let t = last.attr("axial").split(" ");
        let currentHex = anyHex(t[0], t[1]);

        let coordX = $(this).css("top");
        let coordY = $(this).css("left");

        let lastUsehex = $(this).attr("hex");
        let clickHex = $(this);

        let lastPlayer = last.attr("player");


        $(last).animate(
            {
                top: `${coordX}`,
                left: `${coordY}`,

            }, 200, function () {
                last.attr("axial", lastUsehex);
                clickHex.attr("player", lastPlayer);
                $(`[hex='${t[0]} ${t[1]}']`).removeAttr("player");

            }
        );


        //  console.log("animate chance " + currentChance);
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
        last = $(el);
        // blinking($(this));

        // console.log("select " + t[0] + " " + t[1]);

        if (showPossibleMoves == true) {
            let neighs = getHexRing(anyHex(t[0], t[1]), 1);
            $("div .allowMove").removeClass("allowMove");
            neighs.forEach(showMove);
        }

        if (origAxial.length === 0) {
            origAxial = `${t[0]} ${t[1]}`;
        $(`[hex='${t[0]} ${t[1]}']`).droppable({ disabled: true });
        // console.log("mark disable " + t[0] + " " + t[1]);
    } else {
        
    }

    }

    function prepare(player) {
        
        setHelperText(1);
        showPossibleMoves = true;

        console.log("prepare " + player);
        // console.log("Being called from " + arguments.callee.caller.toString());
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
        // console.log("start blinking " + $(elm).attr("axial") );
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

    // console.log("blStop" + $(elm).attr("axial"));
}


// ///try to change css on the fly
// var setRotation = function($target, degrees) {
//     $target.css("-webkit-transform", "rotate(" + degrees + "deg)"); /* Safari and Chrome */
//     $target.css("-moz-transform", "rotate(" + degrees + "deg)"); /* Firefox */
//     $target.css("-ms-transform", "rotate(" + degrees + "deg)"); /* IE 9 */
//     $target.css("-o-transform", "rotate(" + degrees + "deg)"); /* Opera */
//     $target.css("transform", "rotate(" + degrees + "deg)"); 
//   };

//   var rotation = 0;

//   //Set css() of elements
//   $( document ).ready(function(){
//     setInterval(function() {
//       rotation += 0.1;
//       setRotation($(".rotation"), rotation); 
//     }, 1000/60);
//   });






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
        // console.log(myGame.Grid);


    });

});




// ADMIN
$("#generate").click(function () {
    $("#grid").empty();
    myGame = null;
    myGame = new Game();

    myGame.halfSize = parseInt($("#half_size").val());
    myGame.nrOfPlayers = parseInt($("#players").val());
    myGame.allowHorizontal = parseInt($("#allow_horizontal").val());
    myGame.allowBackwards = parseInt($("#allow_backwards").val());
    myGame.secondChance = $("#second_chance:checked").val() ? parseInt($("#second_chance:checked").val()) : 1;
    myGame.allowNoJumps = parseInt($("[name='allow_nojumps']:checked").val());
    myGame.nrOfRows = parseInt($("[name='nr_of_rows']:checked").val());
    myGame.horizontal = parseInt($("[name='horiz']:checked").val());
    myGame.allowJump = $("#allow_jump:checked").val() ? parseInt($("#allow_jump:checked").val()) : 1;

    //   console.log($("#second_chance:checked").val() ? parseInt($("#second_chance:checked").val()) : 1);

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

        default:
            helperText = "Click on game piece or start dragging";
    }
    $("#move_info").text(helperText);
}

