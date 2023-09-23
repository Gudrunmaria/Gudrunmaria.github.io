///////////////////////////////////////////////////////////////////
//    Sýnidæmi í Tölvugrafík
//     Einfaldasta WebGL forritið.  Teiknar einn rauðan þríhyrning.
//
//    Hjálmtýr Hafsteinsson, ágúst 2023
///////////////////////////////////////////////////////////////////
var gl;
var points;

var locColor;
var locTime;
var iniTime;
var isTriangleVisible =true;
var triangleColor = vec4(1.0,0.0,0.0,1.0);
window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    var vertices = new Float32Array([-1, -1, 0, 1, 1, -1]);

    //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.95, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

    // Associate shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    locTime = gl.getUniformLocation( program, "time" );
    iniTime = Date.now();

    setInterval(toggleTriangleVisibility, 1000);

    render();
};

function toggleTriangleVisibility() {
    isTriangleVisible = !isTriangleVisible;

    if(isTriangleVisible) {
        triangleColor= vec4(1.0, 0.0, 0.0, 1.0);
    }
    else {
        triangleColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    if (isTriangleVisible) {
        gl.uniform1f(locTime, (Date.now() - iniTime) * 0.001);
        gl.uniform4fv(locColor,triangleColor);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    window.requestAnimFrame(render);
}
