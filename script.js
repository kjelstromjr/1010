let posX1 = 0, posY1 = 0, posX2 = 0, posY2 = 0;
let dropCount = 0;
let blocks = [{width: 84, height: 84, color: "green", amount: 4},
              {width: 174, height: 42, color: "rgb(197, 20, 20)", amount: 4},
              {width: 42, height: 42, color: "purple", amount: 1},
              {width: 84, height: 84, color: "rgb(15, 199, 199)", amount: 3}];

for (let i = 0; i < 100; i++) {
    document.getElementById("gameArea").innerHTML += "<div class='box'></div>";
}

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  let orgX = elmnt.offsetLeft;
  let orgY = elmnt.offsetTop;
  let move;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement(e) {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    
    let boxes = document.getElementsByClassName("box");
    let top = parseInt(elmnt.style.top);
    let left = parseInt(elmnt.style.left);

    let blockBoxes = elmnt.getElementsByClassName("box");
    let dropped = false;
    let droppedBoxes = [];

    for (let j = 0; j < blockBoxes.length; j++) {
      let x = elmnt.parentNode.offsetLeft + elmnt.offsetLeft + blockBoxes[j].offsetLeft + 20;
      let y = elmnt.parentNode.offsetTop + elmnt.offsetTop + blockBoxes[j].offsetTop + 20;

      for (let i = 0; i < boxes.length; i++) {
        if (x >= boxes[i].offsetLeft && x <= boxes[i].offsetLeft + 40 && y >= boxes[i].offsetTop && y <= boxes[i].offsetTop + 40) {
          if (boxes[i].style.backgroundColor !== "") {
            dropped = false;
            break;
          } else {
            droppedBoxes.push(i)
            dropped = true;
          }
        }
      }
      if (!dropped) {
        break;
      }
    }

    if (dropped && droppedBoxes.length === elmnt.getElementsByClassName("box").length) {
      for (let i = 0; i < droppedBoxes.length; i++) {
        boxes[droppedBoxes[i]].style.backgroundColor = elmnt.getElementsByClassName("box")[0].style.backgroundColor;
      }
      elmnt.remove();
      dropCount++;
      if (dropCount === 3) {
        displayNewBlocks();
        dropCount = 0;
      }
    } else {
      droppedBoxes = [];
      let move = window.setInterval(() => {
        //console.log("interval is running");
        if (elmnt.offsetLeft < orgX) {
          elmnt.style.left = elmnt.offsetLeft + 10 + "px";
          if (elmnt.offsetLeft > orgX) {
            elmnt.style.left = orgX + "px";
          }
        } else if (elmnt.offsetLeft > orgX) {
          elmnt.style.left = elmnt.offsetLeft - 10 + "px";
          if (elmnt.offsetLeft < orgX) {
            elmnt.style.left = orgX + "px";
          }
        }

        if (elmnt.offsetTop < orgY) {
          elmnt.style.top = elmnt.offsetTop + 10 + "px";
          if (elmnt.offsetTop > orgY) {
            elmnt.style.top = orgY + "px";
          }
        } else if (elmnt.offsetTop > orgY) {
          elmnt.style.top = elmnt.offsetTop - 10 + "px";
          if (elmnt.offsetTop < orgY) {
            elmnt.style.top = orgY + "px";
          }
        }

        if (elmnt.offsetLeft === orgX && elmnt.offsetTop === orgY) {
          window.clearInterval(move);
        }
      }, 1);
    }
  }
}

function updateCenterBlock() {
  document.getElementById("centerBlock").style.left = (document.getElementById("centerBlock").offsetLeft - (parseInt(document.getElementById("centerBlock").getElementsByClassName("block")[0].style.width) / 2)) + "px";
}

function generateBlock() {
  let block = blocks[Math.floor(Math.random() * blocks.length)];
  let html = `<div class="block" style="width: ${block.width}px; height: ${block.height}px;">`;
  for (let i = 0; i !== block.amount; i++) {
    html += `<div class="box" style="background-color: ${block.color};"></div>`;
  }
  html += `</div>`;
  return html;
}

function displayNewBlocks() {
  document.getElementById("leftBlock").innerHTML = generateBlock();
  document.getElementById("centerBlock").innerHTML = generateBlock();
  document.getElementById("rightBlock").innerHTML = generateBlock();
  // Make the DIV element draggable:
  for (let i = 0; i < document.getElementsByClassName("block").length; i++) {
    dragElement(document.getElementsByClassName("block")[i]);
  }
}

displayNewBlocks();
updateCenterBlock();