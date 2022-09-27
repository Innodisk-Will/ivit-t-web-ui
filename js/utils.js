// Web API IP
const DOMAIN = '172.16.92.124';
const port = '6530';
var SCRIPT_ROOT = `http://${DOMAIN}:${port}`;

///////////////////////////////// MARQUEE /////////////////////////////////////
///////////////////////////////// MARQUEE /////////////////////////////////////
///////////////////////////////// MARQUEE /////////////////////////////////////

// Marquee text
function wrap_contents_marquee(element) {
    var marquee = document.createElement('marquee');
    contents = element.innerText;
    marquee.innerText = contents;
    element.innerHTML = '';
    element.appendChild(marquee);
};

// Remove marquee text
function remove_marquee(element) {
    contents = element.firstChild.innerText;
    element.removeChild(element.firstChild);
    element.innerText = contents;
};

// Text overflow
function element_overflowing(element) {
    var overflowX = element.offsetWidth < element.scrollWidth;
    var overflowY = element.offsetHeight < element.scrollHeight;
    return (overflowX || overflowY);
};

// Hover action for txt marquee
function hover_marquee(id){
    var pj_name = document.getElementById(id);
    $(`#${id}`).unbind('mouseenter').unbind('mouseleave');
    if (element_overflowing(pj_name)) {
        $(`#${id}`).hover(function(){
            wrap_contents_marquee(pj_name);
        },function(){
            remove_marquee(pj_name);
        });
    };
};

///////////////////////////////// HTML CHANGE /////////////////////////////////////
///////////////////////////////// HTML CHANGE /////////////////////////////////////
///////////////////////////////// HTML CHANGE /////////////////////////////////////

// Fresh page
function myrefresh(){
    window.location.reload();
};

// Loading container html
function loading_html(val){
    $(".navbar-brand").attr("href", SERVER_LOC);
    if (val===undefined){
        $("#main_container").load("project.html");
    }
    else{
        // Get url infomation
        let [key, uuid, prjname, type] = val.split("&");
        // Open project name and btn and train
        $(`.head_container`).css("visibility","visible");
        // Add initial action
        if (key=="dataset"){
            $("#main_container").load("dataset.html");
            // Add action of head
            $("#prj_name").text(prjname);
            $("#model_btn_container").css("background-color","#E61F23")
            $("#model_href").css("color","#FFF");
            $("#model_href").attr("href", SERVER_LOC+"?model"+"&"+uuid+"&"+prjname+"&"+type);
            $("#dataset_href").attr("href", SERVER_LOC+"?dataset"+"&"+uuid+"&"+prjname+"&"+type);
        }
        else if (key=="model"){
            $("#main_container").load("model.html");
            // Add action of head
            $("#prj_name").text(prjname);
            $("#dataset_btn_container").css("background-color","#E61F23")
            $("#dataset_href").css("color","#FFF");
            $("#model_href").attr("href", SERVER_LOC+"?model"+"&"+uuid+"&"+prjname+"&"+type);
            $("#dataset_href").attr("href", SERVER_LOC+"?dataset"+"&"+uuid+"&"+prjname+"&"+type);
        };
    };
};

// Replace url
function replace_url(val){
    window.location.href = SERVER_LOC+"?"+val;
};

// Give tile project name and href
function give_title_text(href_id, prj_id, text){
    $(`#${href_id}`).attr("href", SERVER_LOC)
    $(`#${prj_id}`).text(text)
};

// Get info of prj
function get_uuid_prj_info(uuid){
    let info = get_allprj_info_api();
    return info[uuid];
};

///////////////////////////////// TRAIN /////////////////////////////////////
///////////////////////////////// TRAIN /////////////////////////////////////
///////////////////////////////// TRAIN /////////////////////////////////////

// Open train_mkpopup
function open_train_mkpopup(){
    let cls_num = PRJ_INFO["front_project"]["classes_num"];
    let cls_length = Object.keys(cls_num).length;
    let check_num = false;
    if (cls_length>0){
        if (cls_length<2 && TYPE_NAME== "classification"){
            alert("Your project can't be trained just yet. Make sure you have over 2 classes in Classification");
        }
        else{
            for (let key of Object.keys(cls_num)){
                if (cls_num[key]>15){
                    check_num = true;
                }
                else{
                    check_num = false;
                };
            };
            // If true then setting
            if (check_num){
                document.getElementById("train_mkpopup").style.display = "block";
                // Option
                get_method_training();
                // Clear option
                option_show_hide();
            }
            else{
                alert("Your project can't be trained just yet. Make sure you have at least 15 images for every class.");
            };
        };
    }
    else{
        alert("Please upload images and labeling.");
    };
};

// Close train_mkpopup
function close_train_mkpopup(){
    document.getElementById("train_mkpopup").style.display = "none";
    // Clear option
    document.getElementById('method_list').options.length = 0;
    $('#method_list').append(`<option disabled="disabled" selected="selected">Please select one</option>`);
};

// Get method of training
function get_method_training(){
    // Clear option
    document.getElementById('method_list').options.length = 0;
    $('#method_list').append(`<option disabled="disabled" selected="selected">Please select one</option>`);

    // Get method list
    let method_list = get_method_training_api();
    method_list['method_training'].forEach((val,i) => {
        $('#method_list').append('<option class="text-capitalize" value="' + `${val}` + '">' + `${val}` + '</option>'); 
    });
};

// Chose method then other option show/hide
function option_show_hide(){
    if ($("#method_list").val() == null || $("#method_list").val().includes("Quick")){
        $("#model_div").removeAttr("style","display:flex;");
        $("#model_list_div").removeAttr("style","display:flex;");
        $("#batch_size_div").removeAttr("style","display:flex;");
        $("#batch_size_list_div").removeAttr("style","display:flex;");
        $("#shape_div").removeAttr("style","display:flex;");
        $("#shape_text_div").removeAttr("style","display:flex;");
        $("#step_div").removeAttr("style","display:flex;");
        $("#step_text_div").removeAttr("style","display:flex;");
    }
    else{
        $("#model_div").css("display","flex");
        $("#model_list_div").css("display","flex");
        $("#batch_size_div").css("display","flex");
        $("#batch_size_list_div").css("display","flex");
        $("#shape_div").css("display","flex");
        $("#shape_text_div").css("display","flex");
        $("#step_div").css("display","flex");
        $("#step_text_div").css("display","flex");
        // Give
        advanced_training();
    };
};

// Advanced training value
function advanced_training(){
    // Clear option
    document.getElementById('model_list').options.length = 0;
    $('#model_list').append(`<option disabled="disabled" selected="selected">Please select one</option>`);
    document.getElementById('batch_size_list').options.length = 0;
    $('#batch_size_list').append(`<option disabled="disabled" selected="selected">Please select one</option>`);

    // Get list
    let model_list = get_model_api(MAIN_UUID);
    model_list['model'].forEach((val,i) => {
        $('#model_list').append('<option class="text-capitalize" value="' + `${val}` + '">' + `${val}` + '</option>'); 
    });
    let bs_list = get_batch_size_api(MAIN_UUID);
    bs_list['batch_size'].forEach((val,i) => {
        $('#batch_size_list').append('<option class="text-capitalize" value="' + `${val}` + '">' + `${val}` + '</option>'); 
    });

    // Get default parameter
    let front_param = {"training_method":$("#method_list").val()};
    let default_param = get_default_param_api(MAIN_UUID, front_param);
    $('#model_list').val(default_param["training_param"]["model"]);
    $('#h_shape').val(default_param["training_param"]["input_shape"][0]);
    $('#w_shape').val(default_param["training_param"]["input_shape"][1]);
    $('#c_shape').val(default_param["training_param"]["input_shape"][2]);
    $('#input_step').val(default_param["training_param"]["step"]);

    // Batch size process
    let selectElement = document.getElementById('batch_size_list');
    let optionNames = [...selectElement.options].map(o => o.text);
    if (optionNames.includes(default_param["training_param"]["batch_size"])){
        $('#batch_size_list').val(default_param["training_param"]["batch_size"]);
    }
    else{
        $('#batch_size_list').val(optionNames[optionNames.length-1]);
    };
};

// Create training
function create_training(){
    if ($("#method_list").val()== null || $("#method_list").val().includes("Please select one")){
        alert("The form is not complete.");
    }
    else if ($("#method_list").val().includes("Advanced")){
        // Add front parameter
        let front_param=
                        {
                            "training_method":$("#method_list").val(),
                            "model":$("#model_list").val(),
                            "batch_size":parseInt($("#batch_size_list").val()),
                            "step":parseInt($("#input_step").val()),
                            "input_shape":[parseInt($("#h_shape").val()), 
                                            parseInt($("#w_shape").val()), 
                                            parseInt($("#c_shape").val())]
                        };
        // Get front parameter value
        let values_list = Object.values(front_param);
        // Check value is not null
        if (values_list.includes("") || values_list.includes("Please select one") || values_list.includes(null)){
            alert("The form is not complete.");
        } 
        else{
            // Check training
            check_training_data(front_param);
        };
    }
    else if ($("#method_list").val().includes("Quick")){
        // Get default parameter
        let front_param = {"training_method":$("#method_list").val()};
        let default_param = get_default_param_api(MAIN_UUID, front_param);
        // Add front parameter
        front_param =
                    {
                        "training_method":$("#method_list").val(),
                        "model":default_param["training_param"]["model"],
                        "batch_size":default_param["training_param"]["batch_size"],
                        "step":default_param["training_param"]["step"],
                        "input_shape":default_param["training_param"]["input_shape"]
                    };
        // Check training
        check_training_data(front_param);
    };
};

// Before training, check parameters and check the folder of created
function check_training_data(front_param){
    let loading_html =`<div id="loader_container" class="loader_container_eval"><div class="loader" style="margin:0px;font-size: 12px;">Loading...</div></div>`
    
    $("#train_mkpopup").append(loading_html).ready(function(){
        // Waitting create folder and download pre-trained model
        let prepare_stats = create_traing_iter_api(MAIN_UUID, front_param);
        if (prepare_stats["iter_name"] != undefined){
            // Remove
            remove_loader("train_mkpopup");
            // Training
            start_training();
            // Change Panel
            window.location.replace(HREF[0].split("?")[0]+"?model&"+MAIN_UUID+"&"+PRJ_NAME+"&"+TYPE_NAME+"&"+prepare_stats["iter_name"]);
        }
        else{
            alert(prepare_stats+".");
            alert("Please remove some iterations.");
        };
    });
};

// Start training
function start_training(){
    let start = start_training_api(MAIN_UUID);
};

// Check_training_status
function check_training_stats(){
    if (PRJ_INFO["training_info"]["status"]){
        $("#train_action").val("Stop");
        $("#train_action").attr("onclick","stop_training()");
    }
    else{
        $("#train_action").val("Train");
        $("#train_action").attr("onclick","open_train_mkpopup()");
    };
};

///////////////////////////////// STOP BUTTON /////////////////////////////////////
///////////////////////////////// STOP BUTTON /////////////////////////////////////
///////////////////////////////// STOP BUTTON /////////////////////////////////////

// Stop training
function stop_training(){
    let stop = stop_training_api(MAIN_UUID);
    if (stop.includes("Stop")){
        $("#train_action").val("Train");
        $("#train_action").attr("onclick","open_train_mkpopup()");
        // Refresh variable
        refresh_variable();
        // Open evaluate/export
        open_eval_export();
    };
};

// Open delete_mkpopup
function open_stop_mkpopup(){
    document.getElementById("stop_mkpopup").style.display = "block";
};

// Close rename_mkpopup
function close_stop_mkpopup(){
    document.getElementById("stop_mkpopup").style.display = "none";
};

///////////////////////////////// LOADING /////////////////////////////////////
///////////////////////////////// LOADING /////////////////////////////////////
///////////////////////////////// LOADING /////////////////////////////////////

// Loading page
function loading_page(id){
    let html = `<div id="loader_container" class="loader_container_eval"><div class="loader" style="margin:0px;font-size: 12px;">Loading...</div></div>`;
    $(`#${id}`).append(html);
};

// Remove loading panel
function remove_loader(id){
    var child = document.getElementById("loader_container");
    document.getElementById(id).removeChild(child);
};


///////////////////////////////// OVER NUMBER /////////////////////////////////////
///////////////////////////////// OVER NUMBER /////////////////////////////////////
///////////////////////////////// OVER NUMBER /////////////////////////////////////

// Convert Unit
function k_unit(m){
    var v;
	if(typeof m === 'number' && !isNaN(m)){
		if (m >= 1000) {
            v = (m / 1000).toFixed(0) + 'k'
        } else {
           	v = m
        }
	}
    else{
		v = '0'
	}
    return v;
};