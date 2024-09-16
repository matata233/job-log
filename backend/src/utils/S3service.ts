import {PutObjectCommand, DeleteObjectCommand, ListBucketsCommand} from "@aws-sdk/client-s3";
import {v4 as uuidv4} from "uuid";
import path from "path";
import {s3Client} from "../App";

export class s3Service {
  private readonly bucketName: string;

  constructor(bucketName: string) {
    this.bucketName = bucketName;
  }

  public async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileExtension = path.extname(file.originalname);
    // file store in s3 should have a unique name to avoid being overwritten unexpectedly
    const storedFileName = `${uuidv4()}${fileExtension}`;
    const fileUrl = `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${storedFileName}`;

    /**
     * MIME Types
     * Examples of common MIME types include:
     *
     * image/jpeg for JPEG images
     * image/png for PNG images
     * application/pdf for PDF documents
     * application/msword for Microsoft Word documents
     * text/plain for plain text files
     *
     * The ContentType is important because it tells the browser how to handle the file when it is accessed.
     * For example, a ContentType of application/pdf will prompt the browser to open the file in a PDF viewer.
     */
    const uploadParams = {
      Bucket: this.bucketName,
      Key: storedFileName,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    return fileUrl;
  }

  public async removeFile(fileName: string): Promise<void> {
    const deleteParams = {
      Bucket: this.bucketName,
      Key: fileName
    };
    await s3Client.send(new DeleteObjectCommand(deleteParams));
  }
}

// connection test
export const helloS3 = async () => {
  const command = new ListBucketsCommand({});

  const {Buckets} = await s3Client.send(command);
  console.log("Buckets: ");
  console.log(Buckets!.map((bucket) => bucket.Name).join("\n"));
  return Buckets;
};
