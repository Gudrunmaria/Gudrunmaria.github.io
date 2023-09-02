/////////////////////////////////////////////////////////////////
//    Sýnidæmi í Tölvugrafík
//     Sýnir hvernig hægt er að breyta lit með uniform breytu
//
//    Hjálmtýr Hafsteinsson, ágúst 2023
/////////////////////////////////////////////////////////////////
var gl;
var points;

var NumPoints = 100;
var colorLoc;
var r;
var g;
var b;
var v1 = -0.8
var v2 =-0.9
var h1 =-0.6
var h2 =-0.9 
var u1 =-0.7
var u2 =-0.7

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    // And, add our initial point into our array of points
    
    points = [];
    
    // Compute new points
    // Each new point is located midway between
    // last point and a randomly chosen vertex

    for ( var i = 0;i < 100; ++i ) {
        var j = Math.random();
        points.push( v1+j);
        points.push( v2+j);
        points.push( h1+j);
        points.push( h2+j);
        points.push( u1+j);
        points.push( u2+j);
    }
    console.log(points);
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

    // Associate shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Find the location of the variable fColor in the shader program
    colorLoc = gl.getUniformLocation( program, "fColor" );
    
    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    var stada =0;
    for(var i =0; i<100; i++) {    
        r =Math.random();
        g = Math.random();
        b = Math.random();
        gl.uniform4fv( colorLoc, vec4(r, g,b, 1.0) );
        gl.drawArrays( gl.TRIANGLES,stada ,3 );
        stada=stada+3;
    }
	
}