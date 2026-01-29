import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/config.service.js";
import { userModel } from "../DB/model/index.js";
import { ErrorExeption } from "../common/utils/index.js";

export const auth = () => {
  return async (req, res, next) => {
    try {
      const { authorization } = req.headers;

      if (!authorization) {
        ErrorExeption({ message: "Authorization header is required", cause: { status: 401 } });
      }

      const token = authorization

      const decoded = jwt.verify(token, JWT_SECRET);

      const user = await userModel.findById(decoded.id);

      if (!user) {
        ErrorExeption({ message: "User not found", cause: { status: 401 } });
      }

        req.user = user;
        
        next();
        
    } catch (error) {
       if(error.message === 'jwt expired') {
           return next(new Error('Token expired', { cause: { status: 401 } }));
       }
       if(error.message === 'invalid signature') {
           return next(new Error('Invalid token', { cause: { status: 401 } }));
       }       
       next(error);
    }
  };
};
