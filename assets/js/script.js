
function HexCube(q, r, s) {
    this.x = q;
    this.y = r;
    this.z = s;


};

function HexAxial(a, b) {
    this.q = a;
    this.r = b;
};

function Point(a, b) {
    this.x = a;
    this.y = b;
}



function cube_to_axial(HexCube) {
    var q = HexCube.x;
    var r = HexCube.z;
    return new HexAxial(q, r);
}

function axial_to_cube(HexAxial) {
    var x = HexAxial.q;
    var z = HexAxial.r;
    var y = -x - z;
    return new HexCube(x, y, z);
}


function makeHexMap(mapRadius) {

    let mapArray = [];
    for (q = -mapRadius; q <= mapRadius; q++) {



        let r1 = Math.max(-mapRadius, -q - mapRadius);
        let r2 = Math.min(mapRadius, -q + mapRadius);


        for (r = r1; r <= r2; r++) {
            mapArray.push([q, r, -q - r]);
        }
    }
    return mapArray;
}

//    console.log(makeHexMap(3));



// use flat top
function hexToPixel(HexAxial) {

    let size = 60;

    let x = size * (3. / 2 * HexAxial.q);
    let y = size * (Math.sqrt(3) / 2 * HexAxial.q + Math.sqrt(3) * HexAxial.r);

    return new Point(x, y);

}

// pointy top
// function hexToPixel(HexAxial) {
//     let size = 60;
//     let x = size * (Math.sqrt(3) * HexAxial.q  +  Math.sqrt(3)/2 * HexAxial.r)
//     let y = size * (                         3./2 * HexAxial.r)
//     return new Point(x, y);
// }

let testHex = new HexAxial(3, 3);
hexToPixel(testHex);
console.log(hexToPixel(testHex));



function makeHexagonalShape(N) {
    let results = [];
    for (let q = -N; q <= N; q++) {


        // for (let r = -N; r <= N; r++) {
        for (let r = N; r >= -N; r--) {
            let hex = new HexCube(q + N, r + N, -q - r + N);

            let axialQ = q + N;
            let axialR = -q - r + N;


            let hex2 = new HexAxial(axialQ, axialR);

            coord = hexToPixel(hex2);

            if (((Math.abs(q) + Math.abs(r) + Math.abs(-q - r)) / 2) <= N) {
                results.push(hex);
                //results.push(hex2);
                $("#grid").prepend(`<div class='hex' style="top:${coord.x}px; left:${coord.y}px">${axialR}xxxxxxxxx${axialQ}</div>`);

                if ((axialQ == 0 || axialQ == 1)) {
                    $("#grid div").first().append(`<div class='cylinder playerOne' axial="${axialR} ${axialQ}"></div>`);
                }
                else if ((axialQ == 2 * N) || (axialQ == 2 * N - 1)) {
                    $("#grid div").first().append(`<div class='cylinder playerTwo' axial="${axialR} ${axialQ}"></div>`);
                }

            }

            else { $("#grid").append(`<div class='hex test' style="top:${coord.x}px; left:${coord.y}px">${axialR}xxxxxxxxx${axialQ}</div>`); }

            // console.log(axialR, axialQ);
        }





    }
    return results;
}

console.log(makeHexagonalShape(2));

var timer;


$(".cylinder").click(function () {
    console.log($(this).attr("axial"));
    blinking($(this));
    $(this).addClass("animateArc");
    //TODO FIX ZINDEX
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