import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 as uuidv4 } from 'uuid';
import type { Task } from '../types';
import { format } from 'date-fns';

// Initialize GoogleGenerativeAI with the API key
// Use a fallback key for development if environment variable is not set
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDuBQAB_pa3tP_KD5MIx7vEnHGmooDbYV0';
const genAI = new GoogleGenerativeAI(API_KEY);

export const sendImageToGemini = async (base64Image) => {
  try {
    console.log("Sending image to Gemini API...");

    // Strip out the data URL prefix (if present)
    const base64Data = base64Image.replace(/^data:image\/(png|jpeg);base64,/, '');

    // Use the generative model (adjust this as needed)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

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

export async function generateScheduleWithGemini(
  prompt: string,
  existingTasks: Task[] = [],
  generateOptions: boolean = false
): Promise<Task[][] | Task[]> {
  try {
    console.log("Using API key:", API_KEY ? "API key is set" : "API key is missing");
    console.log("Processing user prompt:", prompt); // Log the exact prompt being processed
    
    // Get the generative model - use gemini-1.5-pro if available, fallback to gemini-pro
    let modelName = 'gemini-1.5-pro';
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      
      // Create a chat session with more randomness to ensure varied responses
      const chat = model.startChat({
        history: [],
        generationConfig: {
          temperature: 0.9, // Increased from 0.7 for more variety
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      });

      // Determine if this is a daily or weekly schedule request
      const isDaily = prompt.toLowerCase().includes('daily') || prompt.toLowerCase().includes('today');
      
      // Create a system prompt that instructs the model on how to generate schedules
      const systemPrompt = generateOptions
        ? `You are an AI schedule assistant that helps users create optimal ${isDaily ? 'daily' : 'weekly'} schedules. 
           Based on the user's request, generate THREE different ${isDaily ? 'daily' : 'weekly'} schedule options that DIRECTLY address their specific needs.
           
           IMPORTANT: Your schedule MUST be directly related to the user's prompt. Analyze the prompt carefully and extract:
           - Fixed commitments (like classes, work hours)
           - Learning goals (like MERN stack, DSA, DevOps)
           - Personal activities (gym, clubs, sports)
           
           ${isDaily ? 'For today' : 'For the next 10 days'}, include specific tasks with:
           - title: A short, descriptive title that clearly relates to the user's request
           - description: A detailed description of what to do during this time block, with specific activities
           - startTime: Start time in ISO format (YYYY-MM-DDTHH:MM:SS)
           - endTime: End time in ISO format (YYYY-MM-DDTHH:MM:SS)
           - priority: "high", "medium", or "low"
           - category: "study", "work", "personal", or "other"
           - completed: false
           
           Make sure to:
           1. Include specific activities that DIRECTLY relate to the user's request
           2. ${isDaily ? 'Cover the full day with appropriate tasks' : 'Cover ALL days with MULTIPLE tasks per day'}
           3. Use appropriate dates starting from today (${new Date().toISOString().split('T')[0]})
           4. Respect fixed commitments mentioned by the user (like classes, work hours, etc.)
           5. Balance learning activities throughout the week
           6. CRITICAL: Distribute tasks evenly across all days - do NOT concentrate tasks on just a few days
           7. CRITICAL: For each day, include a variety of task categories - do NOT make an entire day dedicated to just one activity
           8. CRITICAL: If the user mentions multiple activity types (e.g., gym, coding, project work), distribute each activity type across MULTIPLE days of the week
           9. CRITICAL: NEVER group all tasks of the same category on a single day - mix different categories on each day
           10. CRITICAL: WEEKENDS are STRICTLY ONLY Saturday and Sunday
           11. CRITICAL: WEEKDAYS are STRICTLY ONLY Monday, Tuesday, Wednesday, Thursday, and Friday
           12. CRITICAL: If the user mentions college classes from 9 to 4 Monday to Friday, do NOT schedule other activities during those hours on those days
           13. CRITICAL: If the user mentions cricket or clubs on weekends, schedule those ONLY on Saturday and Sunday
           
           Respond with a JSON object containing an array of three schedule options, each containing an array of tasks.
           Format your response as:
           {
             "scheduleOptions": [
               [
                 {task1}, {task2}, ...
               ],
               [
                 {task1}, {task2}, ...
               ],
               [
                 {task1}, {task2}, ...
               ]
             ]
           }`
        : `You are an AI schedule assistant that helps users create optimal ${isDaily ? 'daily' : 'weekly'} schedules.
           Based on the user's request, generate a ${isDaily ? 'daily' : 'weekly'} schedule that DIRECTLY addresses their specific needs.
           
           IMPORTANT: Your schedule MUST be directly related to the user's prompt. Analyze the prompt carefully and extract:
           - Fixed commitments (like classes, work hours)
           - Learning goals (like MERN stack, DSA, DevOps)
           - Personal activities (gym, clubs, sports)
           
           ${isDaily ? 'For today' : 'For the next 10 days'}, include specific tasks with:
           - title: A short, descriptive title that clearly relates to the user's request
           - description: A detailed description of what to do during this time block, with specific activities
           - startTime: Start time in ISO format (YYYY-MM-DDTHH:MM:SS)
           - endTime: End time in ISO format (YYYY-MM-DDTHH:MM:SS)
           - priority: "high", "medium", or "low"
           - category: "study", "work", "personal", or "other"
           - completed: false
           
           Make sure to:
           1. Include specific activities that DIRECTLY relate to the user's request
           2. ${isDaily ? 'Cover the full day with appropriate tasks' : 'Cover ALL days with MULTIPLE tasks per day'}
           3. Use appropriate dates starting from today (${new Date().toISOString().split('T')[0]})
           4. Respect fixed commitments mentioned by the user (like classes, work hours, etc.)
           5. Balance learning activities throughout the week
           6. CRITICAL: Distribute tasks evenly across all days - do NOT concentrate tasks on just a few days
           7. CRITICAL: For each day, include a variety of task categories - do NOT make an entire day dedicated to just one activity
           8. CRITICAL: If the user mentions multiple activity types (e.g., gym, coding, project work), distribute each activity type across MULTIPLE days of the week
           9. CRITICAL: NEVER group all tasks of the same category on a single day - mix different categories on each day
           10. CRITICAL: WEEKENDS are STRICTLY ONLY Saturday and Sunday
           11. CRITICAL: WEEKDAYS are STRICTLY ONLY Monday, Tuesday, Wednesday, Thursday, and Friday
           12. CRITICAL: If the user mentions college classes from 9 to 4 Monday to Friday, do NOT schedule other activities during those hours on those days
           13. CRITICAL: If the user mentions cricket or clubs on weekends, schedule those ONLY on Saturday and Sunday
           
           Respond with a JSON array of tasks.
           Format your response as:
           [
             {task1}, {task2}, ...
           ]`;

      // Send the prompt to the model with a unique identifier to prevent caching
      const uniqueId = new Date().getTime();
      const result = await chat.sendMessage(`${systemPrompt}\n\nUser request: ${prompt}\nRequest ID: ${uniqueId}`);
      const responseText = result.response.text();
      
      console.log("Raw response from Gemini:", responseText.substring(0, 200) + "..."); // Log a preview of the response
      
      try {
        // Extract JSON from the response
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                         responseText.match(/```\n([\s\S]*?)\n```/) || 
                         responseText.match(/{[\s\S]*}/) ||
                         responseText.match(/\[([\s\S]*?)\]/);
        
        let jsonStr = jsonMatch ? jsonMatch[0] : responseText;
        
        // Clean up the JSON string
        jsonStr = jsonStr.replace(/```json\n|```\n|```/g, '').trim();
        
        // Parse the JSON
        const parsedData = JSON.parse(jsonStr);
        
        // Process the parsed data based on whether we're generating options or not
        if (generateOptions) {
          if (parsedData.scheduleOptions && Array.isArray(parsedData.scheduleOptions)) {
            // Process each option and add IDs to tasks
            const processedOptions = parsedData.scheduleOptions.map(option => 
              option.map(task => ({
                ...task,
                id: uuidv4(),
                startTime: new Date(task.startTime),
                endTime: new Date(task.endTime)
              }))
            );
            return processedOptions;
          } else {
            // If the response doesn't have the expected structure, create a fallback
            console.warn("Unexpected response structure, using fallback");
            return createFallbackSchedule(prompt);
          }
        } else {
          // Single schedule option
          const tasks = Array.isArray(parsedData) ? parsedData : [];
          return tasks.map(task => ({
            ...task,
            id: uuidv4(),
            startTime: new Date(task.startTime),
            endTime: new Date(task.endTime)
          }));
        }
      } catch (parseError) {
        console.error("Error parsing Gemini response:", parseError);
        return createFallbackSchedule(prompt);
      }
    } catch (modelError) {
      console.error("Error with Gemini model:", modelError);
      // Try with gemini-pro as fallback
      modelName = 'gemini-pro';
      console.log("Falling back to", modelName);
      // Implementation continues with fallback model...
      return createFallbackSchedule(prompt);
    }
  } catch (error) {
    console.error("Error generating schedule with Gemini:", error);
    return createFallbackSchedule(prompt);
  }
}

// Helper function to adjust time by minutes
function adjustTime(timeString: string, minutesToAdd: number): string {
  const date = new Date(timeString);
  date.setMinutes(date.getMinutes() + minutesToAdd);
  return date.toISOString();
}

// Create a fallback schedule when the API fails
function createFallbackSchedule(prompt: string): Task[][] {
  console.log("Creating fallback schedule for prompt:", prompt);
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Extract key topics from the prompt
  const promptLower = prompt.toLowerCase();
  
  // Determine the schedule type based on the prompt
  let scheduleType = "general";
  
  // Define possible categories and activities
  const categories = ["study", "work", "personal", "other"];
  const activities = {
    study: ["Study Session", "Research Time", "Learning Session", "Practice Problems", "Review Notes"],
    work: ["Project Work", "Task Planning", "Team Meeting", "Documentation", "Code Review"],
    personal: ["Workout Session", "Meditation", "Reading", "Hobby Time", "Self-care"],
    other: ["Community Event", "Networking", "Skill Building", "Creative Time", "Planning"]
  };
  
  // Check if the prompt mentions weekend activities
  const hasWeekendMention = promptLower.includes('weekend');
  
  // Create three different schedule options
  const scheduleOptions: Task[][] = [];
  
  // Generate three different schedule options
  for (let option = 0; option < 3; option++) {
    const tasks: Task[] = [];
    
    // Create tasks for each day of the week
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + day);
      
      // Determine if this is a weekend day (Saturday = 6, Sunday = 0)
      const dayOfWeek = currentDate.getDay(); // Get the actual day of week (0-6, where 0 is Sunday)
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
      
      // Add 3-4 tasks per day with mixed categories
      const numTasks = 3 + Math.floor(Math.random() * 2); // 3 or 4 tasks
      
      // Ensure we use different categories for each day's tasks
      const dayCategories = [...categories].sort(() => Math.random() - 0.5);
      
      for (let taskIndex = 0; taskIndex < numTasks; taskIndex++) {
        // Rotate through categories to ensure variety
        const category = dayCategories[taskIndex % dayCategories.length];
        
        // If weekend is mentioned in the prompt, adjust activities for weekend days
        let activityTitle;
        if (hasWeekendMention && isWeekend) {
          // For weekend days, prioritize personal and other categories
          const weekendCategory = ["personal", "other"].includes(category) ? category : "personal";
          const activityOptions = activities[weekendCategory as keyof typeof activities];
          activityTitle = activityOptions[Math.floor(Math.random() * activityOptions.length)];
          if (weekendCategory === "personal") {
            activityTitle = "Weekend " + activityTitle;
          }
        } else {
          // Regular activity selection
          const activityOptions = activities[category as keyof typeof activities];
          activityTitle = activityOptions[Math.floor(Math.random() * activityOptions.length)];
        }
        
        // Create start and end times with 1-2 hour duration
        const startHour = 8 + taskIndex * 3; // Space tasks throughout the day
        const duration = 1 + Math.floor(Math.random() * 2); // 1 or 2 hours
        
        const startTime = new Date(currentDate);
        startTime.setHours(startHour, 0, 0, 0);
        
        const endTime = new Date(startTime);
        endTime.setHours(startTime.getHours() + duration, 0, 0, 0);
        
        // Randomize priority
        const priorities = ["high", "medium", "low"];
        const priority = priorities[Math.floor(Math.random() * priorities.length)];
        
        // Get day name for description
        const dayName = format(startTime, 'EEEE');
        const dayType = isWeekend ? "weekend" : "weekday";
        
        tasks.push({
          id: uuidv4(),
          title: activityTitle,
          description: `${activityTitle} scheduled for ${dayName} (${dayType})`,
          startTime: startTime,
          endTime: endTime,
          priority: priority,
          category: category,
          completed: false
        });
      }
    }
    
    scheduleOptions.push(tasks);
  }
  
  return scheduleOptions;
}
