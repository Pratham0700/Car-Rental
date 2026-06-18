import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { jwt_key } from '../config/AppConfig';
import { role } from '../data/AppEnum';
import { handleError, resUnauthorizedAccess } from '../utils/shareFunction';
interface Itoken{
  id:number,
  email:string,
  role:role,
  iat?:number,
  exp?:number
}
export interface Iuser extends Request {
  user: Itoken;
}
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // 1. No Authorization header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const response = resUnauthorizedAccess({message: "Unauthorized access. No token provided."}); //401
      return res.status(response.code).json(response);
  }
  if (!jwt_key) {
    return handleError(res, new Error("JWT secret is not configured."));
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwt_key) as Itoken;
    (req as Iuser).user = decoded;
    next();
  } catch (error) {
    // 3. Token has expired
    if (error instanceof jwt.TokenExpiredError) {
      const response = resUnauthorizedAccess({message: "token has expired."}); //401
      return  res.status(response.code).json(response);
      
    }

    // 4. Invalid token (wrong signature, malformed, etc.)
    if (error instanceof jwt.JsonWebTokenError) {
      const response = resUnauthorizedAccess({message: "Invalid token."}); //401
      return res.status(response.code).json(response);
    }
    // 6. Unknown error
    return handleError(res, error); 
  }
};

export default authenticate;