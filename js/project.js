///////////////////////////////// INITIAL /////////////////////////////////////
///////////////////////////////// INITIAL /////////////////////////////////////
///////////////////////////////// INITIAL /////////////////////////////////////

// Get exist project
function load_exist_project(){
    if( typeof(INIT_PRJ)== "object"){
        let sort_uuid = sort_project();
        // Each loop to project info
        for (uuid of sort_uuid){
            add_model("prj_card_collect_container", uuid, INIT_PRJ[uuid])
        };
    };
    check_project();
};

// Every check dataset is upload image
function check_project(){
    if ($("#prj_card_collect_container").children().length<1){
        $("#prj_card_collect_container").css("display","none");
        $("#null_project_container").css("display","flex");
        $("#null_project_container").css("margin","20% 40%");
    };
};

///////////////////////////////// ADD BUTTON /////////////////////////////////////
///////////////////////////////// ADD BUTTON /////////////////////////////////////
///////////////////////////////// ADD BUTTON /////////////////////////////////////

// Sort project time
function sort_project(){
    var time = []
    var sort_uuid = []
    // Catch create_time
    $.each(INIT_PRJ, function(uuid, valueObj){
        time.push(`${valueObj["create_time"].toString()}/${uuid}`)
    });
    // Sort
    time.sort();
    // Catch uuid
    for (val of time){
        sort_uuid.push(val.split("/")[1])
    };
    return sort_uuid
};

// Add Card Font
function add_model(element_id, uuid, info) {
    // Get pjname, platform, type, img, effect_num, total_num, iter_num
    let pjname = info["project_name"];
    let platform = info["platform"];
    let type = info["type"];
    let cover_img =  info["cover_img"];
    let effect_num = k_unit(info["effect_img_nums"]);
    let total_num = k_unit(info["total_img_nums"]);
    let iter_num = info["iteration"];

    if (cover_img == ""){
        img_path = "/assets/preset.png"        
    }
    else{
        img_path = SCRIPT_ROOT + cover_img
    }

    // // Loop for descript
    let onclick_val = "dataset&"+uuid+"&"+pjname+"&"+type;
    // Html all code for this card
    h5= `<div class="prj_card prj_card_margin prj_card_container">
            <div id="prj_card_container_${uuid}" onclick="replace_url('${onclick_val}')">
                <div class="prj_name_first_container">           
                    <div id="project_name_${uuid}" class="margin_left_16 prj_name_txt text-truncate text-capitalize">${pjname}</div>
                </div>
                <div id="tag" class="margin_left_16 card_tag_container">
                    <div id="plaform_outside" class="tag_background margin_right_10">
                        <div id="plaform" class="tag_txt text-capitalize">${platform}</div>
                    </div>
                    <div id="type_outside" class="type_background">
                        <div id="type" class="type_txt text-capitalize">${type}</div>
                    </div>
                </div>
                <div id="display_img" class="margin_left_16 display_image_container">
                    <img class="display_image" src=${img_path}>
                </div>
                <div id="info" class="margin_left_16 info_container">
                    <div id="datatset_info" class="info_dm_container margin_right_12">
                        <div class="info_txt">Dataset</div>
                        <div class="info_dm_num_container">
                            <div id="dataset_num" class="info_dm_num_txt">${effect_num}/${total_num}</div>
                        </div>
                    </div>
                    <div id="model_info" class="info_dm_container">
                        <div class="info_txt">Model</div>
                        <div class="info_dm_num_container">
                            <div id="iteration_num" class="info_dm_num_txt">${iter_num}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="more_container">
                <button class="more_button" id="more_btn_${uuid}" data-bs-toggle="dropdown" aria-expanded="false" onclick="onclick_morebtn('${uuid}')">
                    <span id="more_txt_${uuid}" class="material-symbols-outlined">more_horiz</span>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li><a id="rename_prj" class="dropdown-item" onclick="open_rename_mkpopup('${pjname}')">Rename</a></li>
                    <li><a id="delete_prj" class="dropdown-item" onclick="open_delete_mkpopup('${pjname}')">Delete</a></li>
                </ul>
            </div>
        </div>
        `
    // Append to HTML
    $(`#${element_id}`).append(h5).ready(function(){
        // Check project name overflow to marquee
        hover_marquee(`project_name_${uuid}`);
    });
};

// Open create_mkpopup
function open_create_mkpopup(){
    document.getElementById("create_mkpopup").style.display = "block";
    // option
    get_type();
    get_platform();
};

// Close create_mkpopup
function close_create_mkpopup(){
    document.getElementById("create_mkpopup").style.display = "none";
    // clear value
    $("#projectname").val("");
};

// Get type
function get_type(){
    // Clear option
    document.getElementById('type_list').options.length = 0;
    $('#type_list').append(`<option disabled="disabled" selected="selected">Please select one</option>`);

    // Get new type
    let type_list = get_type_api();
    type_list['type'].forEach((val,i) => {
        $('#type_list').append('<option class="text-capitalize" value="' + `${val}` + '">' + `${val}` + '</option>'); 
    });
};

// Get platform
function get_platform(){
    // Clear option
    document.getElementById('platform_list').options.length = 0;
    $('#platform_list').append(`<option disabled="disabled" selected="selected">Please select one</option>`);

    // Get new type
    let platform_list = get_platform_api();
    platform_list['platform'].forEach((val,i) => {
        $('#platform_list').append('<option class="text-capitalize" value="' + `${val}` + '">' + `${val}` + '</option>'); 
    });
};

// Create project
function create_project(){
    let front_param = {
        "project_name": $("#projectname").val(),
        "platform": $("#platform_list").val(),
        "type": $("#type_list").val(),
    };
    let values_list = Object.values(front_param);

    // check front param
    if (values_list.includes("") || values_list.includes("Please select one") || values_list.includes(null)){
        alert("The form is not complete.");
    }
    else{
        data = create_project_api(front_param);
        if (data.includes("new")){
            setTimeout('myrefresh()',500);
        }
        else{
            close_create_mkpopup();
            alert(data["message"]);
        };
    }
};

///////////////////////////////// MORE BUTTON ON CARD /////////////////////////////////////
///////////////////////////////// MORE BUTTON ON CARD /////////////////////////////////////
///////////////////////////////// MORE BUTTON ON CARD /////////////////////////////////////

// More_btn_action
function onclick_morebtn(uuid){
    // Write main uuid
    MAIN_UUID = uuid;
    // Active button
    $(`#more_btn_${uuid}`).addClass("active");
    // Remove active
    $(document).on("click", function(e) {
        // Press action is txt not btn
        if (($(e.target).is(`#more_txt_${uuid}`) === false)){
            $(`#more_btn_${uuid}`).removeClass("active");
            e.stopPropagation();
        };
    });
};

///////////////////////////////// RENAME BUTTON ON CARD /////////////////////////////////////
///////////////////////////////// RENAME BUTTON ON CARD /////////////////////////////////////
///////////////////////////////// RENAME BUTTON ON CARD /////////////////////////////////////

// Open rename_mkpopup
function open_rename_mkpopup(pjname){
    document.getElementById("rename_mkpopup").style.display = "block";
    let pj_name = document.getElementById("project_name");
    pj_name.value = pjname;
};

// Close rename_mkpopup
function close_rename_mkpopup(){
    document.getElementById("rename_mkpopup").style.display = "none";
};

// rename prjname
function rename_prjname(){
    let front_param = {
        "new_name": $("#project_name").val()
    };
    rename_prjname_api(MAIN_UUID, front_param);
};

///////////////////////////////// DELETE BUTTON ON CARD /////////////////////////////////////
///////////////////////////////// DELETE BUTTON ON CARD /////////////////////////////////////
///////////////////////////////// DELETE BUTTON ON CARD /////////////////////////////////////

// Open delete_mkpopup
function open_delete_mkpopup(pjname){
    document.getElementById("delete_mkpopup").style.display = "block";
    $("#delete_label").text($("#delete_label").text() + "\n:\n"+ pjname);
};

// Close rename_mkpopup
function close_delete_mkpopup(){
    document.getElementById("delete_mkpopup").style.display = "none";
    $("#delete_label").text("Delete Project");
};

// Delete prjname
function delete_prjname(){
    delete_project_api(MAIN_UUID);
};
