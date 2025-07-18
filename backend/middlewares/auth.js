import jwt from 'jsonwebtoken'
import redisClient from '../controllers/reddis.js';
const authmiddleware = async(req, res , next)=>{
    try{
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];

        if(!token){
            return res.json({success : false , message : "Unauthorized User"})
        }
        const isBlacklisted = await redisClient.get(token);
        if(isBlacklisted){
           res.clearCookie('token');
            return res.json({success : false , message : "Unauthorized User"});

        }
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        req.userID = decoded.id ;
        next();

    }
    catch(error){
        res.json({success : false , message : "Some error occured"})
        console.log(error)
    }
}

export default authmiddleware;