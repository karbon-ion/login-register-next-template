import jwt from "jsonwebtoken";
import connectMongoDB from "@/libs/mongodb";
import User from "@/models/userModel";
export default async function authenticateMiddleware(req) {
    try {
        const authorizationHeader = req.headers.get("authorization");
        const token = authorizationHeader?.split(" ")[1];
        if (!token) {
            return false;
        }
        await connectMongoDB();
        try {
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY); 
            const user = await User.findById(decodedToken.userId);
            if (!user) {
                return false;
            }
            req.user = user;
            return true;
        } catch (verifyError) {
            console.error("Error verifying token:", verifyError);
            return false; 
        }
    } catch (error) {
        return false;
    }
}

export const getLoginId = (req) =>{
    const authorizationHeader = req.headers.get("authorization");
        const token = authorizationHeader?.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        return decodedToken.userId
}