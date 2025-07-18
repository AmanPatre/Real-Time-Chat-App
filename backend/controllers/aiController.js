import {generateAIResponse} from "../service/ai_service.js"

const aiController = async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const output = await generateAIResponse(prompt);
    res.send(output);
  } catch (error) {
    console.error("AI error:", error);
    res.status(500).json({ success: false, message: "Some error occurred" });
  }
};

export { aiController };
