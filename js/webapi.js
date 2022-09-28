///////////////////////////////// PROJECT /////////////////////////////////////
///////////////////////////////// PROJECT /////////////////////////////////////
///////////////////////////////// PROJECT /////////////////////////////////////

// Intial all project -> GET
function init_prj_api(){
    var result=null;
    $.ajax({
        dataType: "json",
        url:`${SCRIPT_ROOT}/init_project`,
        method: "GET",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            if (data != null){
                console.log("init_prj_api:",data)
                result=data;
            }
            else{
                console.log("Project is null.")
            }
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

// Get all project info -> GET
function get_allprj_info_api(){
    var result=null;
    $.ajax({
        dataType: "json",
        url:`${SCRIPT_ROOT}/get_all_project`,
        method: "GET",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            if (data != null){
                console.log("get_allprj_info_api:",data)
                result=data;
            }
            else{
                console.log("Project is null.")
            }
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
}

// Get type -> GET
function get_type_api(){
    var result=null;
    $.ajax({
        dataType: "json",
        url:`${SCRIPT_ROOT}/get_type`,
        method: "GET",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            if (data != null){
                console.log("get_type:",data)
                result=data;
            }
            else{
                console.log("Type is null.")
            }
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

// Get platform -> GET
function get_platform_api(){
    var result=null;
    $.ajax({
        dataType: "json",
        url:`${SCRIPT_ROOT}/get_platform`,
        method: "GET",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            if (data != null){
                console.log("get_platform:",data)
                result=data;
            }
            else{
                console.log("Platform is null.")
            }
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

// Create project -> POST
function create_project_api(front_param){
    $.ajax({
        data: JSON.stringify(front_param),
        dataType: "json",
        url:`${SCRIPT_ROOT}/create_project`,
        method: "POST",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            console.log(data);
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    setTimeout('myrefresh()',500);
};

// Edit project name -> PUT
function rename_prjname_api(uuid, front_param){
    $.ajax({
        data: JSON.stringify(front_param),
        dataType: "json",
        url:`${SCRIPT_ROOT}/${uuid}/rename_project`,
        method: "PUT",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            console.log(data);
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    setTimeout('myrefresh()',500);
};

// Delete_project -> DELETE
function delete_project_api(uuid){
    $.ajax({
        dataType: "json",
        url:`${SCRIPT_ROOT}/${uuid}/delete_project`,
        method: "DELETE",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            console.log(data)
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    setTimeout('myrefresh()',500);
};

///////////////////////////////// DATASET /////////////////////////////////////
///////////////////////////////// DATASET /////////////////////////////////////
///////////////////////////////// DATASET /////////////////////////////////////

// Get dataset -> GET
function get_dataset_api(uuid){
    var result=null;
    $.ajax({
        dataType: "json",
        url:`${SCRIPT_ROOT}/${uuid}/get_dataset`,
        method: "GET",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            if (data != null){
                console.log("get_dataset:",data)
                result=data;
            }
            else{
                console.log("Dataset is null.")
            }
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

// Filter img path of dataset -> POST
function filter_dataset_api(uuid, front_param){
    var result=null;
    $.ajax({
        data: JSON.stringify(front_param),
        dataType: "json",
        url:`${SCRIPT_ROOT}/${uuid}/filter_dataset`,
        method: "POST",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            if (data != null){
                // console.log("Image:",data)
                result=data;
            }
            else{
                console.log("Image is null.")
            }
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

// Filter img path of class -> POST
function filter_class_api(uuid, front_param){
    var result=null;
    $.ajax({
        data: JSON.stringify(front_param),
        dataType: "json",
        url:`${SCRIPT_ROOT}/${uuid}/filter_classes`,
        method: "POST",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            if (data != null){
                // console.log("Image:",data)
                result=data;
            }
            else{
                console.log("Image is null.")
            }
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

// Iteration_class_number -> POST
function iter_cls_num_api(uuid, front_param){
    var result=null;
    $.ajax({
        data: JSON.stringify(front_param),
        dataType: "json",
        url:`${SCRIPT_ROOT}/${uuid}/iter_cls_num`,
        method: "POST",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            result=data;
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

// Upload file -> POST
function upload_api(uuid, formData){
    var result=null;
    $.ajax({
        data: formData,
        url:`${SCRIPT_ROOT}/${uuid}/upload`,
        method: "POST",
        cache: false,
        contentType: false,
        processData: false,
        async : false,
        success: function (data, textStatus, xhr) {
            result=data;
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

// Delete image -> DELETE
function delete_img_api(uuid, front_param){
    var result=null;
    $.ajax({
        data: JSON.stringify(front_param),
        dataType: "json",
        url:`${SCRIPT_ROOT}/${uuid}/delete_img`,
        method: "DELETE",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            result=data;
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

// Delete iteration-> DELETE
function delete_iteration_api(uuid, front_param){
    var result=null;
    $.ajax({
        data: JSON.stringify(front_param),
        dataType: "json",
        url:`${SCRIPT_ROOT}/${uuid}/delete_iteration`,
        method: "DELETE",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            result=data;
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

///////////////////////////////// LABEL /////////////////////////////////////
///////////////////////////////// LABEL /////////////////////////////////////
///////////////////////////////// LABEL /////////////////////////////////////

// Get classes of img -> GET
function get_img_cls_api(type, path){
    var result=null;
    $.ajax({
        dataType: "json",
        url:`${SCRIPT_ROOT}/get_img_cls/${type}/${path}`,
        method: "GET",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            console.log("get_img_cls:",data)
            result=data;
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

// add class -> POST
function add_class_api(uuid, front_param){
    var result=null;
    $.ajax({
        data: JSON.stringify(front_param),
        dataType: "json",
        url:`${SCRIPT_ROOT}/${uuid}/add_class`,
        method: "POST",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            result=data;
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

// Delete class -> DELETE
function delete_class_api(uuid, front_param){
    var result=null;
    $.ajax({
        data: JSON.stringify(front_param),
        dataType: "json",
        url:`${SCRIPT_ROOT}/${uuid}/delete_class`,
        method: "DELETE",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            result=data;
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

// Rename class -> PUT
function rename_class_api(uuid, front_param){
    var result=null;
    $.ajax({
        data: JSON.stringify(front_param),
        dataType: "json",
        url:`${SCRIPT_ROOT}/${uuid}/rename_class`,
        method: "PUT",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            result=data;
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

// Edit img class -> POST(CLASSIFICATION)
function edit_img_class_api(uuid, front_param){
    var result=null;
    $.ajax({
        data: JSON.stringify(front_param),
        dataType: "json",
        url:`${SCRIPT_ROOT}/${uuid}/edit_img_class`,
        method: "POST",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            result=data;
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

// Get box -> POST(OBJECTDETECTION)
function get_bbox_api(uuid, front_param){
    var result=null;
    $.ajax({
        data: JSON.stringify(front_param),
        dataType: "json",
        url:`${SCRIPT_ROOT}/${uuid}/get_bbox`,
        method: "POST",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            result=data;
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

// Update box -> POST(OBJECTDETECTION)
function update_bbox_api(uuid, front_param){
    var result=null;
    $.ajax({
        data: JSON.stringify(front_param),
        dataType: "json",
        url:`${SCRIPT_ROOT}/${uuid}/update_bbox`,
        method: "POST",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            result=data;
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

// Get color bar -> GET
function get_color_bar_api(){
    var result=null;
    $.ajax({
        dataType: "json",
        url:`${SCRIPT_ROOT}/get_color_bar`,
        method: "GET",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            result=data;
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

///////////////////////////////// MODEL /////////////////////////////////////
///////////////////////////////// MODEL /////////////////////////////////////
///////////////////////////////// MODEL /////////////////////////////////////

// Get metric history-> POST
function metrics_history_api(uuid, front_param){
    var result=null;
    $.ajax({
        data: JSON.stringify(front_param),
        dataType: "json",
        url:`${SCRIPT_ROOT}/${uuid}/metrics_history`,
        method: "POST",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            result=data;
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

// Get curve history-> POST
function curve_history_api(uuid, front_param){
    var result=null;
    $.ajax({
        data: JSON.stringify(front_param),
        dataType: "json",
        url:`${SCRIPT_ROOT}/${uuid}/curve_history`,
        method: "POST",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            result=data;
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

// Get model info-> POST
function get_model_info_api(uuid, front_param){
    var result=null;
    $.ajax({
        data: JSON.stringify(front_param),
        dataType: "json",
        url:`${SCRIPT_ROOT}/${uuid}/get_model_info`,
        method: "POST",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            result=data;
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

// Check best model exist-> POST
function check_best_model_api(uuid, front_param){
    var result=null;
    $.ajax({
        data: JSON.stringify(front_param),
        dataType: "json",
        url:`${SCRIPT_ROOT}/${uuid}/check_best_model`,
        method: "POST",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            result=data;
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

///////////////////////////////// TRAIN /////////////////////////////////////
///////////////////////////////// TRAIN /////////////////////////////////////
///////////////////////////////// TRAIN /////////////////////////////////////

// Get method of training -> GET
function get_method_training_api(){
    var result=null;
    $.ajax({
        dataType: "json",
        url:`${SCRIPT_ROOT}/get_method_training`,
        method: "GET",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            result=data;
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

// Get model -> GET
function get_model_api(uuid){
    var result=null;
    $.ajax({
        dataType: "json",
        url:`${SCRIPT_ROOT}/${uuid}/get_model`,
        method: "GET",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            result=data;
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

// Get batch size -> GET
function get_batch_size_api(uuid){
    var result=null;
    $.ajax({
        dataType: "json",
        url:`${SCRIPT_ROOT}/${uuid}/get_batch_size`,
        method: "GET",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            result=data;
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

// Get default parameter -> POST
function get_default_param_api(uuid, front_param){
    var result=null;
    $.ajax({
        data: JSON.stringify(front_param),
        dataType: "json",
        url:`${SCRIPT_ROOT}/${uuid}/get_default_param`,
        method: "POST",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            result=data;
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

// Create training iteartion -> POST
function create_traing_iter_api(uuid, front_param){
    var result=null;
    $.ajax({
        data: JSON.stringify(front_param),
        dataType: "json",
        url:`${SCRIPT_ROOT}/${uuid}/create_training_iter`,
        method: "POST",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            result=data;
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

// Start training api -> GET
function start_training_api(uuid){
    var result=null;
    $.ajax({
        dataType: "json",
        url:`${SCRIPT_ROOT}/${uuid}/start_training`,
        method: "GET",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            result=data;
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

// Stop training api -> GET
function stop_training_api(uuid){
    var result=null;
    $.ajax({
        dataType: "json",
        url:`${SCRIPT_ROOT}/${uuid}/stop_training`,
        method: "GET",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            result=data;
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

///////////////////////////////// EVALUATE /////////////////////////////////////
///////////////////////////////// EVALUATE /////////////////////////////////////
///////////////////////////////// EVALUATE /////////////////////////////////////

// Upload Image api -> POST
function upload_eval_img_api(uuid, formData){
    var result=null;
    $.ajax({
        data: formData,
        url:`${SCRIPT_ROOT}/${uuid}/upload_eval_img`,
        method: "POST",
        cache: false,
        contentType: false,
        processData: false,
        async : false,
        success: function (data, textStatus, xhr) {
            result=data;
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

// Evaluate result api -> POST
function evaluate_api(uuid, front_param){
    var result=null;
    $.ajax({
        data: JSON.stringify(front_param),
        dataType: "json",
        url:`${SCRIPT_ROOT}/${uuid}/evaluate`,
        method: "POST",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            result=data;
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

///////////////////////////////// EXPORT /////////////////////////////////////
///////////////////////////////// EXPORT /////////////////////////////////////
///////////////////////////////// EXPORT /////////////////////////////////////

// Get export platform -> GET
function get_export_platform_api(uuid){
    var result=null;
    $.ajax({
        dataType: "json",
        url:`${SCRIPT_ROOT}/${uuid}/get_export_platform`,
        method: "GET",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            result=data;
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

// Start convert api -> POST
function convert_api(uuid, front_param){
    var result=null;
    $.ajax({
        data: JSON.stringify(front_param),
        dataType: "json",
        url:`${SCRIPT_ROOT}/${uuid}/start_convert`,
        method: "POST",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            result=data;
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

// Share url api -> POST
function share_api(uuid, front_param){
    var result=null;
    $.ajax({
        data: JSON.stringify(front_param),
        dataType: "json",
        url:`${SCRIPT_ROOT}/${uuid}/share_api`,
        method: "POST",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            result=data;
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

///////////////////////////////// ALL /////////////////////////////////////
///////////////////////////////// ALL /////////////////////////////////////
///////////////////////////////// ALL /////////////////////////////////////

// Process uuid
function uuid_exist(key, uuid){
    // UUID
    if (uuid == null){
        url = `${SCRIPT_ROOT}/${key}`;
    }
    else{
        url = `${SCRIPT_ROOT}/${uuid}/${key}`;
    };
    return url;
};

// All post uuid api
function post_api(key, uuid, front_param){
    let url = uuid_exist(key, uuid);

    var result=null;
    $.ajax({
        data: JSON.stringify(front_param),
        dataType: "json",
        url:url,
        method: "POST",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            result=data;
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

// All get uuid api
function get_api(key, uuid){
    let url = uuid_exist(key, uuid);

    var result=null;
    $.ajax({
        dataType: "json",
        url:url,
        method: "GET",
        contentType: "application/json",
        async : false,
        success: function (data, textStatus, xhr) {
            result=data;
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};

// FormData -> POST
function formdata_api(key, uuid, formData){
    var result=null;
    $.ajax({
        data: formData,
        url:`${SCRIPT_ROOT}/${uuid}/${key}`,
        method: "POST",
        cache: false,
        contentType: false,
        processData: false,
        async : false,
        success: function (data, textStatus, xhr) {
            result=data;
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR["responseJSON"]);
            console.log(exception);
            result=jqXHR["responseJSON"];
        }
    });
    return result;
};