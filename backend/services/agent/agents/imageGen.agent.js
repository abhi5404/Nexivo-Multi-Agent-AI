import axios from "axios";
import { randomUUID } from "node:crypto";
import { getModels } from "../config/llmModels.js";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { getFromS3 } from "../utils/getFromS3.js";

export const visionAgent = async (state) => {
    try {
        const llm = await getModels("imageGen");
        const res = await llm.invoke(`
You are an elite AI image prompt engineer.

Convert the user request into a highly detailed image generation prompt.

Requirements:
- Cinematic lighting
- Professional composition
- Ultra realistic
- High detail
- Beautiful color palette
- Sharp focus
- 8K quality
- Photorealistic
- Depth of field
- Professional photography
- Stunning visuals

Return only the image prompt.

User Request:
${state.prompt}
        `);

        const prompt = String(res.content).trim();
        const imageUrl =
            "https://image.pollinations.ai/prompt/" +
            encodeURIComponent(prompt);

        const imageResponse = await axios.get(imageUrl, {
            responseType: "arraybuffer",
            timeout: 120000,
        });

        const buffer = Buffer.from(imageResponse.data);
        const contentType =
            String(imageResponse.headers["content-type"] || "").split(";")[0] ||
            "image/png";
        const extension = contentType === "image/jpeg" ? "jpg" : "png";
        const filename = `generated-images/${Date.now()}-${randomUUID()}.${extension}`;
        await uploadToS3(filename, buffer, contentType);
        const downloadUrl = await getFromS3(filename, 600);

        return {
            ...state,
            aiResponse:
                "## Generated Image\n\n" +
                `[Download Image](${downloadUrl})\n\n` +
                "Link expires in 10 minutes.",
            images: [downloadUrl],
            artifacts: [],
        };
    } catch (error) {
        console.error("Image generation failed:", error);
        return {
            ...state,
            aiResponse: "Failed to generate image.",
            images: [],
            artifacts: [],
        };
    }
};

export const imageGenAgent = visionAgent;