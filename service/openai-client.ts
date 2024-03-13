import { AzureKeyCredential, OpenAIClient } from "@azure/openai";

const endpoint = process.env.OPENAI_END_POINT || "";
const azureApiKey = process.env.OPENAI_API_KEY || "";

export default new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
