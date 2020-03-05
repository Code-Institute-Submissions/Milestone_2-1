
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

            let temp1 = q + N;
            let temp2 = -q - r + N;

            let hex2 = new HexAxial(r + N, -q - r + N);

            coord = hexToPixel(hex2);

            if (((Math.abs(q) + Math.abs(r) + Math.abs(-q - r)) / 2) <= N) {
                results.push(hex);
                //results.push(hex2);
                $("#grid").append(`<div class='hex' style="top:${coord.x}px; left:${coord.y}px">${temp2}xxxxxxxxx${temp1}</div>`);
            }

            else { $("#grid").prepend(`<div class='hex test' style="top:${coord.x}px; left:${coord.y}px">${temp2}xxxxxxxxx${temp1}</div>`); }

            // console.log(temp2, temp1);
        }


    }
    return results;
}

console.log(makeHexagonalShape(2));


// function makeHexagonalShape(N) {
//     let results = [];
//     for (let q = 0; q <= N; q++) {
//         for (let r = 0; r <= N; r++) {
//             let hex = new HexCube(q, r, -q-r);
//             if (((Math.abs(q) + Math.abs(r) + Math.abs(-q-r)) / 2) <= N) 
//             {
//                 results.push(hex);
//             }
//         }
//     }
//     return results;
// }

//  console.log(makeHexagonalShape(6));