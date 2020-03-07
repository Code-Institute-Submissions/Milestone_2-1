function Game(halfSize = 3, nrOfPlayers = 2, allowHorizontal = true, allowBackwards = false, allowNoJumps = false, nrOfRows = 2) {

    this.nrOfPlayers = nrOfPlayers;
    this.allowHorizontal = allowHorizontal;
    this.allowBacwards = allowBackwards;
    this.allowNoJumps = allowNoJumps;
    this.halfSize = halfSize;
    this.nrOfRows = nrOfRows;

    this.startGame = function() {
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

        if (this.s) {
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
        return anyHex(a.q + b.q, a.r + b.r, a.s + b.s);
    }

    function hexSubtract(a, b) {
        return anyHex(a.q - b.q, a.r - b.r, a.s - b.s);
    }

    function hexMultiply(a, k) {
        return anyHex(a.q * k, a.r * k, a.s * k);
    }

    // console.log(hexMultiply(anyHex(1,2,3), 4));

    function hexToPixel(HexAxial) {

        //TODO maybe dynamic size from css
        let size = 60;
        let x = size * (3. / 2 * HexAxial.q);
        let y = size * (Math.sqrt(3) / 2 * HexAxial.q + Math.sqrt(3) * HexAxial.s);

        return new Point(x, y);

    }


    this.makeHexagonalShape = function (N, rows) {
        console.log("make hexagonal called " + N);
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

                    $("#grid").prepend(`<div class='hex' style="top:${coord.x}px; left:${coord.y}px"  hex="${axialR} ${axialQ}">
                    ${axialR}xxxxxxxxx${axialQ}</div>`);

                    if (axialQ == 0) {
                        $("#grid div").first().append(`<div class='cylinder playerOne' axial="${axialR} ${axialQ}"></div>`);
                    }
                    else if ((axialQ == 1) && (rows == 2)) {
                        $("#grid div").first().append(`<div class='cylinder playerOne' axial="${axialR} ${axialQ}"></div>`);
                    }

                    else if (axialQ == 2 * N) {
                        $("#grid div").first().append(`<div class='cylinder playerTwo' axial="${axialR} ${axialQ}"></div>`);
                    }

                    else if ((axialQ == 2 * N - 1) && (rows == 2)) {
                        $("#grid div").first().append(`<div class='cylinder playerTwo' axial="${axialR} ${axialQ}"></div>`);
                    }


                }

                else {
                    //   $("#grid").append(`<div class='hex test' style="top:${coord.x}px; left:${coord.y}px">${axialR}xxxxxxxxx${axialQ}</div>`); 
                }
            }
        }
        // console.log(results);
        return results;
    }

    function hexRing(radius) {
        let results = [];
        let direction = anyHex(-1, 1, 0);
        var H = anyHex(direction.x * radius, direction.y * radius, direction.z * radius);
        for (var side = 0; side < 6; side++) {
            for (var step = 0; step < radius; step++) {
                results.push(H);
    
                H = H.neighbor(side);
            }
        }
        return results;
    }
    
}; //END gameGrid






var timer;


$(".cylinder").click(function () {

    // TODO put this back
    console.log($(this).attr("axial"));
    let t = $(this).attr("axial").split(" ");
    let currentAxial = new HexAxial(t[0], t[1]);
    blinking($(this));
    // $(this).addClass("animateArc");
    //TODO FIX ZINDEX
    // findPossibleMoves()
    neighboursOnRadius = getNeighbours(currentAxial);

    function getNeighbours(axial) {
        console.log(axial.q, axial.r);
    }

});


function blinking(elm) {
    timer = setInterval(blink, 200);
    function blink() {
        $(elm).fadeTo(200, 0.9, function () { $(elm).fadeTo(200, 1.0); });
    }
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

