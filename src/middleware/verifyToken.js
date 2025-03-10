import jwt from "jsonwebtoken"

 export const verifyToken= async (req,res, next) =>{
    try{
        let [key, token]=req.headers.token.split(' , ')
        if (key==""){
            jwt.verify(token, 'myNameIsMenna', async(err,decoded) =>{
                if(err) return res.status(401).json({message:"invalid token", err})
                 req.user =decoded
             next()
             })}
   
    }catch (error){
        res.status(500).json({error: error.message})
    }
} 