const express = require('express');
const router = express.Router();
const assessment= require('../controllers/assessmentController'); 
const {validate} = require('../validator');
const {verifyToken} = require('../auth/token');


router.get('/assessments',[verifyToken,assessment.getAssesments]);

router.get('/assessments/:id',[verifyToken,validate('AssessmentId'),assessment.getAssesment]);

router.post('/assessments',[verifyToken,validate('Assessment'),assessment.createAssesment]);

router.delete('/assessments/:id',[verifyToken,validate('AssessmentId'),assessment.deleteAssesment]);

router.put('/assessments/:id',[verifyToken,validate('Assessment'),assessment.updateAssessment]);

module.exports = router;
