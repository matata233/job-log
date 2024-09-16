import {Schema, Document} from "mongoose";

export interface IFile extends Document {
  userId: Schema.Types.ObjectId;
  jobPostId: Schema.Types.ObjectId[];
  originalFileName: string;
  storedFileName: string;
  fileType: string;
  fileUrl: string;
  category: string;
}

export const fileSchema = new Schema<IFile>(
  {
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true},
    jobPostId: [{type: Schema.Types.ObjectId, ref: "JobPost"}],
    originalFileName: {type: String, required: true},
    storedFileName: {type: String, required: true},
    fileType: {type: String, required: true},
    fileUrl: {type: String, required: true},
    category: {type: String}
  },
  {timestamps: true}
);

export const fileSchemaName: string = "File";
