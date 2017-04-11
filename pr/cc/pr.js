/* global done:false */
/* global error:false */
/* global PaymentRequest:false */

var Round = 1;

var supportedInstruments = [{
  supportedMethods: [
    'unionpay', 'visa', 'mastercard', 'amex', 'discover', 'diners', 'jcb'
  ]
}];

var details = {
  id: '',
  total: {
    label: 'Donation',
    amount: {
      currency: 'USD',
      value: '55.00'
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
      value: '10.00'
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

function preSetting() {
  var change = document.getElementById("Round");
  if (Round == 7) {
    change.innerHTML = 'DONE';
  } else {
    var next = Round + 1;
    change.innerHTML = 'Round' + next;
  }

  switch (Round) {
    case 1:
      supportedInstruments = [{}];
      break;
    case 2:
      supportedInstruments = [{
        supportedMethods: [
          'unionpay', 'visa', 'mastercard', 'amex', 'discover', 'diners', 'jcb'
        ]
      }];
      details.total.amount = {
        currency: 'USD',
        value: '-55.00'
      };
      break;
    case 3:
      details.total.amount = {
        currency: 'USD',
        value: '55.00'
      };
      details.displayItems = [{
        label: 'Original donation amount',
        amount: {
          currency: 'USD',
          value: '-aa65.00'
        }
      }, {
        label: 'Friends and family discount',
        amount: {
          currency: 'USD',
          value: '10.00'
        }
      }];
      break;
    case 4:
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
      info('Round ' + Round + ': Got PaymentRequest and try abort() before show()');
      break;
    case 5:
      info('Round ' + Round + ': Got PaymentRequest and try canMakePayment()');
      break;
    case 6:
      info('Round ' + Round + ': Got PaymentRequest and try show() without detail.id');
      break;
    case 7:
      details.id = 'MozBill';
      info('Round ' + Round + ': Got PaymentRequest and try show() with detail.id');
      break;
    default:
      done('See you next time!');
      retrun;
  }
}

/**
 * Initializes the payment request object.
 */
function buildPaymentRequest() {
  if (!window.PaymentRequest) {
    done('Your browser doesn\'t support PaymentRequest API!');
    return null;
  }
  preSetting();

  var request = null;

  try {
    request = new PaymentRequest(supportedInstruments, details);
  } catch (e) {
    info('Round ' + Round + ': PaymentRequest cann\'t be generated.');
    error(' Reason: \'' + e + '\'');
    Round++;
  }

  return request;
}

/**
 * Launches payment request for credit cards.
 */
function onBuyClicked() {
  var request = buildPaymentRequest();
  if (!window.PaymentRequest || !request) {
    return;
  }

  try {
    if (Round == 4) {
      request.abort().then(function() {
        info("Abort successfully");
      }).catch(function(err) {
        error("Abort failed due to" + err);
      });
      Round++;
      return;
    }

    if (Round == 5) {
      if (request.canMakePayment) {
        request.canMakePayment().then(function(result) {
          error(result ? "Result: Can make payment" : "Result: Cannot make payment");
        }).catch(function(err) {
          error(err);
        });
      Round++;
      return;
      }
    }

    request.show()
      .then(function(instrumentResponse) {
        window.setTimeout(function() {
          instrumentResponse.complete('success')
            .then(function() {
              error("[Payment Response]----");
              showResp(instrumentResponse);
              Round++;
              return;
            })
            .catch(function(err) {
              error(err);
              request = buildPaymentRequest();
            });
        }, 1000);
      })
      .catch(function(err) {
        error(err);
        request = buildPaymentRequest();
      });
  } catch (e) {
    error('Developer mistake: \'' + e + '\'');
    request = buildPaymentRequest();
    return Round;
  }
}
