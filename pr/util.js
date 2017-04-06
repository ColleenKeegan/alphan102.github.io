var timeoutID1;
var timeoutID2;


/**
 * Prints the given error message.
 * @param {string} msg - The error message to print.
 */
function error(msg) {
  let element = document.createElement('pre');
  element.innerHTML = msg;
  element.className = 'error';
  document.getElementById('msg').appendChild(element);
  window.setTimeout(function() {
    element.innerHTML = '';
    element.className = '';
  }, 4000);
}

/**
 * Prints the given informational message.
 * @param {string} msg - The information message to print.
 */
function info(msg) {
  let element = document.createElement('pre');
  element.innerHTML = msg;
  element.className = 'info';
  document.getElementById('msg').appendChild(element);
  window.setTimeout(function() {
    element.innerHTML = '';
    element.className = '';
  }, 4000);
}

/**
 * Converts an address object into a dictionary.
 * @param {PaymentAddress} addr - The address to convert.
 * @return {object} The resulting dictionary.
 */
function toDictionary(addr) {  // eslint-disable-line no-unused-vars
  let dict = {};
  if (addr) {
    if (addr.toJSON) {
      return addr;
    }
    dict.country = addr.country;
    dict.region = addr.region;
    dict.city = addr.city;
    dict.dependentLocality = addr.dependentLocality;
    dict.addressLine = addr.addressLine;
    dict.postalCode = addr.postalCode;
    dict.sortingCode = addr.sortingCode;
    dict.languageCode = addr.languageCode;
    dict.organization = addr.organization;
    dict.recipient = addr.recipient;
    dict.phone = addr.phone;
  }
  return dict;
}

function showResp(resp) {  // eslint-disable-line no-unused-vars
  if (resp.toJSON) {
    info(JSON.stringify(resp, undefined, 2));
    return;
  }

  let shippingOption = resp.shippingOption ?
      'shipping, delivery, pickup option: ' + resp.shippingOption + '<br/>' :
      '';

  let shippingAddress = resp.shippingAddress ?
      'shipping, delivery, pickup address: ' +
          JSON.stringify(toDictionary(resp.shippingAddress), undefined, 2) +
          '<br/>' :
      '';

  let instrument =
      'instrument:' + JSON.stringify(resp.details, undefined, 2) + '<br/>';

  let method = 'method: ' + resp.methodName + '<br/>';
  let email = resp.payerEmail ? 'email: ' + resp.payerEmail + '<br/>' : '';
  let phone = resp.payerPhone ? 'phone: ' + resp.payerPhone + '<br/>' : '';
  let name = resp.payerName ? 'name: ' + resp.payerName + '<br/>' : '';


  info(email + phone + name + shippingOption + shippingAddress + method +
      instrument);
}

/**
 * Called when the payment request is complete.
 * @param {string} message - The human readable message to display.
 * @param {PaymentResponse} resp - The payment response.
 */
function done(message) {  // eslint-disable-line no-unused-vars
  let element = document.getElementById('contents');
  element.innerHTML = message;
}
