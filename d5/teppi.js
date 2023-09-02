"use strict";

var canvas;
var gl;

var points = [];

var NumTimesToSubdivide = 5;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    var vertices = [
        vec2( 1, -1 ),
        vec2(  1,  1 ),
        vec2(  -1, -1 ),
        vec2(1,-1)
    ];

    divideTriangle( vertices[0], vertices[1], vertices[2],vertices[3],
                    NumTimesToSubdivide);

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
  
    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

function triangle( a, b, c,d)
{
    points.push( a, b, c ,d);
}

function divideTriangle( a, b, c, d, count )
{

    // check for end of recursion

    if ( count === 0 ) {
        triangle( a, b, c ,d);
    }
    else {

        //bisect the sides

        var ab1= mix( a, b, 0.33 );
        var ab2= mix( a, b, 0.66);
        var ac1 = mix( a, c, 0.33 );
        var ac2 = mix( a, c, 0.66 );
        var cd1= mix( c, d, 0.33 );
        var cd2= mix( c, d, 0.66);
        var bd1 = mix( b, d, 0.33 );
        var bd2 = mix( b, d, 0.66 );
        var a1 = mix(ac1,bd1,0.33);
        var b1 = mix(ac1,bd1,0.66);
        var c1 = mix(ac2,bd2,0.33);
        var d1 = mix(ac2,bd2,0.66);
        

        --count;

        // three new triangles
        divideTriangle(a,ac1,ab1,a1,count);
        divideTriangle(ac1,ac2,a1,c1,count);
        divideTriangle(c,ac2,cd1.c1,count);
        divideTriangle(cd1,cd2,c1,d1,count);
        divideTriangle(d,cd2,bd2,d1,count);
        divideTriangle(bd2,bd1,d1,c1,count);
        divideTriangle(b,ab2,b1,bd1,count);
        divideTriangle(ab1,a1,b1,ab2,count);

    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}
