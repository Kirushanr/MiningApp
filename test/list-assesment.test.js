const mongoose = require("mongoose");
const Assessment = require('../models/Assessment');
const request = require('request');

//Require the test-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();

chai.use(chaiHttp);


describe('Test the GET /api/assessments/:id route', function () {
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

    after(function (done) {
        Assessment.deleteMany().exec()
            .then(() => {
                done();
            }).catch(error => {
                console.log(error);
            });
    });


    context('assessment id passed as route parameter', function(){

        it('it should retrieve the assessment by the given assessment id', function(done){

            const assessment = new Assessment({
                assessmentId: 195564,
                vendorName: 'Apple Inc',
                safety: 4,
                safetyComment: 'Very safe equipment',
                quality: 'Good',
                qualityComment: 'Exceeds expectation',
                Notes: 'None',
                userId:mongoose.Types.ObjectId(userId)
            });

            assessment.save(function(error, document){
                
                chai.request(server)
                    .get('/api/assessments/' + document.assessmentId)
                    .set('x-auth-token', value)
                    .end(function(err, res) {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('data');
                        res.body.data.should.have.property('safety');
                        res.body.data.should.have.property('safetyComment');
                        res.body.data.should.have.property('quality');
                        res.body.data.should.have.property('qualityComment');
                        res.body.data.should.have.property('Notes');
                        //res.body.data.should.have.property('assessmentId').eql(document.assessmentId);
                        done();
                });
            });
        });

        it('should return Assessment detail not found', (done) => {
            chai.request(server)
                .get('/api/assessments/' + 195564)
                .set('x-auth-token', value)
                .end(function(err, res) {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.message.should.equal('Assessment detail not found');
                    done();
                });
        });
    });

    context('non integer passed as assessment id', function() {
        it('should return error ', (done) => {
          
            chai.request(server)
                .get('/api/assessments/' + '12a')
                .set('x-auth-token', value)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });
    });


    context('retrieve all assessments', function() {
        it('it should return empty array when no assessments are created by a user ', function(done){
            chai.request(server)
                .get('/api/assessments/')
                .set('x-auth-token', value)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.data.should.be.a('array');
                    res.body.data.should.be.lengthOf(0);
                    done();
                });

        });

        it('it should return the assessments are created by a user ', function(done){
            const assessment = new Assessment({
                assessmentId: 195564,
                vendorName: 'Apple Inc',
                safety: 4,
                safetyComment: 'Very safe equipment',
                quality: 'Good',
                qualityComment: 'Exceeds expectation',
                Notes: 'None',
                userId:mongoose.Types.ObjectId(userId)
            });

            assessment.save(function(error, document){
                chai.request(server)
                .get('/api/assessments/')
                .set('x-auth-token', value)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.data.should.be.a('array');
                    res.body.data.should.be.lengthOf(1);
                    done();
                });
            });
          

        });
    });
});

