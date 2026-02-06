import type { Request,Response,NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { User, type IUser } from "../models/user.model.js";

export interface AuthenticatedRequest extends Request {
    user?: IUser | null;

}

export const verifyJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        if (!decoded || !decoded.id) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        const userId = decoded.id as string;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            res.status(401).json({ message: "User not found" });
            return;
        }
        req.user = user;
        next();
    } catch (error) {

        res.status(401).json({ message: "Unauthorized" });
    }
};