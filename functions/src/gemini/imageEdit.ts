// This service asks Gemini to make an edit to an image based on 
// the natural-language prompt given
// image will be sent and received as a base64-encoded string
// any encoding/decoding will be done outside this service

import { GoogleGenAI } from '@google/genai';

export default class GeminiImageEditService {
    private apiKey: string;
    private client: GoogleGenAI;
    private model: any;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        const model = process.env.GEMINI_MODEL_IMAGE;
        if (!apiKey) throw new Error('GEMINI_API_KEY environment variable is not set');
        if (!model) throw new Error('GEMINI_MODEL_IMAGE environment variable is not set');

        this.apiKey = apiKey;
        this.client = new GoogleGenAI({});
    }

    // imageFileToBase64(filePath: string): string {
    //   const imageBuffer = fs.readFileSync(filePath);
    //   return imageBuffer.toString('base64');
    // }

    // base64ToImageFile(base64String: string, outputPath: string): void {
    //   const buffer = Buffer.from(base64String, 'base64');
    //   fs.writeFileSync(outputPath, buffer);
    // }

    async editImage(prompt: string, image: Base64URLString) {

        // make instruction
        const instruction = [
            { text: prompt },
            {
            inlineData: {
                mimeType: "image/png",
                data: image,
            },
            },
        ];

        // API call
        const response = await this.client.models.generateContent({
            model: this.model,
            contents: instruction,
        })

        return response;
    }
}

export { GeminiImageEditService };