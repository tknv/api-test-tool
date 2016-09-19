var express = require('express');
var router = express.Router();
var API = require("./../bin/aerohive/api/main");

var devAccount = require("./../bin/aerohive/config").aerohive;
/* GET users listing. */



/**
 * CONFIGURATION
 */
router.get("/configuration/locations", function (req, res, next) {
    API.configuration.locations.locations(req.session.xapi, devAccount, function (err, response, request) {
        if (err) res.status(err.status).send({ error: err, request: request});
        else res.json({ response: response, request: request});
    })
})
router.get("/configuration/ssids", function (req, res, next) {
    API.configuration.ssids.get(req.session.xapi, devAccount, function (err, response, request) {
        if (err) res.status(err.status).send(err);
        else res.json({ response: response, request: request});
    })
})
router.get("/configuration/webhooks", function (req, res, next) {
    API.configuration.webhooks.get(req.session.xapi, devAccount, function (err, response, request) {
        if (err) res.status(err.status).send(err);
        else res.json({ response: response, request: request});
    })
})
function checkWebhook(req, callback) {
    API.configuration.webhooks.get(req.session.xapi, devAccount, function (err, response, request) {
        if (err) callback(err, null);
        else {
            var webhook;
            response.forEach(function (wh) {
                if (
                    wh.ownerId == req.session.xapi.ownerId
                    && wh.application == "ApiTestTool"
                    && wh.secret == req.session.xapi.vpcUrl + req.session.xapi.ownerId
                    && wh.url == "https://check.ah-lab.fr/webhook/presence"
                ) {
                    webhook = wh;
                    req.session.webhookId = wh.id;
                    req.session.save();
                };
            });
            callback(null, webhook, request);
        }
    })
}
router.post("/configuration/webhooks", function (req, res, next) {
    if (req.session.xapi.ownerId) {
        var subscription = {
            "application": "ApiTestTool",
            "ownerId": req.session.xapi.ownerId,
            "secret": req.session.xapi.vpcUrl + req.session.xapi.ownerId,
            "url": "https://check.ah-lab.fr/webhook/presence"
        }
        API.configuration.webhooks.create(req.session.xapi, devAccount, subscription, function (err, response, request) {
            if (err) {
                if (err.code == "core.service.data.can.not.persist.object") {
                    checkWebhook(req, function (err2, response) {
                        if (err2) res.status(err.status).send(err);
                        else res.json({ response: response, request: request});
                    });
                } else res.status(err.status).send(err);
            } else {
                req.session.webhookId = response.id;
                req.session.save();
                res.json({ response: response, request: request});
            }
        })
    } else res.status("404").send("ownerId not present in session.");
})
router.delete("/configuration/webhooks", function (req, res, next) {
    if (req.session.webhookId) {
        io.sockets.in(req.session.webhookId).emit("message", "test");
        API.configuration.webhooks.remove(req.session.xapi, devAccount, req.session.webhookId, function (err, response, request) {
            if (err) res.status(err.status).send(err);
            else res.json({ response: response, request: request});
        })
    } else res.status("404").send("webhookId not present in session.");
})
/**
 * IDENTITY
 */
router.get("/identity/credentials", function (req, res, next) {
    API.identity.credentials.getCredentials(req.session.xapi, devAccount, null, null, null, null, null, null, null, null, null, null, null, null, function (err, response, request) {
        if (err) res.status(err.status).send(err);
        else res.json({ response: response, request: request});
    })
})
router.get("/identity/userGroups", function (req, res, next) {
    API.identity.userGroups.getUserGroups(req.session.xapi, devAccount, null, null, function (err, response, request) {
        if (err) res.status(err.status).send(err);
        else res.json({ response: response, request: request});
    })
})

/**
 * LOCATION
 */
router.get("/location/clients", function (req, res, next) {
    API.configuration.ssid.GET(req.session.xapi, devAccount, function (err, response, request) {
        if (err) res.status(err.status).send(err);
        else res.json({ response: response, request: request});
    })
})

/**
 * MONITOR
 */
router.get("/monitor/clients", function (req, res, next) {
    API.monitor.clients.list(req.session.xapi, devAccount, function (err, response, request) {
        if (err) res.status(err.status).send(err);
        else res.json({ response: response, request: request});
    })
})
router.get("/monitor/devices", function (req, res, next) {
    API.monitor.devices.list(req.session.xapi, devAccount, function (err, response, request) {
        if (err) res.status(err.status).send(err);
        else res.json({ response: response, request: request});
    })
})

/**
 * PRESENCE
 */
router.get("/presence/clientcount", function (req, res, next) {
    if (req.query.locationId) {
        var locationId = req.query.locationId;
        var endTime = new Date().toISOString();
        var startTime = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString();
        API.clientlocation.clientcount(req.session.xapi, devAccount, locationId, startTime, endTime, function (err, response, request) {
            if (err) res.status(err.status).send(err);
            else res.json({ response: response, request: request});
        })
    } else res.status(401).send("Error: no locationId");
})
router.get("/presence/clientpresence", function (req, res, next) {
    if (req.query.locationId) {
        var locationId = req.query.locationId;
        var endTime = new Date().toISOString();
        var startTime = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString();
        var timeUnit = "OneHour";
        API.clientlocation.clientpresence(req.session.xapi, devAccount, locationId, startTime, endTime, timeUnit, function (err, response, request) {
            if (err) res.status(err.status).send(err);
            else res.json({ response: response, request: request});
        })
    } else res.status(401).send("Error: no locationId");
})
router.get("/presence/clienttimeseries", function (req, res, next) {
    if (req.query.locationId) {
        var locationId = req.query.locationId;
        var endTime = new Date().toISOString();
        var startTime = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString();
        var timeUnit = "OneHour";
        API.clientlocation.clienttimeseries(req.session.xapi, devAccount, locationId, startTime, endTime, timeUnit, function (err, response, request) {
            if (err) res.status(err.status).send(err);
            else res.json({ response: response, request: request});
        })
    } else res.status(401).send("Error: no locationId");
})
router.get("/presence/waypoints", function (req, res, next) {
    if (req.query.locationId) {
        var locationId = req.query.locationId;
        var endTime = new Date().toISOString();
        var startTime = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString();
        API.clientlocation.waypoints(req.session.xapi, devAccount, locationId, startTime, endTime, function (err, response, request) {
            if (err) res.status(err.status).send(err);
            else res.json({ response: response, request: request});
        })
    } else res.status(401).send("Error: no locationId");
})

module.exports = router;
