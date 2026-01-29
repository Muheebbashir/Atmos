import type { NextFunction,Request,Response,RequestHandler } from "express";

const asyncHandler = (fn: RequestHandler) : RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error:any) {
            res.status(500).json({ message: error.message || "Internal Server Error" });
        }
    }
}

export default asyncHandler;