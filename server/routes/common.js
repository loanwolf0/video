const express = require('express');
const router = express.Router();
const commonController = require("../controller/common.js");
const { userAuthentication } = require('../utils/authentication.js')

router.get('/plans', commonController.getPlans);
router.get('/upgrade-plan', userAuthentication, commonController.getUpgradePlans);


module.exports = router;
