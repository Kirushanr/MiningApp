const mongoose = require("mongoose");
const Assessment = require('../models/Assessment');
const request = require('request');

//Require the test-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();

chai.use(chaiHttp);

describe('Test the PUT /api/assessment/:id route', function () {
    var value = null;
    var userId = null;

    before(function (done) {
        request(process.env.GOOGLE_CALLBACK_URL, function (error, response, body) {
            value = response.headers['x-auth-token'];
            var info = JSON.parse(body);
            userId = info._id;
            done();
        });
    });

    beforeEach(function (done) {
        
        Assessment.deleteMany().exec()
            .then(() => {
                done();
            });
    });

    context('update assessment', function () {
       

        it('should update assessment detail', function (done) {
            let newAssessment = {
                assessmentId: 195564,
                vendorName: 'Apple Inc',
                safety: 1,
                safetyComment: 'Very safe equipment',
                quality: 'Good',
                qualityComment: 'Exceeds expectation',
                Notes: 'None',
                userId: mongoose.Types.ObjectId(userId)
            };
            const assessment= new Assessment(newAssessment);
            assessment.save(function(error,document){
                if(error) done(error);

                newAssessment.vendorName = 'Komatsu';
                chai.request(server)
                    .put('/api/assessment/' + 195564)
                    .send(newAssessment)
                    .set('x-auth-token', value)
                    .end(function (err, res) {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('data');
                        res.body.data.should.have.property('vendorName').eql(newAssessment.vendorName);
                        done();
                });

            });

            it('should give an error when the assessment does not exist', function(){
                    chai.request(server)
                    .put('/api/assessment/' + 195564)
                    .send(newAssessment)
                    .set('x-auth-token', value)
                    .end(function (err, res) {
                        res.should.have.status(404);
                        res.body.should.be.a('object');
                        res.body.should.have.property('data');
                        res.body.data.should.have.lengthOf(0);
                        done();
                });
            });

        });

    });

});