var api = require("./../req");

/**
 * Provides access to the list of current Webhook subscriptions.
 * @param {Object} xapi - API credentials
 * @param {String} xapi.vpcUrl - ACS server to request
 * @param {String} xapi.ownerId - ACS ownerId
 * @param {String} xapi.accessToken - ACS accessToken
 * @param {Object} devAccount - information about the Aerohive developper account to user
 * @param {String} devAccount.clientID - Aerohive Developper Account ClientID
 * @param {String} devAccount.clientSecret - Aerohive Developper Account secret
 * @param {String} devAccount.redirectUrl - Aerohive Developper Account redirectUrl
 *  */
module.exports.get = function (xapi, devAccount, callback) {
    var path = "/xapi/beta/configuration/webhooks?ownerId=" + xapi.ownerId;
    api.GET(xapi, devAccount, path, function (err, result) {
        if (err) {
            callback(err, null);
        } else if (result) {
            callback(null, result);
        } else {
            callback(null, null);
        }
    })
};

/**
 * Creates a new Webhook subscription
 * @param {Object} xapi - API credentials
 * @param {String} xapi.vpcUrl - ACS server to request
 * @param {String} xapi.ownerId - ACS ownerId
 * @param {String} xapi.accessToken - ACS accessToken
 * @param {Object} devAccount - information about the Aerohive developper account to user
 * @param {String} devAccount.clientID - Aerohive Developper Account ClientID
 * @param {String} devAccount.clientSecret - Aerohive Developper Account secret
 * @param {String} devAccount.redirectUrl - Aerohive Developper Account redirectUrl
 * @param {Object} subscription - The subscription parameters
 * @param {String} subscription.application - The application name that receives a callback as a result of the subscription.
 * @param {String} subscription.ownerId - The id of the customer that owns this device.
 * @param {String} subscription.secret - The shared secret sent to the subscribing application. 
 * @param {String} subscription.url - The https URL to receive a callback as a result of the subscription
 *  */
module.exports.create = function (xapi, devAccount, subscription, callback) {
    var path = "/xapi/beta/configuration/webhooks";
    subscription.ownerId = xapi.ownerId;
    for (var key in subscription) {
        if (subscription[key] === '') delete subscription[key];
    }
    console.log(subscription);
    api.POST(xapi, devAccount, path, subscription, function (err, result) {
        if (err) {
            callback(err, null);
        } else if (result) {
            callback(null, result);
        } else {
            callback(null, null);
        }
    })
};


/**
 * Deletes Webhook subscription
 * @param {Object} xapi - API credentials
 * @param {String} xapi.vpcUrl - ACS server to request
 * @param {String} xapi.ownerId - ACS ownerId
 * @param {String} xapi.accessToken - ACS accessToken
 * @param {Object} devAccount - information about the Aerohive developper account to user
 * @param {String} devAccount.clientID - Aerohive Developper Account ClientID
 * @param {String} devAccount.clientSecret - Aerohive Developper Account secret
 * @param {String} devAccount.redirectUrl - Aerohive Developper Account redirectUrl
 * @param {String} subscriptionId - The subscription parameters
 *  */
module.exports.remove = function (xapi, devAccount, subscriptionId, callback) {
    var path = "/xapi/beta/configuration/webhooks/" + subscriptionId;
    api.DELETE(xapi, devAccount, path, function (err, result) {
        if (err) {
            callback(err, null);
        } else if (result) {
            callback(null, result);
        } else {
            callback(null, null);
        }
    })
};