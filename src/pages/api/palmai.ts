import {
  MessagesProps,
  ModelName,
  palmAIGenerateText,
  palmAiGenerateChats,
} from "@/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function palmaiHandler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const MODEL_NAME: ModelName = "models/chat-bison-001";
  const API_KEY = process.env.GOOGLE_PALM_API_KEY;
  const messages: MessagesProps = [
    {
      content: "How about the people?",
    },
  ];

  // try {
    switch (req.method) {
      case "GET":
        res.status(200).json({ role: "GooglePalm" });
      case "POST":
        const contents = JSON.parse(req.body)?.map((item) => ({ content: item.content }));
        console.log(contents, '<<< CEKRESPONSE AI')
        const responseAi = await palmAiGenerateChats(
          API_KEY as string,
          contents,
          MODEL_NAME,
          "Reply in indonesian"
        );
        res
        .status(200)
        .json({
            role: "GooglePalm",
            message: responseAi[0]?.candidates[0].content,
          });
      default:
        res.status(500).json({message: "internal server error"});
    }
  // } catch (error) {
  //   res.status(500).json({
  //     message: error
  //   });
  // }
}
