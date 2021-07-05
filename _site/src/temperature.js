var latest_valid_quantity_from = 0;
var latest_valid_quantity_to = 32;

document.addEventListener("DOMContentLoaded", function () {
    init();
});

function init() {


    var quantity_from = document.getElementById("quantity_from");
    var quantity_to = document.getElementById("quantity_to");

    quantity_from.addEventListener('input', function (event) {
        if (quantity_from.value !== '') {
            latest_valid_quantity_from = quantity_from.value;
            quantity_to.value = +cTof(parseFloat(quantity_from.value)).toFixed(3);
            latest_valid_quantity_to = quantity_to.value;
        }
    }, false);

    quantity_to.addEventListener('input', function (event) {
        if (quantity_to.value !== '') {
            latest_valid_quantity_to = quantity_to.value;
            quantity_from.value = +fToC(parseFloat(quantity_to.value)).toFixed(3);
            latest_valid_quantity_from = quantity_from.value;
        }
    }, false);

    quantity_from.addEventListener('blur', function (event) {
        if (quantity_from.value === '') {
            quantity_from.value = latest_valid_quantity_from;
        }
    }, false);

    quantity_to.addEventListener('blur', function (event) {
        if (quantity_to.value === '') {
            quantity_to.value = latest_valid_quantity_to;
        }
    }, false);
}

function fToC(f) {
    return (f - 32) * (5/9);
}

function cTof(c) {
    return c * (9/5) + 32;
}
