import cors from "cors";
import express from "express";
import {connectDB} from "./utils/DBconnection";
import UserRepository from "./repository/UserRepository";
import UserService from "./service/UserService";
import UserController from "./controller/UserController";
import Authenticator from "./utils/Authenticator";
import {helloS3} from "./utils/S3service";
import JobBoardController from "./controller/JobBoardController";
import JobBoardService from "./service/JobBoardService";
import JobBoardRepository from "./repository/JobBoardRepository";
import JobPostRepository from "./repository/JobPostRepository";
import JobPostService from "./service/JobPostService";
import JobPostController from "./controller/JobPostController";
import FileRepository from "./repository/FileRepository";
import FileController from "./controller/FileController";
import FileService from "./service/FileService";
import multer from "multer";
import dotenv from "dotenv";
import {S3Client} from "@aws-sdk/client-s3";
import OpenAIController from "./controller/OpenAIController";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const userRepository = new UserRepository();
const jobBoardRepository = new JobBoardRepository();
const jobPostRepository = new JobPostRepository();
const fileRepository = new FileRepository();

const userController = new UserController(new UserService(userRepository));
const jobBoardController = new JobBoardController(new JobBoardService(jobBoardRepository, jobPostRepository));
const jobPostController = new JobPostController(new JobPostService(jobPostRepository));
const fileController = new FileController(new FileService(fileRepository));
const openAIController = new OpenAIController();

const db = connectDB();
/**
 * S3 reference:
 * https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html
 */
export const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});
export const authenticator = Authenticator.getInstance(userRepository);
const upload = multer({storage: multer.memoryStorage()});
export const endpoint: string = "/job-log/api/v1";

//s3 connection test
helloS3();

// Sample api test
app.get(`${endpoint}/`, (req, res) => {
  res.status(200).json({result: "Welcome to JobLog App!"});
});

// user api
app.get(`${endpoint}/users/`, userController.getAll); // with query param to get a specific user by username
app.post(`${endpoint}/users/`, userController.create);
app.post(`${endpoint}/users/login`, userController.login);
app.put(`${endpoint}/users/`, userController.update);

// job board api
app.get(`${endpoint}/jobBoards/`, jobBoardController.getAllByUserId);
app.get(`${endpoint}/jobBoards/:id`, jobBoardController.getById);
app.post(`${endpoint}/jobBoards/`, jobBoardController.create);
app.put(`${endpoint}/jobBoards/:id`, jobBoardController.update);
app.put(`${endpoint}/jobBoards/:id/status`, jobBoardController.updateStatus);
app.delete(`${endpoint}/jobBoards/:id`, jobBoardController.delete);

// job post api
app.get(`${endpoint}/jobPosts/`, jobPostController.getAllByUserId); // with query param to get all with job board id
app.get(`${endpoint}/jobPosts/:id`, jobPostController.getById);
app.post(`${endpoint}/jobPosts/`, jobPostController.create);
app.put(`${endpoint}/jobPosts/:id`, jobPostController.update);
app.delete(`${endpoint}/jobPosts/:id`, jobPostController.delete);

// file api
app.get(`${endpoint}/files/`, fileController.getAllByUserId); // with query param to get all with job post id and/ or with category
app.get(`${endpoint}/files/:id`, fileController.getById);
app.post(`${endpoint}/files/`, upload.single("file"), fileController.create);
app.put(`${endpoint}/files/:id`, fileController.update);
app.delete(`${endpoint}/files/:id`, fileController.delete);

// AI related features API
app.post(`${endpoint}/jobDescriptionScanner/`, openAIController.jobDescriptionScanner);
app.post(`${endpoint}/jobDescriptionScraper/`, openAIController.jobDescriptionScraper);

export default app;
