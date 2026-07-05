import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function checkModeration(input: string) {
  try {
    const res = await client.moderations.create({ model: "omni-moderation-latest", input });
    // res.results is an array; pick first (single string input -> single result)
    return res.results?.[0];
  } catch (err) {
    console.error("Moderation error", err);
    throw err;
  }
}
