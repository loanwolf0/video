const jwt = require('jsonwebtoken');
const userDao = require('../dao/user.js');
const mongoose = require('mongoose');


const authenticateUser = async function (req, res, next) {
    try {
        // next()
        // return;
        let requestReferer = req.headers['referer']
        if (requestReferer && (requestReferer.includes('?session=') && !requestReferer.includes('?session=default-'))) {
            next();
            return
        }
        let authorizationHeader = req.headers['authorization'];

        let decodedLocalStorageData = authorizationHeader && authorizationHeader !== 'undefined' ? JSON.parse(authorizationHeader) : null;
        let JWTtoken = decodedLocalStorageData ? decodedLocalStorageData?.jwtToken : '';
        let decodedTokenData = null
        const res = jwt.verify(JWTtoken, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid Token' })
            }
            else {
                // If token is valid, attach the decoded user ID to the request object
                decodedTokenData = decoded
            }
        });
        let userIdJWT = decodedTokenData?.uid;
        let userIdLocalStorage = decodedLocalStorageData?.userId;
        let planIdJWT = decodedTokenData?.planId;
        let planIdLocalStorage = decodedLocalStorageData?.planId;
        /**
         * Check whether the token is provided in header
         * else return response with 401.
         */
        if (!JWTtoken) return res.status(401).json({ message: 'No token provided.' })
        const userId = new mongoose.Types.ObjectId(decodedLocalStorageData?.userId);
        const user = await userDao.getUserById(userId)
        if (!user) return res.status(201).json({ message: 'User Not Found' });

        // if (planIdJWT !== planIdLocalStorage) {
        //     return res.status(401).json({ message: 'LocalStorage Tampered' })
        // }
        if (userIdJWT.toString() === userIdLocalStorage) {
            req['user'] = user;
            next()
        }
        else if ((userIdJWT !== userIdLocalStorage)) {
            return res.status(401).json({ message: 'LocalStorage Tampered' })
        }
    } catch (error) {
        return res.status(401).json({ message: 'Invalid Token' })
    }
}


module.exports = {
    authenticateUser
}