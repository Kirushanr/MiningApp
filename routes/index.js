const express = require('express');
const router = express.Router();
const assessment= require('../controllers/assessmentController'); 
const validator = require('../validator');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/assessment/:id',validator.validate('AssesmentId'),assessment.getAssesment);
router.post('/assessment',validator.validate('Assessment'),assessment.createAssesment);



module.exports = router;
