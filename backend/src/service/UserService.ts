import {IUser} from "../model/User";
import UserRepository from "../repository/UserRepository";
import AbstractService from "./AbstractService";
import {NotFoundError, UnauthorizedError, BadRequestError} from "../utils/exception/JobLogError";
import {generateJwtToken} from "../utils/Authenticator";
import bcrypt from "bcrypt";

export default class UserService extends AbstractService<IUser> {
  private userRepo;

  constructor(userRepo: UserRepository) {
    super();
    this.userRepo = userRepo;
  }

  public async getAll(): Promise<IUser[]> {
    return Promise.reject("Not implement");
  }

  public async getById(id: string): Promise<IUser> {
    const result = await this.userRepo.findById(id);
    if (!result) {
      throw new NotFoundError("User not found");
    }
    return result;
  }

  public async getByUserName(userName: string): Promise<IUser> {
    const result = await this.userRepo.findByUserName(userName);
    if (!result) {
      throw new NotFoundError("User not found");
    }
    return result;
  }

  public async create(dto: IUser): Promise<IUser> {
    return await this.userRepo.create(dto);
  }

  public async login(dto: IUser) {
    const user = await this.userRepo.findByUserName(dto.username);
    if (!user) {
      throw new UnauthorizedError("Not Authorized");
    }
    const isPasswordMatch = this.comparePassword(user, dto.password);
    if (!isPasswordMatch) {
      throw new NotFoundError("Invalid User Name Or Password");
    }
    const token = await generateJwtToken(user);
    return token;
  }

  public async update(id: string, dto: IUser): Promise<IUser> {
    // only first name and last name will be updated
    const updateDTO = {firstName: dto.firstName, lastName: dto.lastName};
    const result = await this.userRepo.update(id, updateDTO);
    if (!result) {
      throw new NotFoundError("User not found");
    }
    return result;
  }

  public async resetPassword(dto: IUser): Promise<IUser> {
    const user = await this.userRepo.findByUserName(dto.username);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    const isSecurityAnswerMatch = this.compareSecurityAnswer(user, dto.securityAnswer);
    if (!isSecurityAnswerMatch) {
      throw new BadRequestError("Invalid Security Answer");
    }
    // only password will be reset
    const updateDTO = {password: dto.password};
    const result = await this.userRepo.update(user.id, updateDTO);
    return result!;
  }

  public async delete(id: string): Promise<void> {
    return Promise.reject("Not implement");
  }

  private comparePassword(user: IUser, candidatePassword: string): boolean {
    return bcrypt.compareSync(candidatePassword, user.password);
  }

  private compareSecurityAnswer(user: IUser, candidateAnswer: string): boolean {
    return bcrypt.compareSync(candidateAnswer, user.securityAnswer);
  }
}
