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
        vec2( -1, 1 ),
        vec2(  1,  1 ),
        vec2(  1, -1 ),
        vec2( -1, -1 ),
        vec2(  -1, 1 ),
        vec2(1,-1),
       
       
    
        
    ];

    divideTriangle( vertices[0], vertices[1], vertices[2],vertices[3],
                   vertices[4],vertices[5], NumTimesToSubdivide);

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

function triangle( a, b, c,d,e,f)
{
    points.push( a, b, c ,d,e,f);
}

function divideTriangle( a, b, c, d,e,f, count )
{

    // check for end of recursion

    if ( count === 0 ) {
        triangle( a, b, c ,d,e,f);
    }
    else {

        //bisect the sides

        var ab1= mix( a, b, 0.33 );
        var ab2= mix( a, b, 0.66);

        var bc1 = mix( b, c, 0.33 );
        var bc2 = mix( b, c, 0.66 );

        var ad1 = mix( a, d, 0.33 );
        var ad2 = mix( a, d, 0.66 );

        var cd1= mix( c, d, 0.33 );
        var cd2= mix( c, d, 0.66);

        

        var a1 = mix(ad1,bc1,0.33);
        var b1 = mix(ad1,bc1,0.66);
        var d1 = mix(ad2,bc2,0.33);
        var c1 = mix(ad2,bc2,0.66);
        

        --count;

         // three new triangles
       divideTriangle(a,ab1,a1,ad1,a,a1,count);

       divideTriangle(ab1,ab2,b1,a1,ab1,b1,count);

      divideTriangle(ab2,b,bc1,b1,ab2,bc1,count);

   divideTriangle(b1,bc1,bc2,c1,b1,bc2,count);

       divideTriangle(c1,bc2,c,cd1,c1,c,count);

       divideTriangle(d1,c1,cd1,cd2,d1,cd1,count);
       
       divideTriangle(ad2,d1,cd2,d,ad2,cd2,count);

       divideTriangle(ad1,a1,d1,ad2,ad1,d1,count);

        // three new triangles
      //divideTriangle(a,ab1,a1,ad1,a,count);

       /* divideTriangle(ab1,ab2,b1,a1,count);

       divideTriangle(ab2,b,bc1,b1,count);

     divideTriangle(b1,bc1,bc2,c1,count);

        divideTriangle(c1,bc2,c,cd2,count);

        divideTriangle(d1,c1,cd1,cd2,count);
        
        divideTriangle(ad2,d1,cd2,d,count);

        divideTriangle(ad1,a1,d1,ad2,count);
       

        
*/
        

        

        

    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}
