import 'dotenv/config';
import { ReadStream } from 'fs';
import { Configuration, OpenAIApi } from 'openai';
import fs from 'fs';

const config = new Configuration({
  apiKey: String(process.env.OPENAI_API_KEY),
});

const openai = new OpenAIApi(config);

export const listModels = async () => {
  console.log(await openai.listModels());
};

export const transcribe = async (filepath: string) => {
  let response;
  try {
    response = await openai.createTranscription(fs.createReadStream(filepath) as any, 'whisper-1', undefined, 'text');
  } catch (err) {
    return console.error(err);
  }
  console.log(response.data);
  return response.data.text;
};
