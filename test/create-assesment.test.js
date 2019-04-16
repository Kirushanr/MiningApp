const mongoose = require("mongoose");
const Assessment = require('../models/Assessment');
const request = require('request');


//Require the test-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();


chai.use(chaiHttp);

describe('Test the POST /api/assessment/create route', function () {
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

    after(function (done) {
        Assessment.deleteMany().exec()
            .then(() => {
                done();
            }).catch(error => {
                console.log(error);
            });
    });

    beforeEach(function (done) {
        Assessment.deleteMany().exec()
            .then(() => {
                done();
            }).catch(error => {
                console.log(error);
            });
    });

    it('should create an assessment', function (done) {
        let assessment = {
            assessmentId: 195564,
            vendorName: 'Apple Inc',
            safety: 1,
            safetyComment: 'Very safe equipment',
            quality: 'Good',
            qualityComment: 'Exceeds expectation',
            Notes: 'None',
            userId: mongoose.Types.ObjectId(userId)
        };

        chai.request(server)
            .post('/api/assessment')
            .set('x-auth-token', value)
            .send(assessment)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('data');
                res.body.data.should.have.property('assessmentId').eql(assessment.assessmentId);
                done();
            });

    });

    it('should not create an assesment with an existing id', function (done) {

        const assessment = new Assessment({
            assessmentId: 195564,
            vendorName: 'Apple Inc',
            safety: 1,
            safetyComment: 'Very safe equipment',
            quality: 'Good',
            qualityComment: 'Exceeds expectation',
            Notes: 'None',
            userId: mongoose.Types.ObjectId(userId)
        });

        assessment.save(function (error, document) {
            let assessment = {
                assessmentId: 195564,
                vendorName: 'Apple Inc',
                safety: 1,
                safetyComment: 'Very safe equipment',
                quality: 'Good',
                qualityComment: 'Exceeds expectation',
                Notes: 'None',
                userId: mongoose.Types.ObjectId(userId)
            };

            chai.request(server)
                .post('/api/assessment')
                .set('x-auth-token', value)
                .send(assessment)
                .end(function (err, res) {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors[0].should.have.property('msg').eql('Assessment already exists');
                    done();
                });
        });
    });

    context('## with invalid inputs', function () {
        it('should return errors when required parameters not passed', function (done) {
            let assessment = {
                Notes: 'None'
            };

            chai.request(server)
                .post('/api/assessment')
                .set('x-auth-token', value)
                .send(assessment)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.length(6);
                    done();
                });
        });

        context('#safety out of range (1-5) ', function () {

            it('should return error when safety value is less than 1', function (done) {
                let assessment = {
                    assessmentId: 195564,
                    vendorName: 'Apple Inc',
                    safety: 0,
                    safetyComment: 'Very safe equipment',
                    quality: 'Good',
                    qualityComment: 'Exceeds expectation',
                    Notes: 'None',
                    userId: mongoose.Types.ObjectId(userId)
                };

                chai.request(server)
                    .post('/api/assessment')
                    .set('x-auth-token', value)
                    .send(assessment)
                    .end(function (err, res) {
                        res.should.have.status(422);
                        res.body.should.be.a('object');
                        res.body.should.have.property('errors');
                        res.body.errors[0].should.have.property('param').eql('safety');
                        done();
                    });

            });

            it('should return error when safety value is less than 1', function (done) {
                let assessment = {
                    assessmentId: 195564,
                    vendorName: 'Apple Inc',
                    safety: 6,
                    safetyComment: 'Very safe equipment',
                    quality: 'Good',
                    qualityComment: 'Exceeds expectation',
                    Notes: 'None',
                    userId: mongoose.Types.ObjectId(userId)
                };

                chai.request(server)
                    .post('/api/assessment')
                    .set('x-auth-token', value)
                    .send(assessment)
                    .end(function (err, res) {
                        res.should.have.status(422);
                        res.body.should.be.a('object');
                        res.body.should.have.property('errors');
                        res.body.errors[0].should.have.property('param').eql('safety');
                        done();
                    });
            });
        });

        context('# quality values', function () {
            it('should return error when quality does not belong to Good/Bad/Average/Excellent', (done) => {
                let assessment = {
                    assessmentId: 195564,
                    vendorName: 'Apple Inc',
                    safety: 4,
                    safetyComment: 'Safe',
                    quality: 'Better',
                    qualityComment: 'Needs improvement',
                    Notes: 'None',
                    userId: mongoose.Types.ObjectId(userId)
                };

                chai.request(server)
                    .post('/api/assessment')
                    .set('x-auth-token', value)
                    .send(assessment)
                    .end(function (err, res) {
                        res.should.have.status(422);
                        res.body.should.be.a('object');
                        res.body.should.have.property('errors');
                        res.body.errors[0].should.have.property('param').eql('quality');
                        done();
                    });
            });

        });
    });

});