import jwt, {JsonWebTokenError} from "jsonwebtoken";
import {NotFoundError, UnauthorizedError} from "./exception/JobLogError";
import UserRepository from "../repository/UserRepository";
import {IUser} from "../model/User";

export default class Authenticator {
  private static instance: Authenticator;
  private readonly userRepo: UserRepository;

  private constructor(userRepo: UserRepository) {
    this.userRepo = userRepo;
  }

  public static getInstance(userRepo: UserRepository): Authenticator {
    if (!Authenticator.instance) {
      Authenticator.instance = new Authenticator(userRepo);
    }
    return Authenticator.instance;
  }

  public getCurrentUser = async (header: string | undefined): Promise<IUser> => {
    if (!header || !header.startsWith("Bearer ")) {
      return Promise.reject(new UnauthorizedError("No token provided or token does not have Bearer prefix"));
    }
    const token = header.substring(7);
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY!);
      if (typeof payload === "object" && payload !== null && "username" in payload) {
        const currentUser = await this.fetchUserByUserName(payload.username);
        return currentUser;
      } else {
        throw new UnauthorizedError("Token payload does not include username");
      }
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedError(error.message);
      } else {
        throw error;
      }
    }
  };

  private fetchUserByUserName = async (userName: string) => {
    try {
      const user = await this.userRepo.findByUserName(userName);
      if (!user) {
        return Promise.reject(new NotFoundError("User not found"));
      }
      return user;
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

export const generateJwtToken = async (userDTO: IUser): Promise<string> => {
  const payload = {
    username: userDTO.username,
    firstName: userDTO.firstName,
    lastName: userDTO.lastName
  };
  return new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.JWT_SECRET_KEY!, {expiresIn: "2h"}, (err, token) => {
      if (err || !token) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};
