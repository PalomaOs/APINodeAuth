const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const ClaimTypes = require('../config/claimtypes');
const { GeneraToken } = require('../services/jwttoken.service');

const Authorize = (rol) => {
    return async (req, res, next) => {
        try {
            const authHeader = req.header('Authorization');
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json();
            }

            const token = authHeader.split(' ')[1];
            const decodedToken = jwt.verify(token, jwtSecret);

            if (rol.split(',').indexOf(decodedToken[ClaimTypes.Role]) === -1) {
                return res.status(401).json();
            }

            req.decodedToken = decodedToken;

            const minutosRestantes = (decodedToken.exp - (Date.now() / 1000)) / 60;
            if (minutosRestantes < 5) {
                const nuevoToken = GeneraToken(decodedToken[ClaimTypes.Name], decodedToken[ClaimTypes.GivenName], decodedToken[ClaimTypes.Role]);
                res.header('Set-Authorization', nuevoToken);
            }
            next();
        } catch (error) {
            return res.status(401).json();
        }
    };
};

module.exports = Authorize;
