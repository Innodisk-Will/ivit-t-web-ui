///////////////////////////////// INITIAL ITERTAION /////////////////////////////////////
///////////////////////////////// INITIAL ITERTAION /////////////////////////////////////
///////////////////////////////// INITIAL ITERTAION /////////////////////////////////////

// Loading exist iteration
function load_exist_iter(uuid){
    FOlDER_LIST = get_dataset_api(uuid);
    // Get total of added div
    let total = 6;
    // Create 6 div
    let html = iter_btn_html(total)
    
    // Append to HTML
    $("#iter_container").append(html).ready(function(){
        // Check url and other action
        check_url_iter(total);
    });

    // Add model btn action and check iteration folder is exist
    if (FOlDER_LIST["folder_name"].length<2){
        $("#model_href").removeAttr( 'href' );
    }
    else{
        // Model change url
        let iteration = model_btn_url(FOlDER_LIST["folder_name"].length);
        let model_href = $("#model_href").attr("href")+iteration;
        $("#model_href").attr("href", model_href);
        // Dataset change url
        let d_iteration = dataset_btn_url();
        let dataset_href = $("#dataset_href").attr("href")+d_iteration;
        $("#dataset_href").attr("href", dataset_href);
    };
};

// Setting model iteration url
function model_btn_url(folder_len){
    // Setting model url
    if (folder_len>1 & ITER_NAME == undefined){
        iteration = `&iteration${folder_len-1}`;
    }
    else if (ITER_NAME != undefined){
        iteration = `&${ITER_NAME}`;
    }
    else{
        iteration = "";
    };
    return iteration;
};

// Setting dataset iteration url
function dataset_btn_url(){
    // Setting dataset url
    if (ITER_NAME != undefined){
        iteration = `&${ITER_NAME}`;
    }
    else{
        iteration = "";
    };
    return iteration;
};

// Html of iteration
function iter_btn_html(total){
    let html = "";
    // Create 6 div
    for (let num = 0; num<total; num++){
        // Element
        let h5=`
                <div id="iter_${num}" class="iter_btn_container">
                    <a id="iteration_${num}" class="iter_btn_other_txt labeltip_start" href=""></a>
                </div>
                `;
        html = html.concat(h5);
    };

    return html
};

///////////////////////////////// URL CORRESPONDING SET /////////////////////////////////////
///////////////////////////////// URL CORRESPONDING SET /////////////////////////////////////
///////////////////////////////// URL CORRESPONDING SET /////////////////////////////////////

// Check iteration of url, then change txt opt and font-width
function check_url_iter(total){
    // Get total_child length
    let iter_len= FOlDER_LIST["folder_name"].length;

    // Check iteration of url
    if (ITER_NAME != undefined){
        // Get iter number
        let iter_num = parseInt(ITER_NAME.split("iteration")[1]);
        fill_iter_div(iter_len, iter_num, total);
    }
    else{
        fill_iter_div(iter_len, 0, total);
        // Show W css
        if (MAIN_PAGE=="dataset"){
            iter_light_dark(`iteration_0`, "light");
        };
    };
};

///////////////////////////////// PAGE MODEL/DATASET ITERATION BUTTON PROCESS /////////////////////////////////////
///////////////////////////////// PAGE MODEL/DATASET ITERATION BUTTON PROCESS /////////////////////////////////////
///////////////////////////////// PAGE MODEL/DATASET ITERATION BUTTON PROCESS /////////////////////////////////////

// Fill iteration key in div
function fill_iter_div(iter_len, iter_num, total){
    // Get goal set(compute iter and total multiple)
    let multiple = parseInt(iter_num/total);
    // Fill iteration btn
    if (MAIN_PAGE == "dataset"){
        dataset_iter_btn(multiple, iter_len, iter_num, total);
    }
    else{
        if (ITER_NAME != undefined){
            model_iter_btn(multiple, iter_len, iter_num, total);
        };
    };
};

// Dataset fill method
function dataset_iter_btn(multiple, iter_len, iter_num, total){
    if (multiple==0){
        $(`#iteration_0`).text("W");
        $("#iteration_0").attr("href", MAIN_HREF);
        add_tooltip("iteration_0", "Workspace");
        for (let i = 1; i < total+1; i++){
            if (i < iter_len){
                $(`#iteration_${i}`).text(i);
                $(`#iteration_${i}`).attr("href", MAIN_HREF+`&iteration${i}`);
                add_tooltip(`iteration_${i}`, `iteration${i}`);
                // Change main text
                change_main_div(i, iter_num, i);
            };
        };
    }
    else{
        for (let i = 0; i < total; i++){
            let show_iter = i+(total*multiple)
            if (show_iter < iter_len){
                $(`#iteration_${i}`).text(show_iter);
                $(`#iteration_${i}`).attr("href", MAIN_HREF+`&iteration${show_iter}`);
                add_tooltip(`iteration_${i}`, `iteration${show_iter}`);
                // Change main text
                change_main_div(show_iter, iter_num, i)
            };
        };
        // Show expand_less
        $("#expand_less").css("visibility","visible");
    };

    // Show expand_more
    let show_last_iter = $("#iteration_5").text();
    if (show_last_iter != "" & iter_len - parseInt(show_last_iter) > 0){
        $("#expand_more").css("visibility","visible");
    };
};

// Model fill method
function model_iter_btn(multiple, iter_len, iter_num, total){
    // Stauts: iter_num % total == 0 
    if (parseInt(iter_num)%parseInt(total)==0){
        for (let i = 0; i < total; i++){
            let show_iter = parseInt(i+(parseInt(iter_num)-parseInt(total))+1);
            if (show_iter < iter_len){
                $(`#iteration_${i}`).text(show_iter);
                $(`#iteration_${i}`).attr("href",MAIN_HREF+`&iteration${show_iter}`);
                add_tooltip(`iteration_${i}`, `iteration${show_iter}`);
                // Change main text
                change_main_div(show_iter, iter_num, i)
            };
        };
        if (parseInt(iter_num) < iter_len){
            // Change main text
            change_main_div(parseInt(iter_num), iter_num, parseInt(iter_num));
        };
    }
    else{
        for (let i = 0; i < total; i++){
            let show_iter = parseInt(i+(total*multiple))+1;
            if (show_iter < iter_len){
                $(`#iteration_${i}`).text(show_iter);
                $(`#iteration_${i}`).attr("href",MAIN_HREF+`&iteration${show_iter}`);
                add_tooltip(`iteration_${i}`, `iteration${show_iter}`);
                // Change main text
                change_main_div(show_iter, iter_num, i)
            };
        };
    };

    // Show expand_more
    let show_last_iter = $("#iteration_5").text().split("iteration")[0];
    if (show_last_iter != "" & (iter_len-1) - parseInt(show_last_iter) > 0){
        $("#expand_more").css("visibility","visible");
    };
    // Show expand_less
    let show_first_iter = $("#iteration_0").text().split("iteration")[0];
    if (show_first_iter != "1"){
        $("#expand_less").css("visibility","visible");
    }
    // Hide expand_more
    if (multiple > 3){
        $("#expand_more").css("visibility","hidden");
    };  
};

// Add tooltip html
function add_tooltip(id, val){
    $(`#${id}`).append(`<span class="labeltip_text standard_font_txt">${val}</span>`);
};

///////////////////////////////// MAIN ITERATION BUTTON CSS /////////////////////////////////////
///////////////////////////////// MAIN ITERATION BUTTON CSS /////////////////////////////////////
///////////////////////////////// MAIN ITERATION BUTTON CSS /////////////////////////////////////

// Change main div opacity/font-weight
function change_main_div(show_iter, iter_num, idx){
    if ( show_iter == iter_num){
        iter_light_dark(`iteration_${idx}`, "light");
    }
    else{
        iter_light_dark(`iteration_${idx}`, "dark");
    };
};

// Change iter css
function iter_light_dark(id, key){
    if (key=="light"){
        $(`#${id}`).css("opacity","1");
        $(`#${id}`).css("font-weight","500");
        $(`#${id}`).css("border-radius","11px");
        $(`#${id}`).css("color","#FFF");
        $(`#${id}`).css("background","#E61F23 0% 0% no-repeat padding-box");
    }
    else{
        $(`#${id}`).removeAttr("style");
        // $(`#${id}`).css("font-weight","400");
    };
};

///////////////////////////////// EXPAND BUTTON ACTION /////////////////////////////////////
///////////////////////////////// EXPAND BUTTON ACTION /////////////////////////////////////
///////////////////////////////// EXPAND BUTTON ACTION /////////////////////////////////////

// Expand_more buttion action
function expand_btn(key){
    let show_first_txt = $("#iteration_0").text().split("Workspace")[0];
    let total = 6;
    let iter_len= FOlDER_LIST["folder_name"].length;
    // Fill iteration btn
    if (MAIN_PAGE == "dataset"){
        dataset_expand_action(key, show_first_txt, total, iter_len);
    }
    else{
        model_expand_action(key, show_first_txt, total, iter_len);
    };

};

///////////////////////////////// PAGE MODEL/DATASET EXPAND BUTTON PROCESS /////////////////////////////////////
///////////////////////////////// PAGE MODEL/DATASET EXPAND BUTTON PROCESS /////////////////////////////////////
///////////////////////////////// PAGE MODEL/DATASET EXPAND BUTTON PROCESS /////////////////////////////////////

// Dataset expand action
function dataset_expand_action(key, show_first_txt, total, iter_len){
    if (key=="more"){
        // Dataset expand more action
        if (show_first_txt == "W"){
            // dataset_iter_btn(1, iter_len, total, total);
            window.location.replace(MAIN_HREF+"&"+`iteration${total}`);
        }
        // Dataset expand more action
        else if (parseInt(show_first_txt)%total == 0){
            // Get goal set(compute iter and total multiple)
            let multiple = parseInt(parseInt(show_first_txt)/total);
            // dataset_iter_btn((multiple+1), iter_len, (multiple+1)*total, total);
            window.location.replace(MAIN_HREF+"&"+`iteration${((multiple+1)*total)}`);
        };
    }
    else{
        // Dataset expand less action
        if (parseInt(show_first_txt)%total == 0){
            // Get goal set(compute iter and total multiple)
            let multiple = parseInt(parseInt(show_first_txt)/total);
            if (multiple==1){
                // dataset_iter_btn(0, iter_len, 0, total);
                window.location.replace(MAIN_HREF);
            }
            else{
                // dataset_iter_btn((multiple-1), iter_len, (multiple-1)*total, total);
                window.location.replace(MAIN_HREF+"&"+`iteration${((multiple-1)*total)}`);
            };
        };
    };
};

// Model expand action
function model_expand_action(key, show_first_txt, total, iter_len){
    // Dataset expand more action
    if (key == "more"){
        // Get goal set(compute iter and total multiple)
        let multiple = parseInt(parseInt(show_first_txt)/total);
        // model_iter_btn((multiple+1), iter_len, ((multiple+1)*total)+1, total);
        window.location.replace(MAIN_HREF+"&"+`iteration${((multiple+1)*total)+1}`);
    }
    // Dataset expand less action
    else{
        // Get goal set(compute iter and total multiple)
        let multiple = parseInt(parseInt(show_first_txt)/total);
        console.log(multiple)
        // model_iter_btn((multiple-1), iter_len, ((multiple-1)*total)+1, total);
        window.location.replace(MAIN_HREF+"&"+`iteration${((multiple-1)*total)+1}`);
    };
};