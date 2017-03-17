/* global done:false */
/* global error:false */
/* global PaymentRequest:false */

var Round = 1;

var supportedInstruments = [{}]; //[{supportedMethods:[]}];

var details = {
  total: {
    label: 'Donation',
    amount: {
      currency: 'USD',
      value: '-55.00'
    }
  },
  displayItems: [{
    label: 'Original donation amount',
    amount: {
      currency: 'USD',
      value: '-65.00'
    }
  }, {
    label: 'Friends and family discount',
    amount: {
      currency: 'USD',
      value: 'aaa10.00'
    }
  }],
  modifiers: [{
    supportedMethods: ['visa'],
    total: {
      label: 'Discounted donation',
      amount: {
        currency: 'USD',
        value: '45.00'
      }
    },
    additionalDisplayItems: [{
      label: 'VISA discount',
      amount: {
        currency: 'USD',
        value: '-10.00'
      }
    }],
    data: {
      discountProgramParticipantId: '86328764873265'
    }
  }]
};


/**
 * Initializes the payment request object.
 */
function buildPaymentRequest() {
  if (!window.PaymentRequest) {
    return null;
  }

  var request = null;

  try {
    request = new PaymentRequest(supportedInstruments, details);
    if (request.canMakePayment) {
      /*
      request.canMakePayment().then(function(result) {
        info(result ? "Can make payment" : "Cannot make payment");
      }).catch(function(err) {
        error(err);
      });*/
    }
  } catch (e) {
    error('Developer mistake: \'' + e + '\'');
    if (Round == 1) {
      supportedInstruments = [{
        supportedMethods: [
          'unionpay', 'visa', 'mastercard', 'amex', 'discover', 'diners', 'jcb'
        ]
      }];
    } else if (Round == 2) {
      details.total.amount = {
        currency: 'USD',
        value: '55.00'
      };
    } else if(Round == 3) {
      details.displayItems = [{
        label: 'Original donation amount',
        amount: {
          currency: 'USD',
          value: '-65.00'
        }
      }, {
        label: 'Friends and family discount',
        amount: {
          currency: 'USD',
          value: '10.00'
        }
      }];
    }
  }

  return request;
}

/**
 * Launches payment request for credit cards.
 */
function onBuyClicked() { // eslint-disable-line no-unused-vars
  var request = buildPaymentRequest();
  if (!window.PaymentRequest || !request) {
    error('Round:' + Round + '-PaymentRequest API is not supported.');
    Round++;
    return;
  }
  error('Round:' + Round + '-Got request object.');
    /*
  try {

    request.show()
      .then(function(instrumentResponse) {
        window.setTimeout(function() {
          instrumentResponse.complete('success')
            .then(function() {
              done('Thank you!', instrumentResponse);
            })
            .catch(function(err) {
              error(err);
              request = buildPaymentRequest();
            });
        }, 2000);
      })
      .catch(function(err) {
        error(err);
        request = buildPaymentRequest();
      });
  } catch (e) {
    error('Developer mistake: \'' + e + '\'');
    request = buildPaymentRequest();
  }*/
}
