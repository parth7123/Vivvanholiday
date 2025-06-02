const express = require('express');
const router = express.Router();
const pakagecontroller = require('../controller/pakagecontroller');

// @route   POST /tours
router.post('/createpackage', pakagecontroller.createpakagemodel);

// @route   GET /tours
router.get('/getallpackages', pakagecontroller.getAllpakagemodels);

// @route   PUT /tours/:id
router.put('/updatepackage/:id', pakagecontroller.updatepakagemodel);

// @route   DELETE /tours/:id
router.delete('/deletpackage/:id', pakagecontroller.deletepakagemodel);

// @route   GET /package/getpackagebyid/:id
router.get('/getpackagebyid/:id', pakagecontroller.getpakagemodelById);

// @route   GET /packages/type/:type
router.get('/getpackagesbytype/:type', pakagecontroller.getPackagesByType);

// @route   GET /packages/duration/:duration
router.get('/getpackagesbyduration/:duration', pakagecontroller.getPackagesByDuration);

module.exports = router;