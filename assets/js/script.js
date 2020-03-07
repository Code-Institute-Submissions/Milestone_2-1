function Game(halfSize = 3, nrOfPlayers = 2, allowHorizontal = true, allowBackwards = false, allowNoJumps = false, nrOfRows = 2) {

    this.nrOfPlayers = nrOfPlayers;
    this.allowHorizontal = allowHorizontal;
    this.allowBacwards = allowBackwards;
    this.allowNoJumps = allowNoJumps;
    this.halfSize = halfSize;
    this.nrOfRows = nrOfRows;

    this.startGame = function () {
        this.Grid = new gameGrid();
        this.Grid.makeHexagonalShape(this.halfSize, this.nrOfRows);



    }


    // this.gameStart = function () {
    //     makeHexagonalShape(this.halfSize, this.nrOfRows);
    // };

};


function gameGrid() {

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

    this.makeHexagonalShape = function (N, rows) {
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
                    //results.push(hex2);

                    //TODO make switch and use function to add player pucks
                    //REMINDER - changed  $("#grid div").first() to $("#grid")

                    $("#grid").prepend(`<div class='hex' style="top:${coord.x}px; left:${coord.y}px"  hex="${axialR} ${axialQ}">
                    ${axialR}xxxxxxxxx${axialQ}</div>`);

                    if (axialQ == 0) {
                        $("#grid").append(`<div class='cylinder playerOne' axial="${axialR} ${axialQ}" style="top:${coord.x}px; left:${coord.y}px;"></div>`);
                    }
                    else if ((axialQ == 1) && (rows == 2)) {
                        $("#grid").append(`<div class='cylinder playerOne' axial="${axialR} ${axialQ}" style="top:${coord.x}px; left:${coord.y}px;"></div>`);
                    }

                    else if (axialQ == 2 * N) {
                        $("#grid").append(`<div class='cylinder playerTwo' axial="${axialR} ${axialQ}" style="top:${coord.x}px; left:${coord.y}px;"></div>`);
                    }

                    else if ((axialQ == 2 * N - 1) && (rows == 2)) {
                        $("#grid").append(`<div class='cylinder playerTwo' axial="${axialR} ${axialQ}" style="top:${coord.x}px; left:${coord.y}px;"></div>`);
                    }


                }

                else {
                    //   $("#grid").append(`<div class='hex test' style="top:${coord.x}px; left:${coord.y}px">${axialR}xxxxxxxxx${axialQ}</div>`); 
                }
            }
        }


        function showMove(item, index) {

            $(`[hex='${item.q} ${item.s}']`).addClass("allowMove");

        }
        $(".cylinder").click(function () {

            // TODO put this back
            // console.log($(this).attr("axial"));
            let t = $(this).attr("axial").split(" ");
            let currentHex = anyHex(t[0], t[1]);

            if (last && (last.attr("axial") != $(this).attr("axial"))) {
                blinkingStop(last);
            }
            last = $(this);
            blinking($(this));

            let neighs = getHexRing(anyHex(t[0], t[1]), 1);
            $("div .allowMove").removeClass("allowMove");
            neighs.forEach(showMove);
        });




        // console.log(results);
        return results;
    }



    $(document).on('click', ".allowMove", function moveOne() {

        let t = $(this).attr("hex").split(" ");
        let currentHex = anyHex(t[0], t[1]);
        console.log(t[0], t[1], last.attr("axial"));

         coordX = $(this).css("top");
        coordY = $(this).css("left");

               $(last).animate(
            {
                top: `${coordX}`,
                left: `${coordY}`
            }, 200
        );
        last.attr("axial", $(this).attr("hex"));

    });



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

// TODO Add 1 oor 2 rows of player puck
//TODO add green pieces count for players



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
    myGame.nrOfPlayers = $("#players").val();
    myGame.allowHorizontal = $("#allow_horizontal").val();
    myGame.allowBackwards = $("#allow_backwards").val();
    myGame.allowNoJumps = $("[name='allow_nojumps']").val();
    myGame.nrOfRows = $("[name='nr_of_rows']").val();



    myGame.startGame();
    // console.log("button: " + myGame.gameStart());

});

