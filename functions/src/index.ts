/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import { GeminiParseService } from './gemini/parseComment';
import { GeminiImageEditService } from './gemini/imageEdit';

// generate image editing instructions from a user input
export const generateInstructions = onRequest(async (req, res) => {
    try {
        if (req.method !== 'POST') {
            res.status(405).send({ error: 'method not allowed' });
            return;
        }

        const { userInput, options } = req.body;
        if (!userInput || typeof userInput !== 'string') {
            res.status(400).send({ error: 'invalid request, userInput must be a non-empty string' });
            return;
        }

        const service = new GeminiParseService();
        const result = await service.generateInstructions(userInput, options);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error generating instructions:', error);
        res.status(500).send({ error: 'internal server error' });
    }
})

// image editing service
export const editImage = onRequest(async (req, res) => {
    try {
        if (req.method !== 'POST') {
            res.status(405).send({ error: 'method not allowed' });
            return;
        }

        const { prompt, image } = req.body;
        if (!prompt || typeof prompt !== 'string') {
            res.status(400).send({ error: 'invalid request, prompt must be a non-empty string' });
            return;
        }
        if (!image || typeof image !== 'string') {
            res.status(400).send({ error: 'invalid request, image must be a base64-encoded string' });
            return;
        }

        const service = new GeminiImageEditService();
        const result = await service.editImage(prompt, image);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error editing image:', error);
        res.status(500).send({ error: 'internal server error' });
    }
});