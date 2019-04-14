const mongoose = require("mongoose");
const Assessment = require('../models/Assessment');


//Require the test-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();


chai.use(chaiHttp);

describe('Test the GET /api/assessment/:id route', function () {

    
    beforeEach(function (done) {
            Assessment.deleteMany().exec()
                .then(() => {
                    done();
                });
    });
        
    

    context('assessment id passed as route parameter',() => {

        it('it should retrive the assessment by the given assessment id', (done) => {
            const assessment = new Assessment({
                assessmentId: 195564,
                vendorName: 'Apple Inc',
                safety: 4,
                safetyComment: 'Very safe equipment',
                quality: 'Good',
                qualityComment: 'Exceeds expectation',
                Notes: 'None'

            });

            assessment.save((error, document) => {

                chai.request(server)
                    .get('/api/assessment/' + document.assessmentId)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('data');
                        res.body.data.should.have.property('safety');
                        res.body.data.should.have.property('safetyComment');
                        res.body.data.should.have.property('quality');
                        res.body.data.should.have.property('qualityComment');
                        res.body.data.should.have.property('Notes');
                        res.body.data.should.have.property('assessmentId').eql(document.assessmentId);
                        done();
                    });
            });
        });

        it('should return Assessment detail not found', (done)=>{
            chai.request(server)
                .get('/api/assessment/' +195564)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.message.should.equal('Assessment detail not found');
                    done();
                });
        });
    });

    context('non integer passed as assessment id',()=>{
        it('should return error ', (done) => {
            chai.request(server)
                .get('/api/assessment/' +'12a')
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });
    });


    context('not passing assessment id as route parameter',()=>{
        it('it should return 404 ', (done) => {
            chai.request(server)
                .get('/api/assessment/')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });

        });
    });
});

