///////////////////////////////// DRAW RECTANGE /////////////////////////////////////
///////////////////////////////// DRAW RECTANGE /////////////////////////////////////
///////////////////////////////// DRAW RECTANGE /////////////////////////////////////

var RECTANGLES = [];
var POINTCOLOR = {};

// Temp variables
let START_X = 0;
let START_Y = 0;

const MARQUEE_RECT= {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
};

// Start drag
function start_drag(ev) {
    // middle button delete rect
    if (ev.button === 1) {
        const rect = hit_test(ev.layerX, ev.layerY);
        if (rect) {
            RECTANGLES.splice(RECTANGLES.indexOf(rect), 1);
            redraw();
        }

        return;
    }
    window.addEventListener('pointerup', stop_drag);
    document.getElementById("large_img").addEventListener('pointermove', move_drag);
    document.getElementById("rect_marquee").classList.remove('hide');
    START_X = ev.layerX;
    START_Y = ev.layerY;
    draw_rect(document.getElementById("rect_marquee"), { x:START_X, y:START_Y, width:0, height:0});
};

// Stop drag
function stop_drag(ev) {
    document.getElementById("rect_marquee").classList.add('hide');
    window.removeEventListener('pointerup', stop_drag);
    document.getElementById("large_img").removeEventListener('pointermove', move_drag);

    // Give new rectangle color
    if (ev.target === document.getElementById("large_img") && MARQUEE_RECT.width && MARQUEE_RECT.height) {
        let lastKey = Object.keys(POINTCOLOR).pop();
        let temp_value = Object.assign({}, MARQUEE_RECT)
        temp_value["color"]=POINTCOLOR[lastKey]
        temp_value["class"]=lastKey   
        RECTANGLES.push(temp_value);
        redraw();
    };
};

// Move drag
function move_drag(ev) {
    let x = ev.layerX;
    let y = ev.layerY;
    let width = START_X - x;
    let height = START_Y - y;
    if (width < 0) {
        width *= -1;
        x -= width;
    };
    if (height < 0) {
        height *= -1;
        y -= height;
    };
    // console.log(Object.assign(MARQUEE_RECT, {x, y, width, height}))
    Object.assign(MARQUEE_RECT, {x, y, width, height});
    draw_rect(document.getElementById("rect_marquee"), MARQUEE_RECT);
};

function hit_test(x, y) {
    return RECTANGLES.find(rect => (
    x >= rect.x &&
    y >= rect.y && 
    x <= rect.x + rect.width &&
    y <= rect.y + rect.height
));
};

function redraw() {
    // console.log("76:test")
    let boxes = document.getElementById("boxes")
    boxes.innerHTML = '';
    RECTANGLES.forEach((data) => {
        // console.log("79:",data)
        boxes.appendChild(draw_rect(
            document.createElementNS("http://www.w3.org/2000/svg", 'rect'), data
    ));
});
};

function draw_rect(rect, data) {
    const { x, y, width, height } = data;
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    if ("color" in data){
        let color = data["color"]

        idx = RECTANGLES.findIndex(object => {
            return ((object["x"] === data["x"] && object["y"] === data["y"]) && 
                (object["width"] === data["width"] && object["height"] === data["height"]));
        });

        rect.setAttribute('style', `stroke:${color}; fill:transparent; stroke-width: 3px;`);

        rect.setAttribute('id', `${data["class"]}_${idx}`);
        rect.setAttribute('onmousedown', `mouse_down(evt)`);
    }

    return rect;
};

///////////////////////////////// CONVERT /////////////////////////////////////
///////////////////////////////// CONVERT /////////////////////////////////////
///////////////////////////////// CONVERT /////////////////////////////////////

// Number to hex
function component2hex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
};

// COLOR RGB to hex
function rgb2hex(r, g, b) {
    return "#" + component2hex(r) + component2hex(g) + component2hex(b);
};

// function hexToRgb(hex) {
//     var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//     return result ? {
//     r: parseInt(result[1], 16),
//     g: parseInt(result[2], 16),
//     b: parseInt(result[3], 16)
//     } : null;
// };
 
///////////////////////////////// MOVE RECTANGE /////////////////////////////////////
///////////////////////////////// MOVE RECTANGE /////////////////////////////////////
///////////////////////////////// MOVE RECTANGE /////////////////////////////////////

var CLICK=false; // flag to indicate when shape has been clicked
var CLICK_X, CLICK_Y; // stores cursor location upon first click
var MOVE_X=0, MOVE_Y=0; // keeps track of overall transformation
// var LASTMOVE_X=0, LASTMOVE_Y=0; // stores previous transformation (move)
var RECT_IDX = 0;

var SLELCTED_ELEMENT = null;
var SLELCTED_DEL_ELEMENT = null;
 
function mouse_down(evt){
    evt.preventDefault();

    CLICK=true;
    SLELCTED_ELEMENT = evt.target;
    SLELCTED_DEL_ELEMENT = evt.target;
    CLICK_X = evt.offsetX; 
    CLICK_Y = evt.offsetY;

    // console.log("SELECT ELEMENT:",SLELCTED_ELEMENT)

    let needle ={
                    x: parseFloat($(SLELCTED_ELEMENT).attr("x")), 
                    y: parseFloat($(SLELCTED_ELEMENT).attr("y")),
                    width: parseFloat($(SLELCTED_ELEMENT).attr("width")),
                    height: parseFloat($(SLELCTED_ELEMENT).attr("height")),
                }
    
    // console.log(needle)
    idx = RECTANGLES.findIndex(object => {
        return ((object["x"] === needle["x"] && object["y"] === needle["y"]) && 
            (object["width"] === needle["width"] && object["height"] === needle["height"]));
    });
};
 
function move(evt){
    evt.preventDefault();
    if(CLICK){
        // console.log(evt)
        MOVE_X = parseInt(SLELCTED_ELEMENT.getAttribute("x")) + ( evt.offsetX - CLICK_X );
        MOVE_Y = parseInt(SLELCTED_ELEMENT.getAttribute("y")) + ( evt.offsetY - CLICK_Y );
        CLICK_X = evt.offsetX; 
        CLICK_Y = evt.offsetY;
        SLELCTED_ELEMENT.setAttribute("x", MOVE_X);
        SLELCTED_ELEMENT.setAttribute("y", MOVE_Y);
        RECTANGLES[RECT_IDX]["x"] = MOVE_X
        RECTANGLES[RECT_IDX]["y"] = MOVE_Y
        // console.log("MOVE SLELCTED_ELEMENT:",SLELCTED_ELEMENT)
    };
};
 
function end_move(evt){
    if(evt.type == 'mouseout' && CLICK) {
        return;
    }
    CLICK=false;
    // elementWithFocus = null;
};