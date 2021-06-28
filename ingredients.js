/* densities, g/ml */
const ingredients_densities = new Map();

const mass_in_grams = new Map();
const volume_in_ml = new Map();

const ingredients_set = new Set();
const units_set = new Set();

var latest_valid_quantity_from = '1';
var latest_valid_ingredient = "all purpose flour";
var latest_valid_unit_from = "gram";
var latest_valid_unit_to = "liter";

document.addEventListener("DOMContentLoaded", function () {
  const myHeaders = new Headers();

  const myRequest = new Request('densities.json', {
    method: 'GET',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default',
  });

  fetch(myRequest)
    .then(response => response.json())
    .then(data => {
      for (let i = 0; i < data.length; i++) {
        ingredients_densities.set(data[i].ingredient.toLowerCase(), parseFloat(data[i].density));
      }
    }).then(() => init());
});

function updateResults() {
  if (!validInput()) {
    return;
  }

  var result_legend = document.getElementById("result_legend");
  var quantity_from = document.getElementById("quantity_from");
  var unit_from = document.getElementById("unit_from");
  var unit_to = document.getElementById("unit_to");
  var ingredient = document.getElementById("ingredient");

  var unit_text_from = unit_from.value;
  if (quantity_from.value != 1) {
    unit_text_from = unit_text_from + "s";
  }
  
  result_legend.innerHTML = quantity_from.value + " " + unit_text_from + " of " + ingredient.value + " is";
  
  var quantity_to = document.getElementById("quantity_to");
  
  var quantity = convert(ingredient.value, unit_from.value, unit_to.value, parseFloat(quantity_from.value));
  var quantity_string = +quantity.toFixed(3);
  
  quantity_to.value = quantity_string;

  var unit_text_to = unit_to.value;
  if (quantity_to.value != 1) {
    unit_text_to = unit_text_to + "s";
  }

  var unit_text = document.getElementById("unit_text");
  unit_text.innerHTML = unit_text_to;
}

function init() {
  initSets();

  populate(document.getElementById("units_from"), units_set);
  populate(document.getElementById("units_to"), units_set);
  populate(document.getElementById("ingredients"), ingredients_set);

  function putValueBackFromPlaceholder(input) {
    if (input.value === '') {
      input.value = input.getAttribute('placeholder');
      input.setAttribute('placeholder', '');
    }
  }

  var inputs = document.getElementById('conversion').getElementsByTagName('input');
  for (var i = 0, input; input = inputs[i++];) {
    putValueBackFromPlaceholder(input);

    if (input.type != 'number') {
      input.addEventListener('mousedown', function (event) {
        var elem = event.target;

        elem.setAttribute('placeholder', elem.value);
        elem.value = '';

      }, true);

      input.addEventListener('mouseleave', function (event) {
        putValueBackFromPlaceholder(event.target)
      }, true);
    }

    input.addEventListener('input', updateResults, true);
  }

  updateResults();

  var quantity_from = document.getElementById("quantity_from");
  var unit_from = document.getElementById("unit_from");
  var unit_to = document.getElementById("unit_to");
  var ingredient = document.getElementById("ingredient");

  quantity_from.addEventListener('blur', function (event) {
    if (quantity_from.value === '') {
      quantity_from.value = latest_valid_quantity_from;
    }
  }, false);

  unit_from.addEventListener('blur', function (event) {
    unit_from.value = unit_from.value.toLowerCase();
    if (!units_set.has(unit_from.value)) {
      unit_from.value = latest_valid_unit_from;
    }
  }, false);

  unit_to.addEventListener('blur', function (event) {
    unit_to.value = unit_to.value.toLowerCase();
    if (!units_set.has(unit_to.value)) {
      unit_to.value = latest_valid_unit_to;
    }
  }, false);

  ingredient.addEventListener('blur', function (event) {
    ingredient.value = ingredient.value.toLowerCase();
    if (!ingredients_set.has(ingredient.value)) {
      ingredient.value = latest_valid_ingredient;
    }
  }, true);

  var paramIngredient = getParameterByName("ingredient");
  var paramUnitFrom = getParameterByName("from");
  var paramUnitTo = getParameterByName("to");
  if (paramIngredient != null) {
    ingredient.value = paramIngredient;
  }
  if (paramUnitFrom != null) {
    unit_from.value = paramUnitFrom; 
  }
  if (paramUnitTo != null) {
    unit_to.value = paramUnitTo;
  }
  updateResults();
}

function copyInput(id) {
  copyText = document.getElementById(id);
  /* Select the text field */
  copyText.select(); 
  copyText.setSelectionRange(0, 99999); /* For mobile devices */

  /* Copy the text inside the text field */
  document.execCommand("copy");
}

function validInput() {
  var quantity_from = document.getElementById("quantity_from");
  var unit_from = document.getElementById("unit_from");
  var unit_to = document.getElementById("unit_to");
  var ingredient = document.getElementById("ingredient");

  var ret = true;

  if (quantity_from.value === '') {
    ret = false;
  } else {
    latest_valid_quantity_from = quantity_from.value;
  }

  if (!units_set.has(unit_from.value)) {
    ret = false;
  } else {
    latest_valid_unit_from = unit_from.value;
  }
  if (!units_set.has(unit_to.value)) {
    ret = false;
  } else {
    latest_valid_unit_to = unit_to.value;
  }
  if (!ingredients_set.has(ingredient.value)) {
    ret = false;
  } else {
    latest_valid_ingredient = ingredient.value;
  }

  return ret;
}

function initSets() {
  for (let key of ingredients_densities.keys()) {
      ingredients_set.add(key);
  }

  mass_in_grams.set("gram", 1);
  mass_in_grams.set("ounce", 28.3495);
  mass_in_grams.set("pound", 453.592);
  mass_in_grams.set("kilogram", 1000);

  volume_in_ml.set("milliliter", 1);
  volume_in_ml.set("centiliter", 10);
  volume_in_ml.set("deciliter", 100);
  volume_in_ml.set("liter", 1000);
  volume_in_ml.set("US gallon", 3785.41);
  volume_in_ml.set("US quart", 946.353);  
  volume_in_ml.set("US pint", 473.176);
  volume_in_ml.set("US cup", 236.588);
  volume_in_ml.set("US fluid ounce", 29.5735);
  volume_in_ml.set("tablespoon", 15);
  volume_in_ml.set("teaspoon", 5);
  volume_in_ml.set("imperial gallon", 4546.09);
  volume_in_ml.set("imperial quart", 1136.52);
  volume_in_ml.set("imperial pint", 568.261);
  volume_in_ml.set("imperial cup", 284.131);
  volume_in_ml.set("imperial fluid ounce", 28.4131);

  for (let key of mass_in_grams.keys()) {
    units_set.add(key);
  }

  for (let key of volume_in_ml.keys()) {
    units_set.add(key);
  }
}

function populate(element, set) {
  var options = '';
  for (let item of set) {
    options += '<option value="' + item + '" />';
  }

  element.innerHTML = options;
}

function convert(ingredient, unit_from, unit_to, quantity) {
  var density = ingredients_densities.get(ingredient);

  if(mass_in_grams.has(unit_to)) {
    if (mass_in_grams.has(unit_from)) {
      var from_g = mass_in_grams.get(unit_from);
      var to_g = mass_in_grams.get(unit_to);

      return quantity * (from_g / to_g);
    } else {
      var from_g = volume_in_ml.get(unit_from) * density;
      var to_g = mass_in_grams.get(unit_to);

      return quantity * (from_g / to_g);
    }
  } else {
    if (mass_in_grams.has(unit_from)) {
      var from_ml = mass_in_grams.get(unit_from) / density;
      var to_ml = volume_in_ml.get(unit_to);

      return quantity * (from_ml / to_ml);
    } else {
      var from_ml = volume_in_ml.get(unit_from);
      var to_ml = volume_in_ml.get(unit_to);

      return quantity * (from_ml / to_ml);
    }
  }
}

function flipUnits() {
  var unit_from = document.getElementById("unit_from");
  var unit_to = document.getElementById("unit_to");
  var temp = unit_from.value;
  unit_from.value = unit_to.value;
  unit_to.value = temp;

  var quantity_from = document.getElementById("quantity_from");
  var quantity_to = document.getElementById("quantity_to");
  quantity_from.value = quantity_to.value;

  updateResults();
}

function preset(ingredient,from,to) {
    var ingred = document.getElementById("ingredient");
    var unit_from = document.getElementById("unit_from");
    var unit_to = document.getElementById("unit_to");

    ingred.value = ingredient
    unit_from.value = from;
    unit_to.value = to;
}

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
