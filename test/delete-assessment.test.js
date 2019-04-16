const mongoose = require("mongoose");
const Assessment = require('../models/Assessment');
const request = require('request');


//Require the test-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();


chai.use(chaiHttp);

describe('Test the DELETE /api/assessments/:id route', function () {
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

    context('#Validating assesment ID', function () {
        it('should return error when the ID is invalid', function (done) {
            chai.request(server)
                .delete('/api/assessments/65a')
                .set('x-auth-token', value)
                .end(function (err, res) {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors[0].should.have.property('param').eql('id');
                    done();
                });
        });

        it('should return 404 when assessment ID does not exist', function (done) {
            chai.request(server)
                .delete('/api/assessments/65')
                .set('x-auth-token', value)
                .end(function (err, res) {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    done();
                });
        });

        it('should return the deleted assessment when delete is successful', function (done) {
           let newAssessment={
            assessmentId: 195564,
            vendorName: 'Apple Inc',
            safety: 1,
            safetyComment: 'Very safe equipment',
            quality: 'Good',
            qualityComment: 'Exceeds expectation',
            Notes: 'None',
            userId: mongoose.Types.ObjectId(userId)
        };

            const assessment = new Assessment(newAssessment);

            assessment.save(function (error, document) {
                
                chai.request(server)
                    .delete('/api/assessments/' + 195564)
                    .set('x-auth-token', value)
                    .end(function (err, res) {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('data');
                        res.body.data.should.have.property('assessmentId').eql(newAssessment.assessmentId);
                        done();
                    });

            });

        });




    });
});