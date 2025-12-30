import { GoogleGenAI, Type } from "@google/genai";
import { Story, NeuralAnalysis, Comment } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

// Helper to generate random IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

export const fetchFutureStories = async (): Promise<Story[]> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Generate 15 realistic Hacker News headlines for a date in the year 2035.
      Themes: Artificial General Intelligence (AGI) rights, Mars colony logistics, Brain-Computer Interface (BCI) apps, Fusion power startups, Quantum internet protocols, Synthetic biology, Climate engineering.
      
      Make them sound like technical, somewhat cynical, or exciting tech news typical of HN.
      Include a mix of scientific breakthroughs, corporate blunders, and open source projects.
      
      Return a JSON array.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              domain: { type: Type.STRING },
              points: { type: Type.INTEGER, description: "Between 5 and 2000" },
              user: { type: Type.STRING },
              time_ago: { type: Type.STRING, description: "e.g., '2 hours ago'" },
              comments_count: { type: Type.INTEGER },
              tags: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Max 2 tags like 'AI', 'Space', 'Hardware'"
              },
              sentiment: { type: Type.STRING, enum: ['positive', 'neutral', 'negative', 'controversial'] },
              impact_score: { type: Type.INTEGER, description: "A score 0-100 indicating importance" }
            },
            required: ['title', 'domain', 'points', 'user', 'time_ago', 'comments_count', 'tags', 'sentiment', 'impact_score']
          }
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      // Map to add IDs and rank
      return data.map((item: any, index: number) => ({
        ...item,
        id: generateId(),
        rank: index + 1
      }));
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch stories", error);
    return [];
  }
};

export const analyzeStory = async (storyTitle: string): Promise<NeuralAnalysis | null> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Analyze this 2035 Hacker News headline: "${storyTitle}".
      Provide a brief summary of what the article might be about, a probability score that it is true (0-100), related topics, and the bull/bear case for this technology/event.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "2 sentences max" },
            factCheckProbability: { type: Type.INTEGER },
            relatedTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
            bullCase: { type: Type.STRING, description: "One sentence optimistic view" },
            bearCase: { type: Type.STRING, description: "One sentence pessimistic view" }
          },
          required: ['summary', 'factCheckProbability', 'relatedTopics', 'bullCase', 'bearCase']
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as NeuralAnalysis;
    }
    return null;
  } catch (error) {
    console.error("Failed to analyze story", error);
    return null;
  }
};

export const fetchDiscussion = async (storyTitle: string): Promise<Comment[]> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Generate a threaded comment section for a 2035 Hacker News article titled: "${storyTitle}".
      Generate 4-6 comments.
      Include a mix of:
      1. Cynical old-school programmers.
      2. AI Agents (labeled as verified bots) providing data.
      3. Enthusiasts.
      
      Return a JSON array.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              user: { type: Type.STRING },
              is_ai: { type: Type.BOOLEAN },
              text: { type: Type.STRING },
              time_ago: { type: Type.STRING },
              indent_level: { type: Type.INTEGER, description: "0 for top level, 1 for reply" }
            },
            required: ['user', 'is_ai', 'text', 'time_ago', 'indent_level']
          }
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return data.map((item: any) => ({
        ...item,
        id: generateId()
      }));
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch discussion", error);
    return [];
  }
};