import  jwt from "jsonwebtoken"



export const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"]

    if (!token) {
        res.send("We need a token! Please provide next time!")
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            res.json({auth: false, message: "U failed to authenticate"})
        } else {
            req.userId = decoded._id
            next()
        }
    })
}