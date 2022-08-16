///////////////////////////////// INITIAL DRAW BOX /////////////////////////////////////
///////////////////////////////// INITIAL DRAW BOX /////////////////////////////////////
///////////////////////////////// INITIAL DRAW BOX /////////////////////////////////////

// Intial to draw box
function init_draw_box(bbox){
    let x_rate = IMAGE_SIZE["small_panel"][0]/IMAGE_SIZE["org"][1]
    let y_rate = IMAGE_SIZE["small_panel"][1]/IMAGE_SIZE["org"][0]

    // For loop to bbox list
    for (let index in bbox){
        // Get box
        let box = bbox[index]["bbox"]
        // Get class index in all_class
        let cls_idx = parseInt(bbox[index]["class_id"])+1;
        // Convert color
        let color = rgb2hex(COLOR_BAR[cls_idx][2], 
                            COLOR_BAR[cls_idx][1], 
                            COLOR_BAR[cls_idx][0]);
        // Create bbox Object
        let bbox_obj = {
                        x: box[0]*x_rate,
                        y: box[1]*y_rate,
                        width: (box[2]*x_rate)-(box[0]*x_rate),
                        height: (box[3]*y_rate)-(box[1]*y_rate),
                        "class":bbox[index]["class_name"],
                        "color":color,
                    };
        // Check obj is not repeat that in list
        // If is not exist, then create
        if (RECTANGLES.indexOf(bbox_obj) === -1){
            RECTANGLES.push(bbox_obj);
            // Draw box
            redraw();
        };
    };
};

///////////////////////////////// EVALUATE /////////////////////////////////////
///////////////////////////////// EVALUATE /////////////////////////////////////
///////////////////////////////// EVALUATE /////////////////////////////////////

// Filter evaluate result
function filter_eval(img_name, thresh=0.5){
    // Filter
    let eval_img_info = EVAL_RESULT["detections"][img_name];
    // Clean global variable
    FILTER_RESULT = []

    if (TYPE_NAME == "object_detection"){
        // For loop to val
        for (let eval_val of eval_img_info){
            let confidence = eval_val["confidence"];
            // 0~100
            if (confidence>thresh*100){
                FILTER_RESULT.push(eval_val);
            };
        };
        draw_eval_box();
    }
    else{
        // For loop to val
        for (let eval_val of eval_img_info){
            let confidence = eval_val["score"];
            // 0~1
            if (confidence>thresh){
                FILTER_RESULT.push(eval_val);
            };
        };
    };
    // Appned log to div
    eval_log("eval_reslut");
};

function draw_eval_box(){
    let x_rate = IMAGE_SIZE["small_panel"][0]/IMAGE_SIZE["org"][1]
    let y_rate = IMAGE_SIZE["small_panel"][1]/IMAGE_SIZE["org"][0]
    // For loop to bbox list(index)
    for (let index in FILTER_RESULT){
        // Get box
        let box = FILTER_RESULT[index]["bbox"]
        // Get class index in all_class
        let cls_idx = parseInt(Object.keys(PRJ_INFO["front_project"]["classes_num"]).indexOf(FILTER_RESULT[index]["class"]));

        // Convert color
        let color = rgb2hex(COLOR_BAR[cls_idx+1][2], 
                            COLOR_BAR[cls_idx+1][1], 
                            COLOR_BAR[cls_idx+1][0]);
        // Create bbox Object
        let bbox_obj = {
                        x: box[0]*x_rate,
                        y: box[1]*y_rate,
                        width: (box[2]*x_rate)-(box[0]*x_rate),
                        height: (box[3]*y_rate)-(box[1]*y_rate),
                        "class":FILTER_RESULT[index]["class"],
                        "color":color,
                    };
        // Check obj is not repeat that in list
        // If is not exist, then create
        if (RECTANGLES.indexOf(bbox_obj) === -1){
            RECTANGLES.push(bbox_obj);
            // Draw box
            redraw();
        };
    };
};

///////////////////////////////// LABEL ACTION /////////////////////////////////////
///////////////////////////////// LABEL ACTION /////////////////////////////////////
///////////////////////////////// LABEL ACTION /////////////////////////////////////

// PANAL CHAGNE
function panel_change(key){
    if ( key == "label"){
        $("#main_div").css("display","none");
        $("#label_div").removeAttr("style","display: none;");
        $("#label_div").load("labeling.html");
    }
    else{
        // Refresh panel
        setTimeout('myrefresh()',50);
    };
};

// Build container for small image
function init_smallimg_container(){
    let total = 9;
    // Build null 9 container
    for (let i=0; i < total; i++){
        let html = `
                    <div id="label_img_${i}" class="label_smallimg" style="display: none;">
                        <img id="image_${i}" class="show_image" loading="lazy">
                    </div>
                `;
        $("#label_smallimg_container").append(html);
    };

    // Add number name
    $("#dataset_num_label").text($("#dataset_num").text());
    // Add type
    $("#label_type").text(TYPE_NAME);
    // Check type for tool
    if (TYPE_NAME == "classification"){
        $(".label_tool_container").attr("style","opacity: 0.2; cursor: not-allowed;");
    };

    // Check main show img
    let small_list = $('#small_img_container').children();
    let selector =  $("#small_img_container div[style*='border: 2px solid rgb(230, 31, 35);']");
    let sel_idx = Object.values(small_list).indexOf(selector[0]);
    let sel_mul = parseInt(sel_idx/total);
    let part = [9*sel_mul, total*sel_mul+total];
    fillin_small_image(small_list, part, sel_idx, total);
};

// Fill small image in container
function fillin_small_image(small_list, part, sel_idx, total){
    for (let i=part[0]; i < part[1]; i++){
        let img_div = small_list[i];
        if (img_div != undefined){
            // Get src
            let img_path = $($(img_div).children()).attr("src");
            // Append src
            $(`#image_${String(i%total)}`).attr("src",img_path);
            // Remove display style
            $(`#label_img_${String(i%total)}`).removeAttr("style");
            // Show large
            if (i == sel_idx){
                preview_img(img_path, "large_img");
                // Show select image box
                $(`#label_img_${String(i%total)}`).attr("style","border: 2px solid rgb(230, 31, 35);");
            };
        }
        else{
            // Remove src
            $(`#image_${String(i%total)}`).removeAttr("src");
            // Remove display style
            $(`#label_img_${String(i%total)}`).attr("style","display: none;");
        };
    };
    // Expand display
    let small_len = small_list.length;
    if (part[1]<small_len){
        $("#expand_more_img").attr("style","opacity: 1; cursor: pointer;");
    }
    else{
        $("#expand_more_img").removeAttr("style");
    };

    if (part[0]>0){
        $("#expand_less_img").attr("style","opacity: 1; cursor: pointer;");
    }
    else{
        $("#expand_less_img").removeAttr("style");
    }
};

///////////////////////////////// EXPAND /////////////////////////////////////
///////////////////////////////// EXPAND /////////////////////////////////////
///////////////////////////////// EXPAND /////////////////////////////////////

function expand_img(key){
    let total = 9;
    // Check main show img
    let small_list = $('#small_img_container').children();
    let src =  $("#large_img").attr("src");
    let selector =  $(`#image_div img[src*='${src}']`);
    let sel_idx = Object.values(small_list).indexOf($(selector[0]).parent()[0]);
    let small_len = small_list.length;
    let sel_mul = parseInt(sel_idx/total);
    let part = [total*sel_mul, total*sel_mul+total];
    if (key=="more"){
        part = [part[0]+total, part[1]+total];
        if (part[0]<small_len){
            fillin_small_image(small_list, part, part[0], total);
        };
    }
    else{
        part = [part[0]-total, part[1]-total];
        if (part[0]>=0){
            fillin_small_image(small_list, part, part[0], total);
        };
    };
};

///////////////////////////////// ANNOTATION /////////////////////////////////////
///////////////////////////////// ANNOTATION /////////////////////////////////////
///////////////////////////////// ANNOTATION /////////////////////////////////////

// Append class element
function add_annotation(class_name){
    // Give color
    COLOR_BAR = get_color_bar_api();
    // Get index of all classes
    cls_idx = Object.keys(PRJ_INFO["front_project"]["classes_num"]).indexOf(class_name);
    cls_idx = parseInt(cls_idx) + 1;
    color = rgb2hex(COLOR_BAR[parseInt(cls_idx)][2], 
                    COLOR_BAR[parseInt(cls_idx)][1], 
                    COLOR_BAR[parseInt(cls_idx)][0]);

    let html = `
                <div class="label_annotation_object">
                    <div class="label_anntation_color" style="background: ${color}"></div>
                    <div id="anno_${class_name}" class="label_anntation_name text-truncate">${class_name}</div>
                </div>
                `;
    $("#annotation").append(html).ready(function(){
        hover_marquee(`anno_${class_name}`);
    });;
};

///////////////////////////////// SELECT /////////////////////////////////////
///////////////////////////////// SELECT /////////////////////////////////////
///////////////////////////////// SELECT /////////////////////////////////////

// Select option and action
function sel_action(){
    // Append orignal classes in option
    ALL_CLASSES["keys"].forEach((val,idx) => {
        if (! (val == "All")){
            $('#classes_list_main').append(`<span>${val}</span>`); 
        };
    });

    keyup_input();

    // Listener div
    $(document).on('click', '.classes_list[list] span', function(event){
        event.preventDefault();
        var list = $(this).parent().attr('list');
        var item = $(this).html();
        $('input[list='+list+']').val(item);
        $('div[list='+list+']').hide(100);
        // Append to Class list and backend
        change_class();
    });
};

// More btn press action
function more_press(){
    $("#classes_list").attr("style","display: block");
//     $(document).keyup(function(e) {
//         if (e.key === "Escape") { // escape key maps to keycode `27`
//             $("#classes_list").removeAttr("style");
//        };
//    });
keyup_input();
};

// Event for input and drop down
function keyup_input(){
    // Listener input
    $(document).on('keyup', '.input_txt[list]', function(event){
        event.preventDefault();
        var list = $(this).attr('list');
        var div_list =  $('div[list='+$(this).attr('list')+']');
        if(event.which == 27){ // esc
            $(div_list).hide(200);
            $(this).focus();
        }
        else if(event.which == 13){ // enter
            $('div[list='+list+']').hide(100);
            // Append to Class list and backend
            change_class();
        }
        else {
            console.log("test")
            $('div[list='+list+']').show(100);
            var str  = $(this).val();
            $('div[list='+$(this).attr('list')+'] span').each(function(){
                if($(this).html().toLowerCase().indexOf(str.toLowerCase()) < 0){
                    $(this).hide(200);
                }
                else {
                    $(this).show(200);
                };
            });
        };
    });
};

function create_new_class(){
    if ($("#input_txt").val()!=""){
        // Close dropdown
        $("#classes_list").removeAttr("style");
        // Append to Class list and backend
        if (! ALL_CLASSES["keys"].includes($("#input_txt").val())){
            // Front
            $('#classes_list_main').append(`<span>${$("#input_txt").val()}</span>`);
            ALL_CLASSES["keys"].push($("#input_txt").val());
            ALL_CLASSES["values"].push(0);
            // Backend
            let front_param = {"class_name":$("#input_txt").val()};
            add_class_api(MAIN_UUID, front_param);
        }; 
    };
};

// Change class action
function change_class(){
    // Append to Class list and backend
    if ($("#input_txt").val()!=""){
        if (! ALL_CLASSES["keys"].includes($("#input_txt").val())){
            // Front
            $('#classes_list_main').append(`<span>${$("#input_txt").val()}</span>`);
            ALL_CLASSES["keys"].push($("#input_txt").val());
            ALL_CLASSES["values"].push(0);
            // Backend
            let front_param = {"class_name":$("#input_txt").val()};
            add_class_api(MAIN_UUID, front_param);
        };
    };
    // Change class front and backend
    if (TYPE_NAME=="classification"){
        cls_change_class();
    }
    else if (TYPE_NAME=="object_detection"){
        obj_change_class();
    }
};

// Change classifcation class action
function cls_change_class(){
    // Undeifined and catch class in now
    if ($(".label_annotation_object").length>0){
        class_name = $($(".label_annotation_object").children()[1]).text();
    }
    else{
        class_name = "Unlabeled";
    };

    // Backend
    let src_path = $("#large_img").attr("src").split('/');
    let img_name = src_path[src_path.length - 1];
    let front_param = {
                        "images_info":{[class_name]:[img_name]},
                        "class_name":$("#input_txt").val()
                    };
    let edit_result = edit_img_class_api(MAIN_UUID, front_param);

    // Change class
    if (edit_result.includes("Change")){
        // Get new path
        let new_path = "";
        for (let i = 0; i < src_path.length; i++){
            if (src_path[i] == src_path[ src_path.length-2]){
                src_path[i] = $("#input_txt").val();
            };
            if (i < src_path.length-1){
                new_path = new_path + src_path[i] + "/";
            }
            else{
                new_path = new_path + src_path[i] ;
            };
        };
        // Clear anntation
        $("#annotation").html("").ready(function(){
            // Append new class
            img_show_class(new_path);
            // Clear input value
            // $("#input_txt").val("");
        });
    };
};

// Change object_detection class action
function obj_change_class(){
    let class_name = $("#input_txt").val();
    // Get index of class_name in ALL_CLASSES
    let idx = ALL_CLASSES["keys"].indexOf(class_name);
    // Get class_name color
    let hex_color = COLOR_BAR[idx];
    // Select point color
    let color = rgb2hex(hex_color[2], hex_color[1], hex_color[0]);
    // POINTING COLOR
    POINTCOLOR[String(class_name)] = color;
};


///////////////////////////////// ALL CLASSES /////////////////////////////////////
///////////////////////////////// ALL CLASSES /////////////////////////////////////
///////////////////////////////// ALL CLASSES /////////////////////////////////////

// Open rename_mkpopup
function open_edit_mkpopup(){
    document.getElementById("edit_label_mkpopup").style.display = "block";
    init_all_classes();
};

// Close rename_mkpopup
function close_edit_mkpopup(){
    document.getElementById("edit_label_mkpopup").style.display = "none";
};

// Initial all classes
function init_all_classes(){
    $("#edit_labelname").html("");
    // Give color
    COLOR_BAR = get_color_bar_api();
    // For loop in all classes and add html
    for (let class_name of Object.keys(PRJ_INFO["front_project"]["classes_num"])){
        cls_idx = Object.keys(PRJ_INFO["front_project"]["classes_num"]).indexOf(class_name);
        cls_idx = parseInt(cls_idx) + 1;
        color = rgb2hex(COLOR_BAR[parseInt(cls_idx)][2], 
                        COLOR_BAR[parseInt(cls_idx)][1], 
                        COLOR_BAR[parseInt(cls_idx)][0]);
        let html = `
                    <div id="lable_${class_name}" class="one_class_container margin_bottom_20">
                        <div class="label_anntation_color" style="background: ${color}"></div>
                        <input id="label_input_${class_name}" type="text" class="edit_class_input" value="${class_name}" onchange="input_change('${class_name}')"/>
                        <div class="setting_center pointer label_tool_container" onclick="delete_class('${class_name}')">
                            <span class="material-symbols-outlined label_icon">
                                delete
                            </span>
                        </div>
                    </div>
                `;
        $("#edit_labelname").append(html);
    };
};

function delete_class(class_name){
    // Delete html in edit_labelname
    $(`#edit_labelname #lable_${class_name}`).remove();
    // Delete all_classes
    if (ALL_CLASSES["keys"].includes(class_name)){
        let idx = ALL_CLASSES["keys"].indexOf(class_name);
        // Only splice array when item is found
        if (idx > -1) { 
            ALL_CLASSES["keys"].splice(idx, 1); 
            ALL_CLASSES["values"].splice(idx, 1);
            // Add to DEL_CLS
            DEL_CLS.push(class_name);
        };
    };
};

function input_change(class_name){
    // Add to RENAME_CLS
    RENAME_CLS[`${class_name}`] = $(`#label_input_${class_name}`).val();
};

function save_classes(){
    // DEL_CLS
    if (DEL_CLS.length>0){
        for (let cls of DEL_CLS){
            let front_param = {"class_name":cls};
            delete_class_api(MAIN_UUID, front_param);
        };
    };
    // RENAME_CLS
    if (Object.keys(RENAME_CLS).length>0){
        for (let cls of Object.keys(RENAME_CLS)){
            let front_param = {"class_name":cls, "new_name":RENAME_CLS[cls]};
            rename_class_api(MAIN_UUID, front_param);
        };
    };
    setTimeout('myrefresh()',100);
};

///////////////////////////////// TOOL /////////////////////////////////////
///////////////////////////////// TOOL /////////////////////////////////////
///////////////////////////////// TOOL /////////////////////////////////////

// Draw rectangle btn
function rectangle(){
    if (TYPE_NAME=="object_detection"){
        let class_size = ALL_CLASSES["keys"].length;
        // Check is exist class
        if (class_size < 1){
            alert("Require to add class!")
        }
        // Check is point color
        else if (Object.keys(POINTCOLOR).length < 1){
            alert("Require to point class!")
        }
        else{
            $("#draw").attr("style","pointer-events:none")
            document.getElementById("large_img").addEventListener('pointerdown', start_drag);
        };
    };
};

// Select rectangle
function point(){
    if (TYPE_NAME=="object_detection"){
        $("#draw").attr("style","pointer-events:painted");
        $(document).keyup(function(e) {
            if (e.keyCode == 46) { // delete key maps to keycode `46`
                delete_rect();
           };
       });
    };
};

// Delete rectangle
function delete_rect(){
    if (TYPE_NAME=="object_detection"){
        console.log("selected_delete_element:",SLELCTED_DEL_ELEMENT)
        // Build SLELCTED_ELEMENT object
        let needle ={
            x: parseFloat($(SLELCTED_ELEMENT).attr("x")), 
            y: parseFloat($(SLELCTED_ELEMENT).attr("y")),
            width: parseFloat($(SLELCTED_ELEMENT).attr("width")),
            height: parseFloat($(SLELCTED_ELEMENT).attr("height")),
        };
        // console.log(needle)

        // Find index in RECTANGLES
        idx = RECTANGLES.findIndex(object => {
            return ((object["x"] === needle["x"] && object["y"] === needle["y"]) && 
            (object["width"] === needle["width"] && object["height"] === needle["height"]));
        });
        // Remove rect in RECTANGLES
        RECTANGLES.splice(idx,1)
        console.log("remove-rectangles:",RECTANGLES)
        // Remove rect in g(boxes)
        document.getElementById("boxes").removeChild(SLELCTED_DEL_ELEMENT);
    };
};

// Save label
function save_label(){
    let x_rate = IMAGE_SIZE["small_panel"][0]/IMAGE_SIZE["org"][1];
    let y_rate = IMAGE_SIZE["small_panel"][1]/IMAGE_SIZE["org"][0];
    let src_path = $("#large_img").attr("src").split("/");
    let img_name = src_path[src_path.length-1];

    let front_param= {
                        "image_name":`${img_name}`,
                        "box_info":[]
                    };

    // Reorganize to backend
    for (let rec of RECTANGLES){
        // console.log(rec);
        let one_box_info = {"class_id":String(ALL_CLASSES["keys"].indexOf(rec["class"])-1),
                            "class_name":rec["class"],
                            "bbox": [rec["x"]/x_rate, 
                                        rec["y"]/y_rate, 
                                        (rec["width"]+rec["x"])/x_rate,
                                        (rec["height"]+rec["y"])/y_rate]
                            };
        front_param["box_info"].push(one_box_info);
    };
    console.log(front_param);
    // Send to backend
    update_bbox_api(MAIN_UUID, front_param);
};

// Draw pannel has changed, then save
function listen_draw(){

};

// Save listener keyup
function save_keyup(){
    if( TYPE_NAME=="object_detection"){
        $(document).keypress(function(e) {
            if (e.which == 115) {
                save_label();
            };
        });
    };
};
