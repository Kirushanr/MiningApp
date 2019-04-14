const mongoose = require("mongoose");
const Assessment = require('../models/Assessment');


//Require the test-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();


chai.use(chaiHttp);

describe('Test the POST /api/assessment/create route', function () {


    afterEach(function (done) {
        Assessment.deleteMany().exec()
            .then(() => {
                done();
            }).catch(error=>{
                console.log(error);
            });
    });

    it('should create an assessment', (done) => {
        let assessment = {
            assesmentId: 195564,
            vendorName: 'Apple Inc',
            safety: 4,
            safetyComment: 'Very safe equipment',
            quality: 'Good',
            qualityComment: 'Exceeds expectation',
            Notes: 'None'
        };

        chai.request(server)
        .post('/api/assessment')
        .send(assessment)
        .end((err, res) =>{
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('data');
            res.body.data.should.have.property('assesmentId').eql(assessment.assesmentId);
           done();  
        });

    });

    context('with invalid inputs',()=>{
            it('should return error when required parameters not passed', (done)=> {
                let assessment = {
                    Notes: 'None'
                };

                chai.request(server)
                .post('/api/assessment')
                .send(assessment)
                .end((err, res) =>{
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.length(6);
                   done();  
                });
            }); 
    });
     


});