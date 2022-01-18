var DOMAIN = window.location.origin;
// Replace with a Price for your own product (created either in the Stripe Dashboard or with the API)
// You can also supply a SKU or Plan ID for 

var stripe = Stripe(PUBLISHABLE_KEY);

// Link to the submit buttons
var basicPhotoButtonOneTime = document.getElementById("basic-photo-button-one-time");
var basicPhotoButtonRecurring = document.getElementById("basic-photo-button-recurring");

// Upon loading, update the amount on submit buttons to be the same as the input amount
var inputElOneTime = document.getElementById("quantity-input-one-time");
var inputElRecurring = document.getElementById("quantity-input-recurring");

inputElOneTime.value = INITIAL_AMOUNT;
inputElRecurring.value = INITIAL_AMOUNT;
document.getElementById("total-one-time").textContent = INITIAL_AMOUNT;
document.getElementById("total-recurring").textContent = INITIAL_AMOUNT;

// Set boundary for the amount of donation 
document
  .getElementById("quantity-input-one-time")
  .addEventListener("change", function(evt) {

    // Ensure customers only buy between 1 and 1000 photos
    if (evt.target.value <= MIN_PHOTOS) {
      evt.target.value = MIN_PHOTOS;
      document.getElementById("subtract-one-time").disabled = true;
      document.getElementById("add-one-time").disabled = false;
    }
    if (evt.target.value >= MAX_PHOTOS) {
      evt.target.value = MAX_PHOTOS;
      document.getElementById("subtract-one-time").disabled = false;
      document.getElementById("add-one-time").disabled = true;
    }
    evt.target.value = parseInt(evt.target.value);
    document.getElementById("total-one-time").textContent = parseInt(evt.target.value);
  });

document
  .getElementById("quantity-input-recurring")
  .addEventListener("change", function(evt) {
    // Ensure customers only buy between 1 and 1000 photos
    if (evt.target.value <= MIN_PHOTOS) {
      document.getElementById("subtract-recurring").disabled = true;
      document.getElementById("add-recurring").disabled = false;
      evt.target.value = MIN_PHOTOS;
    }
    if (evt.target.value >= MAX_PHOTOS) {
      document.getElementById("subtract-recurring").disabled = false;
      document.getElementById("add-recurring").disabled = true;
      evt.target.value = MAX_PHOTOS;
    }
    evt.target.value = parseInt(evt.target.value);
    document.getElementById("total-recurring").textContent = parseInt(evt.target.value);
  });

var updateQuantity = function(evt) {
  if (evt && evt.type === "keypress" && evt.keyCode !== 13) {
    return;
  }

  var buttonID = evt.target.id;

  if (buttonID === "add-one-time") {
    quantityOneTime = (parseInt(inputElOneTime.value/INCREMENT_STEP) + 1)*INCREMENT_STEP;
    document.getElementById("subtract-one-time").disabled = false;
    if (quantityOneTime >= MAX_PHOTOS) {
      document.getElementById("add-one-time").disabled = true;
      quantityOneTime = MAX_PHOTOS;
    }
    inputElOneTime.value = quantityOneTime;
    document.getElementById("total-one-time").textContent = quantityOneTime;
  } 

  if (buttonID === "subtract-one-time") {
    quantityOneTime = (MAX_PHOTOS-parseInt(MAX_PHOTOS-inputElOneTime.value/INCREMENT_STEP) - 1)*INCREMENT_STEP;
    document.getElementById("add-one-time").disabled = false;
    if (quantityOneTime <= MIN_PHOTOS) {
      document.getElementById("subtract-one-time").disabled = true;
      quantityOneTime = MIN_PHOTOS;
    }
    inputElOneTime.value = quantityOneTime;
    document.getElementById("total-one-time").textContent = quantityOneTime;
    
  }

  if (buttonID === "add-recurring") {
    quantityRecurring = (parseInt(inputElRecurring.value/INCREMENT_STEP) + 1)*INCREMENT_STEP;
    document.getElementById("subtract-recurring").disabled = false;
    if (quantityRecurring >= MAX_PHOTOS) {
      document.getElementById("add-recurring").disabled = true;
      quantityRecurring = MAX_PHOTOS;
    }
    inputElRecurring.value = quantityRecurring;
    document.getElementById("total-recurring").textContent = quantityRecurring;
  }

  if (buttonID === "subtract-recurring") {
    quantityRecurring = (MAX_PHOTOS-parseInt(MAX_PHOTOS-inputElRecurring.value/INCREMENT_STEP) - 1)*INCREMENT_STEP;
    document.getElementById("add-recurring").disabled = false;
    if (quantityRecurring <= MIN_PHOTOS) {
      document.getElementById("subtract-recurring").disabled = true;
      quantityRecurring = MIN_PHOTOS;
    }
    inputElRecurring.value = quantityRecurring;
    document.getElementById("total-recurring").textContent = quantityRecurring;
  }
};

Array.from(document.getElementsByClassName("increment-btn")).forEach(
  element => {
    element.addEventListener("click", updateQuantity);
  }
);

// Handle any errors from Checkout
var handleResult = function(result) {
  if (result.error) {
    var displayError = document.getElementById("error-message");
    displayError.textContent = result.error.message;
  }
};

// Submit button action for one time donation
basicPhotoButtonOneTime.addEventListener("click", function() {
  var quantityOneTime = parseInt(
    document.getElementById("quantity-input-one-time").value
  );

  // Make the call to Stripe.js to redirect to the checkout page
  // with the current quantity
  stripe
    .redirectToCheckout({
      mode: 'payment',
      lineItems: [{ price: SKU_ID_ONE_TIME, quantity: quantityOneTime }],
      successUrl:
        DOMAIN + '/success.html?session_id={CHECKOUT_SESSION_ID}&checkout_language='+checkoutLanguage,
      cancelUrl: DOMAIN + '/canceled.html?checkout_language='+checkoutLanguage,
      locale: checkoutLanguage,
      billingAddressCollection: 'required',
      submitType: 'donate',
    })
    .then(handleResult);
});

// Submit button action for recurring donation
basicPhotoButtonRecurring.addEventListener("click", function() {
  var quantityRecurring = parseInt(
    document.getElementById("quantity-input-recurring").value
  );

  // Make the call to Stripe.js to redirect to the checkout page
  // with the current quantity
  stripe
    .redirectToCheckout({
      mode: 'subscription',
      lineItems: [{ price: SKU_ID_RECURRING, quantity: quantityRecurring }],
      successUrl:
        DOMAIN + '/success.html?session_id={CHECKOUT_SESSION_ID}&checkout_language='+checkoutLanguage,
      cancelUrl: DOMAIN + '/canceled.html?checkout_language='+checkoutLanguage,
      locale: checkoutLanguage,
      billingAddressCollection: 'required',
      submitType: 'donate',
    })
    .then(handleResult);
});

window.addEventListener("unload", (event) => {
    inputElOneTime.value = INITIAL_AMOUNT;
    inputElRecurring.value = INITIAL_AMOUNT;
});