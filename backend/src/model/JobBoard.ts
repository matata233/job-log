import {Schema, Document} from "mongoose";

export interface IStatus {
  statusName: string;
}

export interface IJobBoard extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  description: string;
  statusOrder: IStatus[];
}

export const jobBoardSchema = new Schema<IJobBoard>(
  {
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true},
    title: {type: String, required: true},
    description: {type: String},
    statusOrder: {
      type: [
        {
          statusName: {type: String, required: true}
        }
      ],
      default: [
        {statusName: "Wishlist"},
        {statusName: "Applied"},
        {statusName: "Interview"},
        {statusName: "Offer Received"},
        {statusName: "Rejected"}
      ]
    }
  },
  {timestamps: true}
);

export const jobBoardSchemaName: string = "JobBoard";
