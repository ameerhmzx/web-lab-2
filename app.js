const server_url = 'https://usman-recipes.herokuapp.com/api/products/';

// OnLoad
$(() => {
    getProducts(function (products) {
        if (products != undefined) {
            console.log(products);
            products.forEach(product => {
                addRow(product);
            });
        }
    });

    $('#close-overlay').click(closeOverlay);
    $('#prodForm').submit(onSubmit);
    $('#addButton').click(onAddClicked);

    /// Snackbar Overlay
    $('body').append($("<div>", { id: "snackbar-overlay", style: "padding: 32px; display:flex; flex-direction: column-reverse; position: fixed; width: 100vw; height: 100vh; top: 0; left: 0; pointer-events:none;" }));
});

// Snackbars
function Snackbar(data) {
    if (data.type == undefined) data.type = 'primary';
    var snack = $('<div>', { class: `p-absolute alert alert-${data.type} alert-dismissible fade show pointer-events:auto;`, 'role': "alert" });
    snack.html(data.msg);
    $('#snackbar-overlay').append(snack);
    if (data.duration == undefined) {
        setTimeout(() => snack.alert('close'), 2000);
    } else if (data.duration > 0) {
        setTimeout(() => snack.alert('close'), data.duration);
    }
}

// Loading bar
loadingEL = $(`<div id="loading-anim" class="fixed-top left-0 W-100"><div class="w-100 progress-bar progress-bar-striped progress-bar-animated" style="height: 4px;"></div></div>`)
function ShowLoading() {
    $('body').append(loadingEL);
}

function DoneLoading() {
    loadingEL.remove();
}


// APIs
function getProducts(onSuccess) {
    ShowLoading();
    $.getJSON(server_url, (result) => {
        Snackbar({
            msg: "Products Loaded!",
            type: "success"
        });
        onSuccess(result);
    }).fail(() =>
        Snackbar({
            msg: "<strong>Something went wrong!</strong> Try reloading",
            type: "danger",
            duration: 0
        })
    ).always(DoneLoading);
}

function getProduct(id, onSuccess) {
    ShowLoading();
    $.getJSON(`${server_url}${id}`, onSuccess).fail(() =>
        Snackbar({
            msg: "<strong>Something went wrong!</strong> Try again",
            type: "danger",
        })
    ).always(DoneLoading);
}

function addProduct(product, onSuccess) {
    ShowLoading();
    $.post(server_url, product, onSuccess).fail(() =>
        Snackbar({
            msg: "<strong>Something went wrong!</strong> Try again",
            type: "danger",
        })
    ).always(DoneLoading);
}

function updateProduct(id, product, onSuccess) {
    ShowLoading();
    $.ajax({
        type: "put",
        url: server_url+id,
        data: product,
        success: function (response) {
            onSuccess(response);
        }
    }).fail(function () {
        Snackbar({
            msg: "<strong>Something went wrong!</strong> Try again",
            type: "danger",
            duration: 0
        });
        closeOverlay();
    }
    ).always(DoneLoading);
}

function deleteProduct(id, onSuccess) {
    ShowLoading();
    $.ajax({
        type: "delete",
        url: server_url+id,
        success: function (response) {
            onSuccess(response);
        }
    }).fail(() =>
        Snackbar({
            msg: "<strong>Something went wrong!</strong> Try again",
            type: "danger",
            duration: 0
        })
    ).always(DoneLoading);
}

// UI data 
function addRow(product) {
    var row = $('<div>', { 'id': product._id, 'class': 'product p-4 col-12 col-md-6' });
    row.html(`
                <div class="bg-light rounded-lg overflow-hidden shadow-sm p-4">
                    <div class="d-flex align-items-center justify-content-between">
                        <h3>${product.name}</h3>
                        <div class="ml-2 d-flex align-items-center">
                            <button onClick="onUpdateClicked('${product._id}')" type="button" class="btn btn-primary rounded-lg align-self-end">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                                    class="bi bi-pencil-fill p-1" viewBox="0 0 16 16">
                                    <path
                                        d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                                </svg>
                            </button>
                            <button onClick="onDeleteClicked('${product._id}')" type="button" class="btn btn-danger ml-1 rounded-lg align-self-end">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                                    class="bi bi-trash-fill p-1" viewBox="0 0 16 16">
                                    <path
                                        d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <p>${product.department}</p>
                    <p>${product.description}</p>
                    <div class="d-flex justify-content-between">
                        <p class="mb-0">${product.color}</p>
                        <p class="text-success pr-2 mb-0">${product.price}</p>
                    </div>
                </div>
    `);
    $("#products-grid").append(row);
}

function onDeleteClicked(id) {
    deleteProduct(id, (deleted) => {
        $(`#${deleted._id}`).remove();
        Snackbar({
            msg: "Product Deleted Sucessfully!",
            type: "success"
        });
    });
}

function onUpdateClicked(id){
    getProduct(id, (product) => {
        $('#prodForm').trigger("reset");
        $('#_id').val(product._id);
        $('#name').val(product.name);
        $('#description').val(product.description);
        $('#price').val(product.price);
        $('#department').val(product.department);
        $('#color').val(product.color);
        $('#overlay').removeClass('d-none').addClass('d-flex');
    });
}

function onAddClicked(){
    $('#prodForm').trigger("reset");
    $('#_id').val("");
    $('#overlay').removeClass('d-none').addClass('d-flex');
}

function onSubmit(e){
    isUpdating = $('#prodForm #_id').val() != "";
    data = $('#prodForm').serialize();
    
    if(isUpdating){
        updateProduct($('#prodForm #_id').val(), data, (product) => {
            $(`#${product._id}`).remove();
            addRow(product);
            closeOverlay();
        });
    } else {
        addProduct(data, (product) => {
            addRow(product);
            closeOverlay();
        });
    }
    
    e.preventDefault();
}

function closeOverlay(){
    $('#overlay').removeClass('d-flex').addClass('d-none');
}