import {IUser, userSchema, userSchemaName} from "../model/User";
import AbstractRepository from "./AbstractRepository";
import bcrypt from "bcrypt";

export default class UserRepository extends AbstractRepository<IUser> {
  constructor() {
    super(userSchema, userSchemaName);
  }

  public create = async (item: IUser): Promise<IUser> => {
    item.password = await this.hash(item.password);
    item.securityAnswer = await this.hash(item.securityAnswer);
    return await super.create(item);
  };

  public update = async (id: string, item: Partial<IUser>): Promise<IUser | null> => {
    if (item.password) {
      item.password = await this.hash(item.password);
    }
    if (item.securityAnswer) {
      item.securityAnswer = await this.hash(item.securityAnswer);
    }
    return await super.update(id, item);
  };

  public findByUserName = async (userName: string): Promise<IUser | null> => {
    return this.model.findOne({username: userName}).exec();
  };

  private async hash(content: string): Promise<string> {
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_WORK_FACTOR!));
    return await bcrypt.hash(content, salt);
  }
}
