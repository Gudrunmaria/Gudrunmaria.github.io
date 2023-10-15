var canvas;
var gl;

var NumVertices  = 9;
var NumBody = 6;
var NumTail = 3;
var Numfinn = 3;

//kassinn sem fiskarnir eiga að vera í 
var kassiMinX = -0.8;
var kassiMaX = 0.8;
var kassiMinY = -0.8;
var kassiMaY = 0.8;
var kassiMinZ = -0.8;
var kassiMaZ = 0.8;

// Hn�tar fisks � xy-planinu
var vertices = [
    // l�kami (spjald)
    vec4( -0.5,  0.0, 0.0, 1.0 ),
	vec4(  0.2,  0.2, 0.0, 1.0 ),
	vec4(  0.5,  0.0, 0.0, 1.0 ),
	vec4(  0.5,  0.0, 0.0, 1.0 ),
	vec4(  0.2, -0.15, 0.0, 1.0 ),
	vec4( -0.5,  0.0, 0.0, 1.0 ),
	// spor�ur (�r�hyrningur)
    vec4( -0.5,  0.0, 0.0, 1.0 ),
    vec4( -0.65,  0.15, 0.0, 1.0 ),
    vec4( -0.65, -0.15, 0.0, 1.0 ),

    //Uggi 1
    vec4(0.0,0.05,0.1,1.0),
    vec4(0.1,0.1,0.0,1.0),
    vec4(0.1,-0.05,0.0,1.0),
    
    //Uggi 2
    vec4(0.0,0.05,-0.1,1.0),
    vec4(0.1,0.1,0.0,1.0),
    vec4(0.1,-0.05,0.0,1.0)
];

//litir á fiskunum
var litir =[
    vec4(0.2, 0.6, 0.9, 1.0),
    vec4(0.3, 0.3, 0.6, 1.0),
    vec4(0.3,0.7,0.7,1.0),
    vec4(0.2,0.5,0.7,1.0),
    vec4(0.5,0.4,0.7,1.0),
    vec4(0.5,0.87,0.57,1.0),
    vec4(0.17,0.8,0.58,1.0),
    vec4(0.9,0.4,0.57,1.0),
    vec4(0.75,0.54,0.82,1.0),
    vec4(0.54,0.54,0.83,1.0),
    vec4(0.12,0.9,0.5,1.0)
];

//upphafleg staðsetning fiskana
var upphaf = [
    0.0, 0.6, 0.3,
    0.4, 0.7, 0.2,
    -0.6, 0.3, -0.2,
    -0.7, -0.3, -0.4,
    0.6, 0.1, -0.6,
    -0.3, -0.6, 0.6,
    0.4, -0.5, 0.5,
    -0.2, -0.2, -0.2,
    0.5, -0.6, -0.6,
    0.2, 0.5, -0.6
];

var movement = false;     // Er m�sarhnappur ni�ri?
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var rotTail = 0.0;        // Sn�ningshorn spor�s
var incTail = 0.5;        // Breyting � sn�ningshorni

var rotFinn =0.0;          
var incFinn =0.3;

var zView = 4.0;          // Sta�setning �horfanda � z-hniti

var proLoc;
var mvLoc;
var colorLoc;


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.95, 1.0, 1.0, 1.0 );
 
    gl.enable(gl.DEPTH_TEST);
 
    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    colorLoc = gl.getUniformLocation( program, "fColor" );

    proLoc = gl.getUniformLocation( program, "projection" );
    mvLoc = gl.getUniformLocation( program, "modelview" );

    // Setjum ofanvarpsfylki h�r � upphafi
    var proj = perspective( 90.0, 1.0, 0.1, 100.0 );
    gl.uniformMatrix4fv(proLoc, false, flatten(proj));
    

    // Atbur�af�ll fyrir m�s
    canvas.addEventListener("mousedown", function(e){
        movement = true;
        origX = e.offsetX;
        origY = e.offsetY;
        e.preventDefault();         // Disable drag and drop
    } );

    canvas.addEventListener("mouseup", function(e){
        movement = false;
    } );

    canvas.addEventListener("mousemove", function(e){
        if(movement) {
    	    spinY += (e.offsetX - origX) % 360;
            spinX += (e.offsetY - origY) % 360;
            origX = e.offsetX;
            origY = e.offsetY;
        }
    } );
    
    // Atbur�afall fyrir lyklabor�
     window.addEventListener("keydown", function(e){
         switch( e.keyCode ) {
            case 38:	// upp �r
                zView += 0.2;
                break;
            case 40:	// ni�ur �r
                zView -= 0.2;
                break;
         }
     }  );  

    // Atbur�afall fyri m�sarhj�l
     window.addEventListener("mousewheel", function(e){
         if( e.wheelDelta > 0.0 ) {
             zView += 0.2;
         } else {
             zView -= 0.2;
         }
     }  );  

    render();
}

function fiskur(mv,x,y,z,litur,lituru){
    gl.uniform4fv(colorLoc,litur);

    rotTail += incTail;
    if( rotTail > 35.0  || rotTail < -35.0 )
        incTail *= -1;


    rotFinn += incFinn;
    if(rotFinn >30.0 || rotFinn < -35.0)
        incFinn *=-1;
        

    //Teikna búk
    mv = mult(mv,translate(x,y,z));

    var mv1 =mv;

    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, 0, NumBody );

    //Teikna sporð og snúa honum
    mv = mult( mv, translate ( -0.5, 0.0, 0.0 ) );
    mv = mult( mv, rotateY( rotTail ) );
	mv = mult( mv, translate ( 0.5, 0.0, 0.0 ) );
	
    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, NumBody, NumTail );

    gl.uniform4fv(colorLoc,lituru);
    //Teikna ugga1
    mv =mult(mv1, translate(0.0,0.0,0.0));
    mv =mult(mv, rotateY(rotFinn));
  
    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays(gl.TRIANGLES, NumBody+NumTail,Numfinn);

    //Teikna ugga2
    mv =mult(mv1, translate(0.0,0.0,0.0));
    mv =mult(mv, rotateY(rotFinn));

    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays(gl.TRIANGLES, NumBody+NumTail+Numfinn,Numfinn);

}


function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var mv = lookAt( vec3(0.0, 0.0, zView), vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0) );
    mv = mult( mv, rotateX(spinX) );
    mv = mult( mv, rotateY(spinY) );

    for(let i =0; i <10;i++) {
        const startIndex =i*3;
       
        fiskur(mv,upphaf[startIndex],upphaf[1+startIndex],upphaf[2+startIndex],litir[i],litir[1+i]);
        
    }
    
    requestAnimFrame( render );
}

