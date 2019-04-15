const express = require('express');
const router = express.Router();
const assessment= require('../controllers/assessmentController'); 
const {validate} = require('../validator');
const {verifyToken} = require('../auth/token');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/assessment/:id',[verifyToken,validate('AssessmentId'),assessment.getAssesment]);
router.post('/assessment',[verifyToken,validate('Assessment'),assessment.createAssesment]);



module.exports = router;
