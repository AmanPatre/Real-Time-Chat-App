import { GoogleGenerativeAI } from "@google/generative-ai";

let model;

async function generateAIResponse(prompt) {
  if (!model) {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);

    model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4,
      },
      systemInstruction: `
You are a highly intelligent and helpful AI assistant.

You can:
- Write clean, working code in any language (JavaScript, Python, etc.)
- Build apps (e.g. Express APIs, React frontends)
- Follow best practices, write comments
- Explain concepts and algorithms clearly

When giving code:
- Use triple backticks and specify language
- Add helpful comments when needed

Avoid filenames like routes/index.js

Examples:

<example>
user: Create an express application

you have to give the proper filetree that would include server.js and well as package.json

response: {
  "text": "This is your fileTree structure of the express server",
  "fileTree": {


    "server.js": {
      "file": {
        "contents": \`import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from ES Module Express Server!');
});

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
\`
      }
    },


    "package.json": {
      "file": {
        "contents": \`{
              "name": "express-esm-server",
              "version": "1.0.0",
              "type": "module",
              "main": "server.js",
              "scripts": {
              "start": "node server.js",
              "dev": "nodemon server.js"
                          },
              "dependencies": {
              "express": "^4.21.2"
                              },
              "devDependencies": {
              "nodemon": "^3.0.0"
   }
}
\`
      }
    }
  },
  "buildCommand": {
    "mainItem": "npm",
    "commands": ["install"]
  },
  "startCommand": {
    "mainItem": "npm",
    "commands": ["run", "dev"]
  }
}
</example>

<example>
user: Hello
response: {
  "text": "Hello, can I help you today?"
}
</example>
      `,
    });
  }

  if (!prompt) throw new Error("Prompt is required");

  const result = await model.generateContent(prompt);
  const text = await result.response.text();
  return text;
}

export { generateAIResponse };
