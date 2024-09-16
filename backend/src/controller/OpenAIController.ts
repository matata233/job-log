import {extractJD} from "../utils/JDScanner";
import {Request, Response} from "express";
import {scrapeJD} from "../utils/JDScraper";
import {authenticator} from "../App";

export default class OpenAIController {
  public jobDescriptionScanner = async (req: Request, res: Response): Promise<Response> => {
    try {
      await authenticator.getCurrentUser(req.headers.authorization);
      const jobDescription = req.body.jobDescription;
      const result = await extractJD(jobDescription);
      if (result) {
        return res.json(result);
      } else {
        return res.status(500).json({success: false, message: "Error parsing job description result."});
      }
    } catch (error: any) {
      return res.status(500).json({success: false, message: error.message});
    }
  };

  public jobDescriptionScraper = async (req: Request, res: Response): Promise<Response> => {
    try {
      await authenticator.getCurrentUser(req.headers.authorization);
      const link = req.body.jobUrl;
      const result = await scrapeJD(link);
      if (result) {
        return res.json(result);
      } else {
        return res.status(500).json({success: false, message: "Error scraping job description result."});
      }
    } catch (error: any) {
      return res.status(500).json({success: false, message: error.message});
    }
  };
}
