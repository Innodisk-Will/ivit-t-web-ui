///////////////////////////////// POPUP ACTION /////////////////////////////////////
///////////////////////////////// POPUP ACTION /////////////////////////////////////
///////////////////////////////// POPUP ACTION /////////////////////////////////////

// Open upload_mkpopup
function open_upload_mkpopup(){
    document.getElementById("upload_mkpopup").style.display = "block";
    // option
    drop_folder_file();
    // Get value
    sel_action("cls_name");
    // Get global variable
    UPLOAD_TEMP = $("#upload_outside_container");
};

// Close upload_mkpopup
function close_upload_mkpopup(){
    document.getElementById("upload_mkpopup").style.display = "none";
    // Clean input name
    $("#cls_name").val("");
    // Clean option
    $("#classes_list_main").html("");
    // // Preset panel->file
    // switch_folder_file(null);
    // Refresh panel
    setTimeout('myrefresh()',50);
};

///////////////////////////////// CHANGE FOLDER OR FILE ACTION /////////////////////////////////////
///////////////////////////////// CHANGE FOLDER OR FILE ACTION /////////////////////////////////////
///////////////////////////////// CHANGE FOLDER OR FILE ACTION /////////////////////////////////////

// Switch folders or files
function switch_folder_file(key){
    if (key=="folder"){
        // Give css
        $("#upload_folder").css("border-bottom","1px solid #000");
        $("#upload_folder").css("opacity","1");
        $("#upload_file").css("border-bottom","0px");
        $("#upload_file").css("opacity","0.24");
        // Class_form/upload_container_file hide
        $("#cls_form").css("display","none");
        $("#upload_container_file").css("display","none");
        // upload_container_folder show
        $("#upload_container_folder").removeAttr("style","display: none;");
        // Change html----->抓不到
        // option
        drop_folder_file("folder");
    }
    else{
        if (TYPE_NAME == "classification"){
            // Browse btn show
            $("#cls_form").removeAttr("style","display: none;");
        };
        // Give css
        $("#upload_file").css("border-bottom","1px solid #000");
        $("#upload_file").css("opacity","1");
        $("#upload_folder").css("border-bottom","0px");
        $("#upload_folder").css("opacity","0.24");
        // upload_container_folder hide
        $("#upload_container_folder").css("display","none");
        // upload_container_file show
        $("#upload_container_file").removeAttr("style","display: none;");
        // option
        drop_folder_file();
    };
};

// Check type for mkpopup class form
function check_type_class_form(){
    if (TYPE_NAME == "object_detection"){
        $("#cls_form").css("display","none");
    };
};

///////////////////////////////// ADD UPLOAD LISTENER /////////////////////////////////////
///////////////////////////////// ADD UPLOAD LISTENER /////////////////////////////////////
///////////////////////////////// ADD UPLOAD LISTENER /////////////////////////////////////

// Drop folder and file
function drop_folder_file(key=null){
    // Catch id
    let catch_id = $("#upload_outside_container div[style*='display: none;']")[0]["id"].split("container_")[1]
    if (catch_id == "folder"){
        id_name = "file"
    }
    else{
        id_name = "folder"
    };
    const drop_container = document.getElementById(`drop_container_${id_name}`);
    // Button event
    $(`#chose_${id_name}`).on("change", function(){
        if (TYPE_NAME == "classification" && key == null){
            if ($("#cls_name").val() != ""){
                const files = $(`input[id="chose_${id_name}"]`).get(0).files;
                overview_prograss(files);
            }
            else{
                alert("Not yet filling in the class name!!");
                $(`#chose_${id_name}`).val("");
            };
        }
        else{
            const files = $(`input[id="chose_${id_name}"]`).get(0).files;
            overview_prograss(files);
        };
    });

    // Drop event
    drop_container.addEventListener("drop", async (event) => {
        event.preventDefault();
        // Drop every file scan type and solve content (await list finish)
        if (TYPE_NAME == "classification" && key == null){
            if($("#cls_name").val() != ""){
                const files = await scan_files(event, key);
                if (!files[0]){
                    return
                };
                overview_prograss(files);
            }
            else{
                alert("Not yet filling in the class name!!")
            };
        }
        else{
            const files = await scan_files(event, key);
            if (!files[0]){
                return
            };
            overview_prograss(files);
        };
    });

    drop_container.addEventListener("dragover", event => {
        event.preventDefault();
    });
};

///////////////////////////////// CHECK UPLOAD FILE /////////////////////////////////////
///////////////////////////////// CHECK UPLOAD FILE /////////////////////////////////////
///////////////////////////////// CHECK UPLOAD FILE /////////////////////////////////////

// Drop action -> Scan all file/folder
async function scan_files(e, key) {
    e.preventDefault();
    // Data transfer object
    let { items = [], files = [] } = e.dataTransfer

    // Obejct convert array, then use map to await finish every item
    const promises = Array.from(items).map(async item =>{
        const entry = item.webkitGetAsEntry()
        // check every item is file or dir, is dir await function
        let fileofdir = null;

        if (key == "folder"){
            fileofdir = entry.isFile ? files : await get_entry_directory_files(entry);
        }
        else{
            fileofdir = entry.isFile ? files : error_upload();
        }

        return fileofdir
    })

    // Solve every promise
    const fileofdir = await Promise.all(promises)
    return fileofdir
};

// isFile upload folder error 
function error_upload(){
    alert("Please upload files.")
    return false
}

// Drop action -> Get files in a folder
function get_entry_directory_files(entry) {
    const reader = entry.createReader();
    // Only read up to 100 at a time to prevent too many files in the folder, and add a variable to collect the latest results
    let res = [entry.name];
    return read();
  
    async function read() {
        const files = await new Promise((resolve, reject) =>
            reader.readEntries((entries) => {
                // Upload only one layer of files, filter the folders contained in the folder
                const fileEntries = entries.filter((entry) => entry.isFile);
                const filesPromise = fileEntries.map((entry) => new Promise((resolve) => entry.file((file) =>{
                    if ((file.type.includes("image"))|(file.type == "text/plain")){
                        resolve(file);
                    }
                    else{
                        alert(`This file can't upload-Filename:[${file.name}], Type:[${file.type}]`);
                        resolve(null);
                    };
                    })));
                Promise.all(filesPromise).then(resolve, reject);
            }, reject)
        );
      // Save the currently read file
      res = [...res, ...files];
      
      // Chrome browser can read up to 100 files at a time,
      // more than 100 files need to be read again
      if (files.length < 100) {
        return res;
      }
        return read();
    };
};

///////////////////////////////// CHANGE PROGRESS PANEL /////////////////////////////////////
///////////////////////////////// CHANGE PROGRESS PANEL /////////////////////////////////////
///////////////////////////////// CHANGE PROGRESS PANEL /////////////////////////////////////

// Transition and overview prograss bar
function overview_prograss(files){
    // Change panel
    html = `
            <div id="upload_container" class="upload_container">
                <div id="drop_container" class="drop_overview_container">
                    <div class="overview_container">
                        <div class="upload_name">
                            <lable class="standard_font_txt">Name</lable>
                        </div>
                        <div class="upload_prograss">
                            <lable class="standard_font_txt">Prograss bar</lable>
                        </div>
                    </div>
                    <div id="prograss_container" class="pg_container"></div>
                </div>
                <div id="loader_container" class="loader_container"><div class="loader">Loading...</div></div>
            </div>
            `
    // Save class html
    let old_children = $("#upload_outside_container").children()[1]
    // Clean panel build new html
    $("#upload_outside_container").html(html).ready(function(){
        check_files(files);
    });
    // Give class html
    if (TYPE_NAME=='classification'){
        $("#upload_outside_container").append(old_children);
    };
};

///////////////////////////////// CHECK UPLOAD ACTION /////////////////////////////////////
///////////////////////////////// CHECK UPLOAD ACTION /////////////////////////////////////
///////////////////////////////// CHECK UPLOAD ACTION /////////////////////////////////////

// Check upload dataset
function check_files(files){
    // Drop action
    if (Array.isArray(files)){
        // Remove repeat list
        files = files.filter(function(element, index, arr){
            return arr.indexOf(element) === index;
        });
        // Compute upload numbers
        TOTAL_UPLOAD = files.length;
        // Parse the internal data of promise
        for (let i = 0; i<files.length; i++){
            // Folder            
            if (Array.isArray(files[i])){
                // console.log("Array:",files[i])
                TOTAL_UPLOAD = drop_folder_upload(files, i, TOTAL_UPLOAD)
            }
            // file
            else{
                // console.log("not Array:",files[i])
                TOTAL_UPLOAD = drop_file_upload(files, i, TOTAL_UPLOAD);
            };
            // Scroll in bottom
            var messageBody = document.querySelector('#prograss_container');
            messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
        };
    }
    // Button action
    else{
        button_file_upload(files);

        // Scroll in bottom
        var messageBody = document.querySelector('#prograss_container');
        messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
    };
};

///////////////////////////////// UPLOAD ACTION /////////////////////////////////////
///////////////////////////////// UPLOAD ACTION /////////////////////////////////////
///////////////////////////////// UPLOAD ACTION /////////////////////////////////////

// Use drop to upload folder
function drop_folder_upload(files, i, TOTAL_UPLOAD){
    if (files[i].length>1){
        // Filter null and other file
        files[i] = files[i].filter((file)=> { return (file != null) })
        files[i] = files[i].filter((file)=> { 
            // Check file is null
            if (file.size === 0){
                // alert(` The size of ${file.name} is 0.`)
                console.log(` The size of ${file.name} is 0.`)
            };
            // Check file is type
            if (file.type != undefined){
                return (((typeof file === 'string')|(file.type.includes("image"))|(file.type=="text/plain")) && (file.size !== 0)) 
            }
            else{
                return ((typeof file === 'string') && (file.size !== 0)) 
            };
        });

        // Append prograssbar
        add_prograssbar(files[i][0], i, files[i].length-1);
        // Upload
        for (let j = 1;j < files[i].length;j++){
            // Create upload info(Dic[folder name])
            let dic = {}
            dic[files[i][0]] = files[i][j];
            // Too large files then waitting
            await_upload(dic, i, files[i].length-1);
        };
    }
    else{
        alert(`The architecture of ${files[i][0]}  is not folder/file.`)
        // Exclude
        TOTAL_UPLOAD -= 1
    };

    return TOTAL_UPLOAD
};

// Use drop to upload file
function drop_file_upload(files, i, TOTAL_UPLOAD){
    for (let file of files[i]){
        // Check file is null    
        if (file.size === 0){
            // alert(` The size of ${file.name} is 0`)
            console.log(` The size of ${file.name} is 0.`)
            // Exclude
            TOTAL_UPLOAD -= 1
        };

        // Remove folder
        if (((file.type.includes("image")) | (file.type == "text/plain")) && (file.size !== 0)){
            // Append prograssbar
            add_prograssbar(file.name, Object.values(files[i]).indexOf(file), 1);
            // Create upload info(Dic[folder name])
            let dic = {};
            if( $("#cls_name").length>0){
                dic[$("#cls_name").val()] = file;
            }
            else{
                dic["Unlabeled"] = file;
            };
            // Too large files then waitting
            await_upload(dic, Object.values(files[i]).indexOf(file), 1);
        }
        else{
            // Exclude
            TOTAL_UPLOAD -= 1
            alert(`This file can't upload-Filename:[${file.name}], Type:[${file.type}]`)
        };
    };
    return TOTAL_UPLOAD
};

// Use button to upload files
function button_file_upload(files){
    // Compute to upload numbers
    let relative_path = files[0].webkitRelativePath;
    TOTAL_UPLOAD = files.length

    for(const [index, [name, value]] of Object.entries(Object.entries(files))){
        // Append prograssbar
        add_prograssbar(value.name, index, 1);
        // Create upload info(Dic[folder name])
        let dic = {};
        if( $("#cls_name").length>0){
            dic[$("#cls_name").val()] = value;
        }
        else if (relative_path!= "" & TYPE_NAME == "classification"){
            // Folder upload
            dic[relative_path.split("/")[0]] = value;
        }
        else{
            dic["Unlabeled"] = value;
        };
        // Too large files then waitting
        await_upload(dic, index, 1)
    };
};

///////////////////////////////// ADD PROGRASS BAR /////////////////////////////////////
///////////////////////////////// ADD PROGRASS BAR /////////////////////////////////////
///////////////////////////////// ADD PROGRASS BAR /////////////////////////////////////

// Append prograss bar in overview
function add_prograssbar(name, i, length){
    // Remove loading
    if ($("#loader_container").length>0){
        remove_loader("upload_container");
    };
    // Append html to container
    prograss = `
                    <div class="upload_lr_container">
                        <div class="upload_name_container text-truncate">
                            <lable class="form_item_font">${name}</lable>
                        </div>
                        <div class="upload_pg_container">
                            <progress id="progressbar_${i}" class="upload_pg_image" value="0" max="${length}"></progress>
                            <lable id="progress_${i}" class="standard_font_txt">0%</lable>
                        </div>
                    </div>
                `;
    $("#prograss_container").append(prograss);
};

///////////////////////////////// UPLOAD TO BACKEND /////////////////////////////////////
///////////////////////////////// UPLOAD TO BACKEND /////////////////////////////////////
///////////////////////////////// UPLOAD TO BACKEND /////////////////////////////////////

// Upload files allow waiting
async function await_upload(file, dir_idx, length){
    // while (UPLOAD_COUNT){
    //     await sleep(1000);
    // };
    await sleep(1000);
    upload(file, dir_idx, length);
};

// Wait time
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
};

// Upload file
function upload(file, dir_idx, length){
    var formData = new FormData();
    formData.append(Object.keys(file)[0], Object.values(file)[0]);
    UPLOAD_COUNT += 1;
    let upload_info = upload_api(MAIN_UUID, formData);

    if (upload_info["status"] == 200){
        // Progress bar add number
        $(`#progressbar_${dir_idx}`).val($(`#progressbar_${dir_idx}`).val()+1);
        console.log($(`#progressbar_${dir_idx}`).val())
        // Upload porgress add number % (txt)
        $(`#progress_${dir_idx}`).text(Math.round(($(`#progressbar_${dir_idx}`).val()/length)*100)+"%");
        console.log(Math.round(($(`#progressbar_${dir_idx}`).val()/length)*100)+"%")
        // Finish change text to "UPLOADED"
        if ($(`#progressbar_${dir_idx}`).val() == length){
            $(`#progress_${dir_idx}`).text("UPLOADED!")
        };
        // Decrease count
        UPLOAD_COUNT -= 1; 
        // Check files is finish
        if (($(`#prograss_container`).html().match(/UPLOADED!/g)|| []).length == TOTAL_UPLOAD){
            $("#dataset_create").prop('disabled', false);
        };
        // if upload progress success hide cancel
        $("#cancel_btn").css("visibility","hidden");
        $("#mkpop_upload_btn").removeAttr("disabled");
    }
    else{
        alert(upload_info["message"]);
    };
};

///////////////////////////////// UPLOAD BUTTON/////////////////////////////////////
///////////////////////////////// UPLOAD BUTTON/////////////////////////////////////
///////////////////////////////// UPLOAD BUTTON/////////////////////////////////////

// Upload btn action
function upload_create(){
    // Refresh backend parameter
    init_prj_api();
    // Refresh panel
    setTimeout('myrefresh()',100);
};