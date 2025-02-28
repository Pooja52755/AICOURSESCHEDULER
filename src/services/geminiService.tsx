import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize GoogleGenerativeAI with the API key
const genAI = new GoogleGenerativeAI('AIzaSyAuDgmnukqek1RFXEv_ysDJAUohH1ZuUMk');

export const sendImageToGemini = async (base64Image) => {
  try {
    console.log("Sending image to Gemini API...");

    // Strip out the data URL prefix (if present)
    const base64Data = base64Image.replace(/^data:image\/(png|jpeg);base64,/, '');

    // Use the generative model (adjust this as needed)
    const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-pro' });

    // Send the image data and request captioning (adjust for your use case)
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data, // Only the base64 part (no prefix)
          mimeType: "image/jpeg", // Ensure this is correct based on the image type
        },
      },
      'Please extract the timetable from this image, covering the schedule from Monday to Sunday. Format the response properly for rendering in a table.',
    ]);

    console.log("Gemini API response:", result.response.text());

    // Returning the result from Gemini API
    return result.response.text(); // Process result as per your requirement
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to process the timetable.");
  }
};
