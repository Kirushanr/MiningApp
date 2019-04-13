const mongoose = require('mongoose');
const errorHandler = require('../errorHandler');
const Assessment = mongoose.model('Assessment');

exports.getAssesments = (req, res) => {
    res.send('TO BE IMPLEMENTED');
};

//get an assesment given an id
exports.getAssesment = (req, res) => {
    console.log(req.params.id)
    const assesment = Assessment.findOne({assesmentId:req.params.id}).exec();
    assesment.then(document =>{
        if(!document){
            res.status(200).json({"message":"Assesment detail not found"});
        }
        res.status(200).json({message:"Assement found", data: document});
    }).catch(error => {
        console.log(error);
    });
};


exports.createAssesment = (req, res) => {
    
    const newAssesment = new Assessment(req.body);
    newAssesment.save()
        .then((document) => res.json({ status: 200, message: 'Assessment created successfully', data: document }))
        .catch(error => {
            let message = errorHandler.getErrorMessage(error);
            res.status(500).json({ status: 500, message: message });
    });
};
