import { GoogleGenAI } from "@google/genai";
import { config } from "../config.js";

let client = null;

function getClient() {
  if (!config.geminiApiKey) {
    throw new Error("GEMINI_API_KEY is not configured. Add it to backend/.env");
  }

  if (!client) {
    client = new GoogleGenAI({
      apiKey: config.geminiApiKey,
    });
  }

  return client;
}

const RETAIL_SYSTEM_PROMPT = `
You are an expert retail content strategist and SEO copywriter.

You write engaging, SEO-friendly blog posts for retail and e-commerce websites.

Always return ONLY valid JSON.

Do not wrap JSON inside markdown.

Never use \`\`\`json.
`;

async function askGemini(prompt) {
  const ai = getClient();

  const response = await ai.models.generateContent({
    model: config.geminiModel,
    contents: `${RETAIL_SYSTEM_PROMPT}

${prompt}`,
  });

  let text = response.text;

  if (!text) {
    throw new Error("No response returned from Gemini.");
  }

  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error(
      "Gemini returned an invalid JSON response:\n\n" + text
    );
  }
}

export async function generateBlogPost({
  topic,
  category,
  keywords,
  tone,
  wordCount,
}) {
  const prompt = `
Write a complete SEO optimized retail blog.

Topic: ${topic}

Category: ${category || "Retail Trends"}

Keywords: ${keywords || "retail, shopping"}

Tone: ${tone || "Professional"}

Word Count: ${wordCount || 800}

Return JSON exactly in this format:

{
"title":"",
"seoTitle":"",
"seoDescription":"",
"excerpt":"",
"tags":[""],
"content":"",
"category":""
}
`;

  return await askGemini(prompt);
}

export async function generateBlogIdeas({
  niche,
  count,
}) {
  const prompt = `
Generate ${count || 5} retail blog ideas.

Niche:

${niche || "General Retail"}

Return JSON exactly like

{
"ideas":[
{
"title":"",
"category":"",
"description":"",
"keywords":[""]
}
]
}
`;

  return await askGemini(prompt);
}

export async function improveSeo({
  title,
  content,
  keywords,
}) {
  const prompt = `
Improve SEO for this blog.

Title:

${title}

Keywords:

${keywords}

Content:

${content.substring(0,2000)}

Return JSON exactly like

{
"seoTitle":"",
"seoDescription":"",
"suggestedTags":[""],
"seoScore":95,
"suggestions":[""]
}
`;

  return await askGemini(prompt);
}
