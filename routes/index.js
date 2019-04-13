const express = require('express');
const router = express.Router();
const assesment= require('../controllers/assessmentController'); 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/assesment/:id',assesment.getAssesment);
router.post('/assesment/create',assesment.createAssesment);



module.exports = router;
