const mongoose = require("mongoose");
const Assessment  = require('../models/Assessment');


//Require the test-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();


chai.use(chaiHttp);

describe('Removing records', function() {
    beforeEach(function(done) {
        Assessment.remove().exec()
        .then(()=>{
            done();
        });
    });


    /*
    * Test the /GET/:id route
    */
  describe('/GET/:id book', () => {
      it('it should retrive an assesment by the given assesment id', (done) => {
         const assessment = new Assessment({
            assesmentId:195564,
            vendorName:'Apple Inc',
            safety : 4,
            safetyComment:'Very safe equipment',
            quality:'Good',
            qualityComment:'Exceeds expectation',
            Notes:'None'
            
         });
        
        assessment.save((error,document) => {
              
              chai.request(server)
                  .get('/api/assesment/' + document.assesmentId)
                  .send(document)
                  .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.a('object');
                      res.body.should.have.property('data');
                      res.body.data.should.have.property('safety');
                      res.body.data.should.have.property('safetyComment');
                      res.body.data.should.have.property('quality');
                      res.body.data.should.have.property('qualityComment');
                      res.body.data.should.have.property('Notes');
                      res.body.data.should.have.property('assesmentId').eql(document.assesmentId);
                      done();
                  });
          });
      });
  });


});

