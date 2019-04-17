/**
 * Middleware to handle generation and 
 * verification of Json Web Tokens
 */
var jwt = require('jsonwebtoken');

/**
 * Create a JSON web token
 * from the Authenticated user object.
 * @param {*} auth 
 */
var createToken = function (auth) {
    return jwt.sign({
        id: auth.id,
        fullName:auth.fullName
    }, process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        });
};

/**
 * JWT middleware
 */
module.exports = {
    /**
     * Generate JSON web token, 
     * for authenticated google user
     * @param {*} req request object
     * @param {*} res response 
     * @param {*} next 
     */
    generateToken: function (req, res, next) {
        req.token = createToken(req.user);
        return next();
    },
    /**
     * Return the generated JWT 
     * in the header
     * @param {*} req 
     * @param {*} res 
     */
    sendToken: function (req, res) {
        
        if(process.env.NODE_ENV ==='production'){
            let url =process.env.REDIRECT_URL +'?name='+ encodeURIComponent(req.user.fullName);
            res.cookie('x-auth-token', req.token);
            res.redirect(302,process.env.REDIRECT_URL);
        }else{
            res.setHeader('x-auth-token', req.token);
            return res.status(200).json(req.user);
        }
        
    },
    /**
     * Verify Json Web Token sent by the client
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    verifyToken: function (req, res, next) {
        
        let token = req.header('x-auth-token') || req.authorization;
        //check if the token is available
        if (token) {
            //verify the token
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                
                if (err) {
                    if (err.name === 'TokenExpiredError') {
                        let error = [{ "location": "header", "param": "x-auth-token", "value": token, "msg": "Token has expired" }];
                        return res.status(401).json({ errors:error });
                    }
                   
                    return res.status(403).json({ message:'Forbidden'});
                } else {
                    req.user = decoded;
                    next();
                }
            });
        } else {
            
            return res.status(403).json({
                message:'Forbidden'
            });
        }
    }
};