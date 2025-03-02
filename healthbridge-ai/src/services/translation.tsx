import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate";

const TranslateService = async (userText: string, targetLanguage: string) => {
    const client = new TranslateClient({ 
        region: "us-east-1",
        credentials: {
            accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
            secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
        }
    });

    const params = {
      /** input parameters */
      SourceLanguageCode: "auto", 
      TargetLanguageCode: targetLanguage,
      Text: userText,
    };
    const command = new TranslateTextCommand(params);
    const response = await client.send(command);
    console.log(response);
    console.log(command);
    return response.TranslatedText;
};

export default TranslateService;
