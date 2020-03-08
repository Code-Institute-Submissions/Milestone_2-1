function Game(halfSize = 3, nrOfPlayers = 2, allowHorizontal = true, allowBackwards = false, secondChance = true, allowNoJumps = false, nrOfRows = 2, horizontal = true) {

    this.nrOfPlayers = nrOfPlayers;
    this.allowHorizontal = allowHorizontal;
    this.allowBacwards = allowBackwards;
    this.secondChance = secondChance;
    this.allowNoJumps = allowNoJumps;
    this.halfSize = halfSize;
    this.nrOfRows = nrOfRows;
    this.horizontal = horizontal;

    this.playerTurn = 1;

    this.GetTurn = function () {
        return this.playerTurn;
    }
    this.setTurn = function(turn) {
        this.playerTurn = turn;
    }

    this.startGame = function () {
        this.Grid = new gameGrid();
        this.Grid.makeHexagonalShape(this.halfSize, this.nrOfRows, this.horizontal);
        this.Grid.playerTurn(this.playerTurn);
    }


    // this.gameStart = function () {
    //     makeHexagonalShape(this.halfSize, this.nrOfRows);
    // };

};


function gameGrid() {

    this.bar = {parent: this}

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

    function showNeighbours(Hex) {
        return getHexRing(2);
    }

    this.makeHexagonalShape = function (N, rows, horizontal) {
        // console.log("make hexagonal called " + N);
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
                            $("#grid").append(`<div class='cylinder playerOne' axial="${axialR} ${axialQ}" player="1" style="top:${coord.x}px; left:${coord.y}px;"></div>`);

                        }
                        else if ((axialQ == 1) && (rows >= 2)) {
                            $("#grid div").first().attr("player", "1");
                            $("#grid").append(`<div class='cylinder playerOne' axial="${axialR} ${axialQ}" player="1"  style="top:${coord.x}px; left:${coord.y}px;"></div>`);

                        }
                        else if ((axialQ == 2) && (rows == 3)) {
                            $("#grid div").first().attr("player", "1");
                            $("#grid").append(`<div class='cylinder playerOne' axial="${axialR} ${axialQ}" player="1"  style="top:${coord.x}px; left:${coord.y}px;"></div>`);

                        }

                        else if (axialQ == 2 * N) {
                            $("#grid div").first().attr("player", "2");
                            $("#grid").append(`<div class='cylinder playerTwo' axial="${axialR} ${axialQ}" player="2"  style="top:${coord.x}px; left:${coord.y}px;"></div>`);
                        }

                        else if ((axialQ == 2 * N - 1) && (rows >= 2)) {
                            $("#grid div").first().attr("player", "2");
                            $("#grid").append(`<div class='cylinder playerTwo' axial="${axialR} ${axialQ}" player="2"  style="top:${coord.x}px; left:${coord.y}px;"></div>`);
                        }

                        else if ((axialQ == 2 * N - 2) && (rows == 3)) {
                            $("#grid div").first().attr("player", "2");
                            $("#grid").append(`<div class='cylinder playerTwo' axial="${axialR} ${axialQ}" player="2"  style="top:${coord.x}px; left:${coord.y}px;"></div>`);
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

                        $("#grid").append(`<div class='cylinder playerOne' axial="${hex.q} ${hex.s}" player="1" style="top:${coord.x}; left:${coord.y};"></div>`);
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

                        $("#grid").append(`<div class='cylinder playerTwo' axial="${hex.q} ${hex.s}" player="2" style="top:${coord.x}; left:${coord.y};"></div>`);
                        $(`[hex='${hex.q} ${hex.s}']`).attr("player", "2");
                    }
                });
            });

            // console.log(allRings);
        }


        function showMove(item, index) {

            $(`[hex='${item.q} ${item.s}']`).addClass("allowMove");

        }

        $(".cylinder").click(function () {


            // TODO put this back
            // console.log($(this).attr("axial"));
            $(".blink").removeClass("blink");
            $(this).addClass("blink");

            let t = $(this).attr("axial").split(" ");

            // REMOVED - conflict with movement animation
            // if (last && (last.attr("axial") != $(this).attr("axial"))) {
            //     blinkingStop(last);
            // }
            last = $(this);
            // blinking($(this));

            let neighs = getHexRing(anyHex(t[0], t[1]), 1);
            $("div .allowMove").removeClass("allowMove");
            neighs.forEach(showMove);
        });




        // console.log(results);
        return results;
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


        $(last).animate(
            {
                top: `${coordX}`,
                left: `${coordY}`,

            }, 200, function () {
                last.attr("axial", lastUsehex);
                clickHex.attr("palyer", lastPlayer);
                $(`[hex='${t[0]} ${t[1]}']`).removeAttr("player");
            }
        );

    });


    this.playerTurn = function (player) {
        // console.log("aa");
        $("h2 span").html(player);
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



$(document).ready(function () {
    let myGame = new Game();
    myGame.startGame();
    // console.log("doc ready: " + myGame.gameStart());



});




// ADMIN
$("#generate").click(function () {
    $("#grid").empty();

    let myGame = new Game();

    myGame.halfSize = parseInt($("#half_size").val());
    myGame.nrOfPlayers = parseInt($("#players").val());
    myGame.allowHorizontal = parseInt($("#allow_horizontal").val());
    myGame.allowBackwards = parseInt($("#allow_backwards").val());
    myGame.secondChance = parseInt($("#second_chance").val());
    myGame.allowNoJumps = parseInt($("[name='allow_nojumps']:checked").val());
    myGame.nrOfRows = parseInt($("[name='nr_of_rows']:checked").val());
    myGame.horizontal = parseInt($("[name='horiz']:checked").val());

    // console.log(parseInt($("[name='horiz']:checked").val()));
    // console.log(parseInt($("[name='nr_of_rows']:checked").val()));

    myGame.startGame();
    // console.log("button: " + myGame.gameStart());

});

$("#end_turn").click(function () {
console.log("end");
});    