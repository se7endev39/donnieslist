import React, { Component } from 'react';
import * as actions from '../../actions/messaging';
const socket = actions.socket;

class SessionWhiteboard extends Component {
  constructor(props) {
    super(props);

    /*WhiteBoard code start here*/
    document.addEventListener("DOMContentLoaded", function() {
       var mouse = {
          click: false,
          move: false,
          pos: {x:0, y:0},
          pos_prev: false
       };

       // get canvas element and create context
       var canvas  = document.getElementById('drawing');
       var context = canvas.getContext('2d');

       //var canvas_wrapper = document.getElementById('canvas-wrapper');

       var width   = $('#canvas-wrapper').innerWidth() - 50;
       var height  = 500;

       console.log('*** canvas_wrapper.offsetWidth *** '+width + ' ' + window.innerWidth);

       var lineWidth = 1;
       var strokeStyle = '#000000';
       var eraserSize = 8;
       var eraserIcon = '/src/public/img/eraser-normal.png';

       var toolMode = 'pen';

       // set canvas to full browser width/height
       canvas.width = width;
       canvas.height = height;

       var pen  = document.getElementById('pen-tool'); // get pen element by id
       var eraser = document.getElementById('eraser-tool'); // get eraser element by id
       var clearBoard = document.getElementById('clearBoard'); // get eraser element by id

       pen.onclick = function(){
          toolMode = 'pen';
          canvas.style.cursor = 'url("pencil.png"), auto';
       };

       eraser.onclick = function(){
          toolMode = 'eraser';
          canvas.style.cursor = 'url("'+eraserIcon+'"), auto';
       };

       clearBoard.onclick = function(){
          toolMode = 'clearboard';
          socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev, toolMode, lineWidth, strokeStyle, eraserSize ] });
       };

       // register mouse event handlers
       canvas.onmousedown = function(e){
         mouse.click = true;
         context.lineWidth = 2;
         context.lineJoin = context.lineCap = 'round';
         context.shadowColor = 'rgb(0, 0, 0)';
         mainLoop();
       };
       canvas.onmouseup = function(e){ mouse.click = false; };

       canvas.onmousemove = function(e) {
          var offset = $(this).offset();
          mouse.pos.x = e.pageX- offset.left;
          mouse.pos.y = e.pageY- offset.top;
          mouse.move = true;
          mainLoop();
       };

       // draw line received from server
    	socket.on('draw_line', function (data) {
          var line = data.line;
          context.beginPath();

          if(line[2] == 'pen'){ // draw pen tool
             context.globalCompositeOperation="source-over";

             context.moveTo(line[0].x, line[0].y);
             context.lineTo(line[1].x, line[1].y);

              context.lineWidth = line[3];
              context.strokeStyle = line[4];
             context.stroke();
          } else if(line[2] == 'eraser') { // draw eraser tool
              context.globalCompositeOperation="destination-out";
              context.rect(line[0].x, line[0].y, line[5], line[5]);
              context.fill();
          }else{
            context.clearRect(0, 0, canvas.width, canvas.height);
          }
       });

      $('.pen-thickness-wrapper li a').on('click', function(){ // get pen thickness
        var thickness = $(this).data('thick');
        thickness = parseInt(thickness);
        lineWidth = thickness;
     });

     $('.pen-color-wrapper li a').on('click', function(){ // get pen color
        var color = $(this).data('color');
        strokeStyle = color;
     });

     $('.eraser-size-wrapper li a').on('click', function(){ // get eraser size

        if(toolMode == 'eraser'){
           var size = $(this).data('size');
           var sizeName = $(this).data('size-name');
           size = parseInt(size);
           eraserSize = size;
           eraserIcon = sizeName + '.png';
           canvas.style.cursor = 'url("/src/public/img/'+eraserIcon+'"), auto';
        }
     });


     /**** Download canvas image *******/
     function downloadCanvas(link, canvasId, filename) {
          link.href = document.getElementById(canvasId).toDataURL();
          link.download = filename;
      }

      document.getElementById('download-canvas').addEventListener('click', function() {
          downloadCanvas(this, 'drawing', 'screenshot-'+Date.now()+'.png');
      }, false);


       // main loop, running every 25ms
       function mainLoop() {
          // check if the user is drawing
          if (mouse.click && mouse.move && mouse.pos_prev) {
             // send line to the server
             socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev, toolMode, lineWidth, strokeStyle, eraserSize ] });
             mouse.move = false;
          }
          mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
          setTimeout(mainLoop, 25);
       }
       //mainLoop();
    });
    /*WhiteBoard code end here*/
  }

  render(){
    return (
      <div className="WhiteBoard_Main_section">
            <div className="Conversation">
              <h6>White Board</h6>
              <a href="javascript:void()" className="whiteBoard_close">
                <i className="fa fa-times" aria-hidden="true"></i>
              </a>
              <div className="dropdown-wrapper">
                <div className="dropdown dropdown_Thickness">
                     <a  className="dropdown-toggle" title="Pen Thickness" href="javascript:void(0)" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <img height="20" width="30" src="/src/public/img/penthickness.png"/>
                     </a>
                     <ul className="dropdown-menu pen-thickness-wrapper" aria-labelledby="dropdownMenu2">
                       <li><a data-thick="1" href="javascript:void(0)">Normal</a></li>
                         <li><a data-thick="3" href="javascript:void(0)">Bold</a></li>
                         <li><a data-thick="5" href="javascript:void(0)">Bolder</a></li>
                     </ul>
                 </div>
                 <div className="dropdown dropdown_Color">
                   <a className="dropdown-toggle" data-toggle="dropdown" title="Pen Color" href="javascript:void(0)" aria-haspopup="true" aria-expanded="false">
                     <img height="20" src="/src/public/img/pencolor.png"/>
                   </a>
                   <ul className="dropdown-menu pen-color-wrapper">
                       <li><a data-color="#000000" href="javascript:void(0)">Black</a></li>
                       <li><a data-color="#FF0000" href="javascript:void(0)">Red</a></li>
                       <li><a data-color="#009933" href="javascript:void(0)">Green</a></li>
                       <li><a data-color="#0000CC" href="javascript:void(0)">Blue</a></li>
                       <li><a data-color="#FFFF0A" href="javascript:void(0)">Yellow</a></li>
                    </ul>
                 </div>
                 <div className="dropdown dropdown_Eraser">
                    <a className="dropdown-toggle" title="Eraser Size" href="javascript:void(0)"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <img src="/src/public/img/erasersize.png"/>
                    </a>
                    <ul className="dropdown-menu eraser-size-wrapper">
                        <li><a data-size="8" data-size-name="eraser-normal" href="javascript:void(0)">Normal</a></li>
                        <li><a data-size="12" data-size-name="eraser-wide" href="javascript:void(0)">Wide</a></li>
                        <li><a data-size="16" data-size-name="eraser-wider" href="javascript:void(0)">Wider</a></li>
                     </ul>
                  </div>
                  <div className="dropdown dropdown_Download">
                   <a id="download-canvas" title="Download Screenshot" href="javascript:void(0)" >
                     <img height="20" src="/src/public/img/cloud-computing.png"/>
                   </a>
                  </div>
               </div>
              <div id="canvas-wrapper" className="col-md-12">
                <canvas id="drawing"></canvas>
                <div className="canvas-tools">
                  <div className="Pen_Tools">
                      <a data-toggle="tooltip" className="active" title="Pen" id="pen-tool" href="javascript:void(0)">
                        <img src="/src/public/img/pen.png"/>
                      </a>
                  </div>
                  <div className="Erazer_Tools">
                      <a data-toggle="tooltip" title="Erazer" id="eraser-tool" href="javascript:void(0)">
                        <img src="/src/public/img/eraser.png"/>
                      </a>
                  </div>
                  <div className="Clear_Tools">
                      <a data-toggle="tooltip" title="Clear Board" id="clearBoard" href="javascript:void(0)"><i className="fa fa-window-close" aria-hidden="true"></i></a>
                  </div>
                </div>
              </div>
           </div>
       </div>
    );
  }
}

export default SessionWhiteboard;
