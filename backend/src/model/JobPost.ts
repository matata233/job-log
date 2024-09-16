import {Schema, Document} from "mongoose";
import {IStatus} from "./JobBoard";

export interface IJobPost extends Document {
  userId: Schema.Types.ObjectId;
  jobBoardId: Schema.Types.ObjectId;
  title: string;
  company: string;
  url: string;
  location: string;
  salary: string;
  deadline: Date;
  description: string;
  requirements: string[];
  status: IStatus;
  note: string;
  isArchived: boolean;
}

export const jobPostSchema = new Schema<IJobPost>(
  {
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true},
    jobBoardId: {type: Schema.Types.ObjectId, ref: "JobBoard", required: true},
    title: {type: String, required: true},
    company: {type: String, required: true},
    url: {type: String},
    location: {type: String},
    salary: {type: String},
    deadline: {type: Date},
    description: {type: String, required: true},
    requirements: {type: [String], required: true},
    status: {
      type: {
        statusName: {type: String, required: true}
      },
      required: true
    },
    note: {type: String},
    isArchived: {type: Boolean, default: false}
  },
  {timestamps: true}
);

export const jobPostSchemaName: string = "JobPost";
