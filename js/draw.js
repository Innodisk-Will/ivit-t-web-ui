///////////////////////////////// DRAW RECTANGE /////////////////////////////////////
///////////////////////////////// DRAW RECTANGE /////////////////////////////////////
///////////////////////////////// DRAW RECTANGE /////////////////////////////////////

var RECTANGLES = [];

// Temp variables
let START_X = 0;
let START_Y = 0;

let MARQUEE_RECT= {
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
        // Update number of annotation 
        count_annotation(temp_value["class"]);
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
        rect.setAttribute('onmousedown', `mouse_down(evt,'rect')`);
    };

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
 
function mouse_down(evt, key){
    evt.preventDefault();

    CLICK=true;
    SLELCTED_ELEMENT = evt.target;
    CLICK_X = evt.offsetX; 
    CLICK_Y = evt.offsetY;

    // Choiced rectangle change style
    // console.log("SELECT ELEMENT:",SLELCTED_ELEMENT);
    if (key=="rect"){
        catch_rect();
        SLELCTED_DEL_ELEMENT = evt.target;
    }
    else{
        let id_list = $(SLELCTED_ELEMENT).attr("id").split("-");
        let rect_id = id_list[1];
        SLELCTED_DEL_ELEMENT = $(`#${rect_id}`);
    };
};
 
function catch_rect(){
    org_style = $(SLELCTED_ELEMENT).attr("style");
    if (!org_style.includes("stroke-dasharray")){
        $(SLELCTED_ELEMENT).attr("style",`${org_style} stroke-dasharray: 5px;`);
        // Append point
        let w = parseInt($(SLELCTED_ELEMENT).attr("width"));
        let h = parseInt($(SLELCTED_ELEMENT).attr("height"));
        let x = parseInt($(SLELCTED_ELEMENT).attr("x"));
        let y = parseInt($(SLELCTED_ELEMENT).attr("y"));
        let clr_list = org_style.split(";");
        let color = clr_list.find(element => element.includes("stroke:")).split(":")[1];
        let rect_num = $(SLELCTED_ELEMENT).attr("id");
        point_rect(x, y, w, h, color, rect_num);
    };
    // Change rect remove old style
    dasharray_list = Object.values($(`#boxes rect[style*='stroke-dasharray: 5px;']`));
    if (dasharray_list.includes(SLELCTED_ELEMENT) && dasharray_list.length > 3){
        let index = dasharray_list.indexOf(SLELCTED_ELEMENT);
        dasharray_list.splice(index, 1); 
        remove_dash(dasharray_list);
    };
    // Catch rectangle index
    rect_index(SLELCTED_ELEMENT);
};

function remove_dash(dasharray_list){
    // Change rect remove old style
    org_style = $(dasharray_list[0]).attr("style");
    org_style = org_style.split("stroke-dasharray: 5px;");
    $(dasharray_list[0]).attr("style",`${org_style[0]}`);
};

function rect_index(event){
    let needle ={
        x: parseFloat($(event).attr("x")), 
        y: parseFloat($(event).attr("y")),
        width: parseFloat($(event).attr("width")),
        height: parseFloat($(event).attr("height")),
    };
    // Catch rectangle index
    RECT_IDX = RECTANGLES.findIndex(object => {
                return ((object["x"] === needle["x"] && object["y"] === needle["y"]) && 
                (object["width"] === needle["width"] && object["height"] === needle["height"]));
                });
};

function move(evt){
    evt.preventDefault();
    if(CLICK){
        // Update values of rectangle in object
        if ($(SLELCTED_ELEMENT).is( "rect" )){
            move_rect(evt);
        }
        else if ($(SLELCTED_ELEMENT).is( "circle" )){
            move_point(evt, MOVE_X, MOVE_Y);
        };
        // Update new position
        CLICK_X = evt.offsetX; 
        CLICK_Y = evt.offsetY;
    };
};
 
function move_rect(evt){
    // Move rect
    MOVE_X = parseInt(SLELCTED_ELEMENT.getAttribute("x")) + ( evt.offsetX - CLICK_X );
    MOVE_Y = parseInt(SLELCTED_ELEMENT.getAttribute("y")) + ( evt.offsetY - CLICK_Y );
    SLELCTED_ELEMENT.setAttribute("x", MOVE_X);
    SLELCTED_ELEMENT.setAttribute("y", MOVE_Y);
    RECTANGLES[RECT_IDX]["x"] = MOVE_X
    RECTANGLES[RECT_IDX]["y"] = MOVE_Y

    // Move point
    org_style = $(SLELCTED_ELEMENT).attr("style");
    let w = parseInt($(SLELCTED_ELEMENT).attr("width"));
    let h = parseInt($(SLELCTED_ELEMENT).attr("height"));
    let clr_list = org_style.split(";");
    let color = clr_list.find(element => element.includes("stroke:")).split(":")[1];
    let rect_num = $(SLELCTED_ELEMENT).attr("id");
    point_rect(RECTANGLES[RECT_IDX]["x"], RECTANGLES[RECT_IDX]["y"], w, h, color, rect_num);
    // console.log("MOVE SLELCTED_ELEMENT:",SLELCTED_ELEMENT)
};

function move_point(evt, MOVE_X, MOVE_Y){
    // Move point
    MOVE_X = parseInt(SLELCTED_ELEMENT.getAttribute("cx")) + ( evt.offsetX - CLICK_X );
    MOVE_Y = parseInt(SLELCTED_ELEMENT.getAttribute("cy")) + ( evt.offsetY - CLICK_Y );
    SLELCTED_ELEMENT.setAttribute("cx", MOVE_X);
    SLELCTED_ELEMENT.setAttribute("cy", MOVE_Y);
    // Move rect
    let id_list = $(SLELCTED_ELEMENT).attr("id").split("-");
    rect_size(id_list, MOVE_X, MOVE_Y);
    
};

function end_move(evt){
    if(evt.type == 'mouseout' && CLICK) {
        return;
    }
    CLICK=false;
    // elementWithFocus = null;
};

///////////////////////////////// CHANGE RECTANGE SIZE /////////////////////////////////////
///////////////////////////////// CHANGE RECTANGE SIZE /////////////////////////////////////
///////////////////////////////// CHANGE RECTANGE SIZE /////////////////////////////////////

function point_rect(x, y, w, h, color, rect_num){
    let point_list = [[x,y,"nwse-resize"],[x,y+h, "nesw-resize"],[x+w,y, "nesw-resize"],[x+w,y+h, "nwse-resize"]];
    if ($(`#draw circle`).length>=4){
        $(`circle`).remove();
    };

    if ($(`#draw circle`).length==0){
        // Append to point in panel
        for (let po of point_list){
            cir_num = point_list.indexOf(po);
            $("#draw").append(circle_html(po[0], po[1], color, po[2], rect_num, cir_num));
        };
    };
};

function circle_html(xaxis, yaxis, color, cursor, rect_num, cir_num){
    let point = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    point.setAttribute('cx', xaxis);
    point.setAttribute('cy', yaxis);
    point.setAttribute('r', "5");
    point.setAttribute('style', `opacity: 1; fill: ${color}; stroke: #fff; cursor: ${cursor};`);
    point.setAttribute('onmousedown', `mouse_down(evt,"cir")`);
    point.setAttribute('id', `point-${rect_num}-${cir_num}`);
    return point;
};

function rect_size(id_list, MOVE_X, MOVE_Y){
    let num = id_list[2]
    let rect_id = id_list[1];
    // Catch rectangle index
    rect_index($(`#${rect_id}`));
    let org_w = parseInt($(`#${rect_id}`).attr("width"));
    let org_h = parseInt($(`#${rect_id}`).attr("height"));
    let org_x = parseInt($(`#${rect_id}`).attr("x"));
    let org_y = parseInt($(`#${rect_id}`).attr("y"));

    // w,h,x,y
    let cn_list = [0, 0, 0, 0]
    if (num == "0"){
        cn_list = [org_w + (org_x - MOVE_X),
                    org_h + (org_y - MOVE_Y),
                    MOVE_X, MOVE_Y];
    }
    else if (num == "1"){
        cn_list = [org_w + (org_x - MOVE_X), 
                    MOVE_Y-org_y,
                    MOVE_X, org_y];
    }
    else if (num == "2"){
        cn_list = [MOVE_X-org_x,
            org_h + (org_y - MOVE_Y),
            org_x, MOVE_Y];
    }
    else if (num == "3"){
        cn_list = [MOVE_X-org_x,
            MOVE_Y-org_y,
            org_x, org_y];
    };

    // Move 4 point
    org_style = $(`#${rect_id}`).attr("style");
    let clr_list = org_style.split(";");
    let color = clr_list.find(element => element.includes("stroke:")).split(":")[1];
    let rect_num = $(`#${rect_id}`).attr("id");
    point_rect(cn_list[2], cn_list[3], cn_list[0], cn_list[1], color, rect_num);

    point_list = $(`#draw circle`)
    axis_list = [[],[]]
    for (let idx of point_list){
        axis_list[0].push(parseInt($(idx).attr("cx")))
        axis_list[1].push(parseInt($(idx).attr("cy")))
    };

    if (cn_list[0] <= 0 | cn_list[1] <= 0){
        // console.log(axis_list)
        cn_list = new_rect(axis_list)
        // console.log(cn_list)
    };

    // Change rect
    $(`#${rect_id}`).attr("width",  cn_list[0]);
    $(`#${rect_id}`).attr("height", cn_list[1]);
    $(`#${rect_id}`).attr("x", cn_list[2]);
    $(`#${rect_id}`).attr("y", cn_list[3]);
    // Upload value of rect in object
    RECTANGLES[RECT_IDX]["width"] = cn_list[0];
    RECTANGLES[RECT_IDX]["height"] = cn_list[1];
    RECTANGLES[RECT_IDX]["x"] = cn_list[2];
    RECTANGLES[RECT_IDX]["y"] = cn_list[3];

};

function new_rect(axis_list){
    let min = [ Math.min.apply(null, axis_list[0]), Math.min.apply(null, axis_list[1]) ]
    let max = [ Math.max.apply(null, axis_list[0]), Math.max.apply(null, axis_list[1]) ]
    // console.log(min, max)
    return [parseInt(max[0]-min[0]), parseInt(max[1]-min[1]), parseInt(min[0]), parseInt(min[1])]
};