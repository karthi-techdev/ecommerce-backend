import newsLetterRepository from "../repositories/newsLetterRepository";
import subscribeRepository from "../repositories/subscribeRepository";
import fs from "fs";
import path from "path";
import { sendEmail } from "../utils/email";
import ValidationHelper from "../utils/validationHelper";
import { ISubscribe } from "../models/subscribeModel";
import { Types } from "mongoose";

class SubscribeService {

async subscribe(email: string) {

  const error =
    ValidationHelper.isRequired(email, "Email") ||
    email.trim() !== ""
      ? ValidationHelper.isValidEmail(email, "Email")
      : null;

  if (error) {
    throw new Error(error.message);
  }

  const user = await subscribeRepository.findByEmail(email);

  
  if (user) {
    return {
      type: "ALREADY",
      message: "Already Subscribed",
    };
  }


  await subscribeRepository.create(email);

  let htmlContent = "";
  let templatePath = "";

  const isNewsLetter = await newsLetterRepository.getNewsLetterBySlug("subscriber-email");

  if (isNewsLetter && isNewsLetter.isPublished && !isNewsLetter.isDeleted) {
    templatePath = path.join(
      __dirname,
      "../templates/newsletters/subscriber-email.html"
    );
  } else {
    templatePath = path.join(
      __dirname,
      "../templates/default/subscriber-email.html"
    );
  }

  htmlContent = fs.readFileSync(templatePath, "utf-8");

  await sendEmail(email, "Welcome", htmlContent);

  return {
    type: "NEW",
    message: "Subscriber successfully added",
  };
}

async getAllSubscribers(page: number, limit: number, filter: string) {
  return await subscribeRepository.getAll(page, limit, filter);
}

async toggleStatus(id: string | Types.ObjectId): Promise<ISubscribe | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) throw new Error(error.message);

    const subscribe = await subscribeRepository.findById(id);
    if (!subscribe) throw new Error("subcriber  not found");

    const updatedSubscriber = await subscribeRepository.updateSubscribe(id, {
      isActive: !subscribe.isActive
    });

    return updatedSubscriber;
  }

   async hardDeleteSubscriber(
      id: string | Types.ObjectId
    ): Promise<ISubscribe | null> {
  
      const error = ValidationHelper.isValidObjectId(id, "id");
      if (error) throw new Error(error.message);
  
      return await subscribeRepository.permanantDelete(id);
    }
}

export default new SubscribeService();
