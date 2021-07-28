import React, { Component } from "react";
import * as actions from "../../actions/messaging";

const socket = actions.socket;

class SessionWhiteboard extends Component {
  constructor(props) {
    super(props);

    /*WhiteBoard code start here*/
    document.addEventListener("DOMContentLoaded", function () {
      var mouse = {
        click: false,
        move: false,
        pos: { x: 0, y: 0 },
        pos_prev: false,
      };

      // get canvas element and create context
      var canvas = document.getElementById("drawing");
      var context = canvas.getContext("2d");

      //var canvas_wrapper = document.getElementById('canvas-wrapper');

      var width = window.$("#canvas-wrapper").innerWidth() - 50;
      var height = 500;

      console.log(
        "*** canvas_wrapper.offsetWidth *** " + width + " " + window.innerWidth
      );

      var lineWidth = 1;
      var strokeStyle = "#000000";
      var eraserSize = 8;
      var eraserIcon = "/img/eraser-normal.png";

      var toolMode = "pen";

      // set canvas to full browser width/height
      canvas.width = width;
      canvas.height = height;

      var pen = document.getElementById("pen-tool"); // get pen element by id
      var eraser = document.getElementById("eraser-tool"); // get eraser element by id
      var clearBoard = document.getElementById("clearBoard"); // get eraser element by id

      pen.onclick = function () {
        toolMode = "pen";
        canvas.style.cursor = 'url("pencil.png"), auto';
      };

      eraser.onclick = function () {
        toolMode = "eraser";
        canvas.style.cursor = 'url("' + eraserIcon + '"), auto';
      };

      clearBoard.onclick = function () {
        toolMode = "clearboard";
        socket.emit("draw_line", {
          line: [
            mouse.pos,
            mouse.pos_prev,
            toolMode,
            lineWidth,
            strokeStyle,
            eraserSize,
          ],
        });
      };

      // register mouse event handlers
      canvas.onmousedown = function (e) {
        mouse.click = true;
        context.lineWidth = 2;
        context.lineJoin = context.lineCap = "round";
        context.shadowColor = "rgb(0, 0, 0)";
        mainLoop();
      };
      canvas.onmouseup = function (e) {
        mouse.click = false;
      };

      canvas.onmousemove = function (e) {
        var offset = window.$(this).offset();
        mouse.pos.x = e.pageX - offset.left;
        mouse.pos.y = e.pageY - offset.top;
        mouse.move = true;
        mainLoop();
      };

      // draw line received from server
      socket.on("draw_line", function (data) {
        var line = data.line;
        context.beginPath();

        if (line[2] === "pen") {
          // draw pen tool
          context.globalCompositeOperation = "source-over";

          context.moveTo(line[0].x, line[0].y);
          context.lineTo(line[1].x, line[1].y);

          context.lineWidth = line[3];
          context.strokeStyle = line[4];
          context.stroke();
        } else if (line[2] === "eraser") {
          // draw eraser tool
          context.globalCompositeOperation = "destination-out";
          context.rect(line[0].x, line[0].y, line[5], line[5]);
          context.fill();
        } else {
          context.clearRect(0, 0, canvas.width, canvas.height);
        }
      });

      window.$(".pen-thickness-wrapper li a").on("click", function () {
        // get pen thickness
        var thickness = window.$(this).data("thick");
        thickness = parseInt(thickness);
        lineWidth = thickness;
      });

      window.$(".pen-color-wrapper li a").on("click", function () {
        // get pen color
        var color = window.$(this).data("color");
        strokeStyle = color;
      });

      window.$(".eraser-size-wrapper li a").on("click", function () {
        // get eraser size

        if (toolMode === "eraser") {
          var size = window.$(this).data("size");
          var sizeName = window.$(this).data("size-name");
          size = parseInt(size);
          eraserSize = size;
          eraserIcon = sizeName + ".png";
          canvas.style.cursor =
            'url("/img/' + eraserIcon + '"), auto';
        }
      });

      /**** Download canvas image *******/
      function downloadCanvas(link, canvasId, filename) {
        link.href = document.getElementById(canvasId).toDataURL();
        link.download = filename;
      }

      document.getElementById("download-canvas").addEventListener(
        "click",
        function () {
          downloadCanvas(this, "drawing", "screenshot-" + Date.now() + ".png");
        },
        false
      );

      // main loop, running every 25ms
      function mainLoop() {
        // check if the user is drawing
        if (mouse.click && mouse.move && mouse.pos_prev) {
          // send line to the server
          socket.emit("draw_line", {
            line: [
              mouse.pos,
              mouse.pos_prev,
              toolMode,
              lineWidth,
              strokeStyle,
              eraserSize,
            ],
          });
          mouse.move = false;
        }
        mouse.pos_prev = { x: mouse.pos.x, y: mouse.pos.y };
        setTimeout(mainLoop, 25);
      }
      //mainLoop();
    });
    /*WhiteBoard code end here*/
  }

  render() {
    return (
      <div className="WhiteBoard_Main_section">
        <div className="Conversation">
          <h6>White Board</h6>
          <a href="#!" className="whiteBoard_close">
            <i className="fa fa-times" aria-hidden="true"></i>
          </a>
          <div className="dropdown-wrapper">
            <div className="dropdown dropdown_Thickness">
              <a
                className="dropdown-toggle"
                title="Pen Thickness"
                href="#!"
                data-toggle="dropdown"
                aria-expanded="false"
                rel="noreferrer"
              >
                <img
                  height="20"
                  width="30"
                  src="/img/penthickness.png"
                  alt=""
                />
              </a>
              <ul
                className="dropdown-menu pen-thickness-wrapper"
                aria-labelledby="dropdownMenu2"
              >
                <li>
                  <a data-thick="1" href="#!">
                    Normal
                  </a>
                </li>
                <li>
                  <a data-thick="3" href="#!">
                    Bold
                  </a>
                </li>
                <li>
                  <a data-thick="5" href="#!">
                    Bolder
                  </a>
                </li>
              </ul>
            </div>
            <div className="dropdown dropdown_Color">
              <a
                className="dropdown-toggle"
                data-toggle="dropdown"
                title="Pen Color"
                href="#!"
                aria-expanded="false"
              >
                <img height="20" src="/img/pencolor.png" alt="" />
              </a>
              <ul className="dropdown-menu pen-color-wrapper">
                <li>
                  <a data-color="#000000" href="#!">
                    Black
                  </a>
                </li>
                <li>
                  <a data-color="#FF0000" href="#!">
                    Red
                  </a>
                </li>
                <li>
                  <a data-color="#009933" href="#!">
                    Green
                  </a>
                </li>
                <li>
                  <a data-color="#0000CC" href="#!">
                    Blue
                  </a>
                </li>
                <li>
                  <a data-color="#FFFF0A" href="#!">
                    Yellow
                  </a>
                </li>
              </ul>
            </div>
            <div className="dropdown dropdown_Eraser">
              <a
                className="dropdown-toggle"
                title="Eraser Size"
                href="#!"
                data-toggle="dropdown"
                aria-expanded="false"
                rel="noreferrer"
              >
                <img src="/img/erasersize.png" alt="" />
              </a>
              <ul className="dropdown-menu eraser-size-wrapper">
                <li>
                  <a
                    data-size="8"
                    data-size-name="eraser-normal"
                    href="#!"
                  >
                    Normal
                  </a>
                </li>
                <li>
                  <a
                    data-size="12"
                    data-size-name="eraser-wide"
                    href="#!"
                  >
                    Wide
                  </a>
                </li>
                <li>
                  <a
                    data-size="16"
                    data-size-name="eraser-wider"
                    href="#!"
                  >
                    Wider
                  </a>
                </li>
              </ul>
            </div>
            <div className="dropdown dropdown_Download">
              <a
                id="download-canvas"
                title="Download Screenshot"
                href="#!"
              >
                <img
                  height="20"
                  src="/img/cloud-computing.png"
                  alt=""
                />
              </a>
            </div>
          </div>
          <div id="canvas-wrapper" className="col-md-12">
            <canvas id="drawing"></canvas>
            <div className="canvas-tools">
              <div className="Pen_Tools">
                <a
                  data-toggle="tooltip"
                  className="active"
                  title="Pen"
                  id="pen-tool"
                  href="#!"
                >
                  <img src="/img/pen.png" alt="" />
                </a>
              </div>
              <div className="Erazer_Tools">
                <a
                  data-toggle="tooltip"
                  title="Erazer"
                  id="eraser-tool"
                  href="#!"
                >
                  <img src="/img/eraser.png" alt="" />
                </a>
              </div>
              <div className="Clear_Tools">
                <a
                  data-toggle="tooltip"
                  title="Clear Board"
                  id="clearBoard"
                  href="#!"
                >
                  <i className="fa fa-window-close" aria-hidden="true"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SessionWhiteboard;
