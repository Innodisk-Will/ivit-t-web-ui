///////////////////////////////// INITIAL /////////////////////////////////////
///////////////////////////////// INITIAL /////////////////////////////////////
///////////////////////////////// INITIAL /////////////////////////////////////

// Intial model relative data
function init_model(){
    // Get history
    let front_param = {"iteration":ITER_NAME};
    let metrics_data = metrics_history_api(MAIN_UUID, front_param);
    let curve_data = curve_history_api(MAIN_UUID, front_param);
    let model_info = get_model_info_api(MAIN_UUID, front_param);
    
    // Setting show metrics
    if (metrics_data["status"] == 200){
        $("#metrics_container").css("display","flex");
        metrics_data_process(metrics_data["data"]);
    };

    // Evaluate/Export btn press   
    open_eval_export();

    // Setting show curve and log
    if (curve_data["status"] == 200){
        $("#train_data_container").css("display","flex");
        curve_data_process(curve_data["data"]);
        // Append log
        log_process(curve_data["data"]);
    }
    else{
        // Initial curve
        training_init_curve();
    };

    // Setting model info
    if (model_info["status"] == 200){
        $("#info_container").css("display","flex");
        // Split model info
        model_info_process(model_info["data"]);
    };
};
///////////////////////////////// METIRCS CHART /////////////////////////////////////
///////////////////////////////// METIRCS CHART /////////////////////////////////////
///////////////////////////////// METIRCS CHART /////////////////////////////////////

// Process of metrics data
function metrics_data_process(data){
    var colorlist = ['#57B8FF','#FFC700','#21D59B']
    
    for(const [index, [key, val]] of Object.entries(Object.entries(data))){
        if (key != 'precision' & key != 'recall'){
            // Setting div text
            $("#other_name").text(key);
            $("#other_percentage").text(Math.round(val*100)+"%");
            piechart_metrics("other_piechart", val*100, 100-val*100, colorlist[index]);
        }
        else{
            $(`#${key}_percentage`).text(Math.round(val*100)+"%");
            piechart_metrics(`${key}_piechart`, val*100, 100-val*100, colorlist[index]); 
        };
    };
};

///////////////////////////////// TRAIN VAL CURVE CHART /////////////////////////////////////
///////////////////////////////// TRAIN VAL CURVE CHART /////////////////////////////////////
///////////////////////////////// TRAIN VAL CURVE CHART /////////////////////////////////////

// Train/val curve switch btn 
function switch_btn_curve(key){
    if (key=="train"){
        // Append css action
        $("#train_curve_btn").css("background","#E61F23 0% 0% no-repeat padding-box");
        $($("#train_curve_btn").children()).css("color","#FFFFFF");
        $("#train_curve_container").removeAttr("style","display:none;");
        // Remove other css action
        $("#val_curve_btn").removeAttr("style");
        $($("#val_curve_btn").children()).removeAttr("style");
        $("#val_curve_container").css("display","none");
    }
    else{
        // Append css action
        $("#val_curve_btn").css("background","#E61F23 0% 0% no-repeat padding-box");
        $($("#val_curve_btn").children()).css("color","#FFFFFF");
        $("#val_curve_container").removeAttr("style","display:none;");
        // Remove other css action
        $("#train_curve_btn").removeAttr("style");
        $($("#train_curve_btn").children()).removeAttr("style");
        $("#train_curve_container").css("display","none");
    };
};

// Curve data process
function curve_data_process(training_data){
    if (TYPE_NAME=="classification"){
        cls_curve_process(training_data);
    }
    else if (TYPE_NAME=="object_detection"){
        obj_curve_process(training_data);
    };
};

// Classification curve process
function cls_curve_process(training_data){
    var train_data = [];
    var val_data = [];
    // Split train and val
    for(const key of Object.keys(training_data)){
        // Train data
        var train_status = {"loss":training_data[key]["status"]["loss"],
                        "acc":training_data[key]["status"]["acc"]};
        train_data.push({"step":key, "status":train_status});

        // Val data
        var val_status = {"val_loss":training_data[key]["status"]["val_loss"],
                        "val_acc":training_data[key]["status"]["val_acc"]};
        val_data.push({"step":key, "status":val_status});
    };

    // Train_curve
    create_curve("train_curve", train_data, "train");
    // val_curve
    create_curve("val_curve", val_data, "val");
};

// Object detection curve process
function obj_curve_process(training_data){
    var train_data = [];
    var val_data = [];
    // Split train and val
    for(const key of Object.keys(training_data)){
        // Train data
        var train_status = {"avg_loss":training_data[key]["status"]["avg_loss"]};
        train_data.push({"step":key, "status":train_status});

        // Val data
        var val_status = {"mAP":training_data[key]["status"]["mAP"]};
        val_data.push({"step":key, "status":val_status});
    };
    // Train_curve
    create_curve("train_curve", train_data, "train");
    // val_curve
    create_curve("val_curve", val_data, "val");
};

// Create curve
function create_curve(id, train_data, key){
    // console.log(train_data)
    var colorlist = ['#E61F23','#57B8FF'];
    var dataset = [];
    // Get status name
    for(const [index, [key, value]] of Object.entries(Object.entries(train_data[0]['status']))){
        var component={
            label: key,
            data: train_data,
            backgroundColor: colorlist[index]+'1a',
            borderColor: colorlist[index],
            tension:0.4,
            parsing:{
                yAxisKey:`status.${key}`
            }
        };
        dataset.push(component);
    };
    train_val_curve(id, dataset, Object.keys(train_data[0])[0], key);
};

// Start training, then initial curve
function training_init_curve(){
    if (TYPE_NAME=="classification"){
        cls_curve_process([{"step": undefined,
                            "status": {"loss": undefined, 
                                        "acc": undefined, 
                                        "val_loss": undefined, 
                                        "val_acc": undefined}}]);
    }
    else if (TYPE_NAME=="object_detection"){
        obj_curve_process([{"step": undefined,
                            "status": {"avg_loss": undefined, 
                                        "mAP": undefined}}]);
    };
};

// Socket graph
function socket_curve(){
    // Graph info
    socket.on('curve', function(msg){  
        // Aviod main train panel
        if (MAIN_PAGE=="model" && ITER_NAME == TRAINING_STATUS[MAIN_UUID]["iteration"]['front_name']){
            curve_updata(JSON.parse(msg));
        };
    });
};

// Socket graph
function socket_metrics(){
    // Graph info
    socket.on('metrics', function(msg){  
        // Aviod main train panel
        if (MAIN_PAGE=="model" && ITER_NAME == TRAINING_STATUS[MAIN_UUID]["iteration"]['front_name']){
            $("#metrics_container").css("display","flex");
            metrics_data_process(JSON.parse(msg));
            // Allow evaluate can upload
            $("#eval_chose_file_2").removeAttr("disabled");
        };
    });
};

///////////////////////////////// LOG /////////////////////////////////////
///////////////////////////////// LOG /////////////////////////////////////
///////////////////////////////// LOG /////////////////////////////////////

// Log process
function log_process(data){
    for (const key in data) {
        var log = `${Object.keys(data[key])[0]}: ${data[key][Object.keys(data[key])[0]]} ∥
                    ${Object.keys(data[key]['status'])[0]}: ${ Math.round(data[key]['status'][Object.keys(data[key]['status'])[0]]*100)/100},
                    ${Object.keys(data[key]['status'])[1]}: ${ Math.round(data[key]['status'][Object.keys(data[key]['status'])[1]]*100)/100}`;

        if (TYPE_NAME == "classification"){
            log = log+`,
                    ${Object.keys(data[key]['status'])[2]}: ${ Math.round(data[key]['status'][Object.keys(data[key]['status'])[2]]*100)/100},
                    ${Object.keys(data[key]['status'])[3]}: ${ Math.round(data[key]['status'][Object.keys(data[key]['status'])[3]]*100)/100}`;
        };
        // Append html
        var html = `<label id="log_text" class='log_font'>${log}</label>`;
        $(`#log_container`).append(html)
    };
    // Settting scroll
    scroll_bottom("log_container");
};

// Socket log
function socket_log(){
    // Log
    socket.on('log', function(msg){
        // Show train_data_container
        $("#train_data_container").css("display","flex");  
        // Append html
        var html = `<label id="log_text" class='log_font'>${msg}</label>`;
        // Aviod main train panel
        if (MAIN_PAGE=="model" && ITER_NAME == TRAINING_STATUS[MAIN_UUID]["iteration"]['front_name']){
            $(`#log_container`).append(html);
        };
        // Settting scroll
        scroll_bottom("log_container");
        // Ending process
        if (msg.includes("Ending...")){
            console.log("The end...");
            // Refresh variable
            refresh_variable();
            // Change train btn
            $("#train_action").val("Train");
            $("#train_action").attr("onclick","open_train_mkpopup()");
            // Refresh panel
            // setTimeout('myrefresh()',500);
            // Open evaluate/export
            open_eval_export();
        }        
        else if (msg.includes("out of memory")){
            console.log("out of memory...")
            // Change train btn
            $("#train_action").val("Train");
            $("#train_action").attr("onclick","open_train_mkpopup()");
            // Tip out of memory
            alert("The batch size is large, GPU is out of memory.");
            // Refresh panel
            number = parseInt(ITER_NAME.split('iteration')[1])-1
            setTimeout(window.location.replace(HREF[0].split("?")[0] + "?dataset&" + MAIN_UUID + "&" + PRJ_NAME + "&" + TYPE_NAME), 1000);
        }
        else if (msg.includes("No best model")){
            // Refresh panel
            number = parseInt(ITER_NAME.split('iteration')[1])-1
            setTimeout(window.location.replace(HREF[0].split("?")[0] + "?dataset&" + MAIN_UUID + "&" + PRJ_NAME + "&" + TYPE_NAME), 1000);
        };
    });
};

// listen socket log
function listen_socket_log(){
    $("#log_container").on("DOMNodeInserted",function(){
        if ($("#log_container").children().length > 25){
            // console.log($("#log_container").children().length)
            $("#log_container").children().slice(0, 5).remove();
        };
    });
};

// Setting scroll in bottom
function scroll_bottom(id) {
    var div = document.getElementById(id);
    div.scrollTop = div.scrollHeight;
};

///////////////////////////////// INFORMATION /////////////////////////////////////
///////////////////////////////// INFORMATION /////////////////////////////////////
///////////////////////////////// INFORMATION /////////////////////////////////////

// Get model information
function model_info_process(data){
    // Information
    $("#type_val").text(TYPE_NAME);
    $("#platform_val").text(PRJ_INFO["platform"]);
    $("#dataset_val").text(data["effect_img_nums"]);
    $("#method_val").text(data["training_method"]);
    // Time processing
    let min = parseInt(parseInt(data["spend_time"])/60);
    let sec = parseInt(data["spend_time"])%60;
    min_sec_text(min, sec);
    // Parameter
    ARCH = data["model"];
    $("#model_val").text(data["model"]);
    $("#gpu_val").text(data["gpu"]).ready(function(){
        // Check project name overflow to marquee
        hover_marquee(`gpu_val`);
    });
    $("#input_shape_val").text(data["input_shape"]);
    $("#batchsize_val").text(data["batch_size"]);
    $("#step_val").text(data["step"]);
};

function min_sec_text(min, sec){
    if (isNaN(min) || isNaN(sec)){
        $("#time_val").text("Calculating");
    }
    else{
        $("#time_val").text(min+"m "+sec+"s");
    };
};

// Socket training remaining_time
function socket_remaining_time(){
    // Remaining_time
    socket.on('remaining_time', function(msg){
        // Aviod main train panel
        if (MAIN_PAGE=="model" && ITER_NAME == TRAINING_STATUS[MAIN_UUID]["iteration"]['front_name']){
            if (msg != "0"){
                $(`#time_text`).text("Remaining time");
                // Time processing
                let min = parseInt(parseInt(msg)/60);
                let sec = parseInt(msg)%60;
                min_sec_text(min, sec);
            };
        };  
    });
};

// Socket training spend_time
function socket_spend_time(){
    // Spend_time
    socket.on('spend_time', function(msg){
        // Aviod main train panel
        if (MAIN_PAGE=="model" && ITER_NAME == TRAINING_STATUS[MAIN_UUID]["iteration"]['front_name']){
            $(`#time_text`).text("Spend time");
            // Time processing
            let min = parseInt(parseInt(msg)/60);
            let sec = parseInt(msg)%60;
            min_sec_text(min, sec);
        }; 
    });
};

// Refresh variable
function refresh_variable(){
    // Refresh backend parameter
    init_prj_api();
    // Get prj_info again in end
    PRJ_INFO = get_uuid_prj_info(MAIN_UUID);
};

///////////////////////////////// EVALUATE /////////////////////////////////////
///////////////////////////////// EVALUATE /////////////////////////////////////
///////////////////////////////// EVALUATE /////////////////////////////////////

function eval_listen(){

    $(`#eval_chose_file_2`).on("change", function(){
        const files = $(`input[id="eval_chose_file_2"]`).get(0).files;
        if (files.length>10){
            alert("Limit a maximum of 10 images for evaluate.")
        }
        else{
            upload_eval_img(files);
        };
    });

    $(`#eval_chose_file_1`).on("change", function(){
        const files = $(`input[id="eval_chose_file_1"]`).get(0).files;
        if (files.length>10){
            alert("Limit a maximum of 10 images for evaluate.")
        }
        else{
            upload_eval_img(files);
        };
    });
};

// Upload btn to upload files
function upload_eval_img(files){
    var formData = new FormData();
    formData.append("iteration", ITER_NAME);
    // Append to formData 
    for (let key of Object.keys(files)){
        formData.append("file", files[key]);
    };
    // Get image path
    EVAL_IMG_LIST = upload_eval_img_api(MAIN_UUID, formData);
    // console.log(EVAL_IMG_LIST)
    // Get reslut and box
    if (EVAL_IMG_LIST["eval_img"].length>0){
        // Loading 
        let loading_html =`<div id="loader_container" class="loader_container_eval"><div class="loader" style="margin:0px;font-size: 12px;">Loading...</div></div>`
        $("#evalimage_outside_container").append(loading_html).ready(function(){
            // Evaluate
            let front_param = {"iteration":ITER_NAME, "threshold":0.1};
            EVAL_RESULT = evaluate_api(MAIN_UUID, front_param);
            if (Object.keys(EVAL_RESULT["detections"]).length>0){
                // Remove loading
                remove_loader("evalimage_outside_container");
                // Transition
                eval_trans_html();
            };
        });
    };
};

// Transition eval html
function eval_trans_html(){
    // Change panel
    html = `
            <div class="preview_img_container">
                <div id="eval_expand_less" class="expand_img_container expand_btn_container expand_img_left" onclick="eval_expand_btn('less')">
                    <span class="material-symbols-outlined expand_btn_css user-select-none">
                        arrow_back_ios
                    </span>
                </div>
                <img id="eval_img" class="show_image lazyload" loading="lazy">
                <div id="eval_expand_more" class="expand_img_container expand_btn_container" onclick="eval_expand_btn('more')">
                    <span class="material-symbols-outlined expand_btn_css user-select-none">
                        arrow_forward_ios
                    </span>
                </div>
            </div>
            <div id="eval_reslut" class="img_cls_show_container scroll">
            </div>
        `;
    // Clean panel build new html
    $("#evalimage_outside_container").html(html).ready(function(){
        check_eval_expand();
        // Path process
        let [img_path, img_name] = process_evl_path(EVAL_IMG_LIST["eval_img"][0]);
        preview_img(img_path, "eval_img", img_name);
    });
    $("#btnupload_file_1").removeAttr('style');
};

// Check eval expand btn
function check_eval_expand(){
    if (EVAL_IMG_LIST["eval_img"].length<2){
        $("#eval_expand_more").css("display","none");
        $("#eval_expand_less").css("display","none");
    }
    else{
        $("#eval_expand_more").removeAttr("style");
        $("#eval_expand_less").removeAttr("style");
    };
};

// Image path process
function process_evl_path(img_path){
    let path_split = img_path.split("/");
    path_split.splice(path_split.indexOf('.'), 1);
    let text_path = path_split.toString();
    let new_path = text_path.replace(/,/g, '/');
    // Refresh image path name
    var timestamp = new Date().getTime();
    img_path = `${SCRIPT_ROOT}/display_img/${new_path}?t=${timestamp}`;
    img_name = path_split[path_split.length-1]
    return [img_path, img_name];
};

// Add log to div
function eval_log(id){
    // Clean null
    $(`#${id}`).empty();
    // Not detection
    if (Object.keys(FILTER_RESULT).length==0){
        FILTER_RESULT = [{"bbox":"Not detection."}];
    };
    // Append to html
    for (let eval_val of FILTER_RESULT){
        var html = `<label id="log_text" class='log_font'>${JSON.stringify(eval_val)}</label>`;
        $(`#${id}`).append(html);
    };
};

// Evalute expand btn
function eval_expand_btn(key){
    let split_key = $("#eval_img").attr("src").split("/");
    let index = parseInt(split_key[split_key.length-1].split(".")[0].split("_")[1]);
    // Expand action
    if (key=="more"){
        if (index!=EVAL_IMG_LIST["eval_img"].length-1){
            let next = EVAL_IMG_LIST["eval_img"][index+1]
            // Path process
            let [img_path, img_name] = process_evl_path(next);
            preview_img(img_path, "eval_img", img_name);
            // $("#boxes").html("");
        };
    }
    else{
        if (index!=0){
            let before = EVAL_IMG_LIST["eval_img"][index-1];
            // Path process
            let [img_path, img_name] = process_evl_path(before);
            preview_img(img_path, "eval_img", img_name);
            // $("#boxes").html("");
        };
    };
};

// Open evaluate and export 
function open_eval_export(){
    let front_param = {"iteration":ITER_NAME};
    let exist_model = check_best_model_api(MAIN_UUID, front_param);
    // console.log(exist_model)

    if (exist_model["Exist"]){
        // console.log(exist_model)

        // Evaluate open funciton
        $("#evaluate_container").removeAttr("style");
        $("#eval_chose_file_2").removeAttr("disabled");
        // Export setting
        $("#export_btn").removeAttr("disabled");
        socket_export();
    };
};

///////////////////////////////// EXPORT /////////////////////////////////////
///////////////////////////////// EXPORT /////////////////////////////////////
///////////////////////////////// EXPORT /////////////////////////////////////

// Open export_mkpopup
function open_export_mkpopup(){
    // If true then setting
    document.getElementById("export_mkpopup").style.display = "block";
    export_platform();
};

// Close export_mkpopup
function close_export_mkpopup(){
    document.getElementById("export_mkpopup").style.display = "none";
};

// get export platform
function export_platform(){
    // Clear option
    document.getElementById('ep_list').options.length = 0;
    $('#ep_list').append(`<option disabled="disabled" selected="selected">Please select one</option>`);

    // Get export platform list
    let ep_list = get_export_platform_api(MAIN_UUID, ARCH);
    ep_list['export_platform'].forEach((val,i) => {
        $('#ep_list').append('<option class="text-capitalize" value="' + `${val}` + '">' + `${val}` + '</option>'); 
    });

    // Setting default parameter
    $('#ep_list').val(PRJ_INFO["platform"]);
};

// get export platform
function start_export(){
    // Loading 
    let loading_html =  `<div id="loader_container" class="loader_container_eval" style="background: #0000003b;">
                            <div class="loader" style="margin:0px;font-size: 5px;">
                                Loading...
                            </div>
                            <div style="margin-top: 10px;">
                                Loading...
                            </div>
                            <div id="export_progress" class="export_progress">0%</div>
                        </div>`

    $("#export_containter").append(loading_html);
    // Sent webapi to backend
    let front_param = {"iteration":ITER_NAME, "export_platform":$('#ep_list').val()};
    convert_api(MAIN_UUID, front_param);
};

// Socketio wait export success
function socket_export(){
    // convert log
    socket.on('convert_log', function(msg){
        if (msg.includes("Success")){
            // Remove loading
            remove_loader("export_containter");
            change_export();
        }
        else if (msg.includes('Failure')){
            alert(msg);
        }
        else if (msg.includes("%")){
            msg = msg.replace(/\"/g,'')
            $("#export_progress").text(msg);
        };
    });
};

function change_export(){
    let front_param = {"iteration":ITER_NAME};
    let share_url = share_api(MAIN_UUID, front_param);
    share_url = share_url["url"]
    if (share_url.includes("127.0.0.1")){
        DOMAIN = HOST.split(":")[0]
        share_url = DOMAIN + share_url.split("127.0.0.1")[1]
    };

    // Download button
    $("#export_convert_btn").text("Download");
    $("#export_convert_btn").attr("onclick",`location.href='http://${share_url}'`);
    $("#cancel_btn").text("Colse");
    $("#cancel_btn").attr("onclick",`location.reload()`);

    // Stop select
    $("#ep_list").attr("disabled","disabled");
    
    // Show share api
    $("#url_name").removeAttr("style");
    $("#url_val").removeAttr("style");
    $("#share_api").text(`${share_url}`);
};