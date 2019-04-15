var jwt = require('jsonwebtoken');

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
     * Generate JSON webtoken, 
     * for authenticated google user
     * @param {*} req 
     * @param {*} res 
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
        res.setHeader('x-auth-token', req.token);
        console.log(req.token);
        return res.status(200).json(req.user);
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
                        return res.status(403).json({ message: 'Expired token' });
                    }
                    return res.status(403).json({ message: 'Forbidden' });
                } else {
                    req.user = decoded;
                    next();
                }
            });
        } else {

            return res.status(403).json({
                message: 'Forbidden'
            });
        }
    }
};