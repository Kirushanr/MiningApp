const express = require('express');
const router = express.Router();
const assesment= require('../controllers/assessmentController'); 
const validator = require('../validator');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/assesment/:id',assesment.getAssesment);
router.post('/assesment/create',validator.validate('POST'),assesment.createAssesment);



module.exports = router;
