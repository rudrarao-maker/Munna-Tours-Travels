import { Request, Response } from 'express';
import axios from 'axios';

// @desc    Generate an AI Trip Plan
// @route   POST /api/ai/trip-plan
// @access  Public
export const generateTripPlan = async (req: Request, res: Response) => {
  try {
    const { destination, days, travelers, interests, budget } = req.body;

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (GEMINI_API_KEY) {
      // Real Gemini API call
      const prompt = `You are a professional travel planner for Munna Tours & Travels, a premium charter bus company in India. 
Create a detailed ${days}-day trip itinerary to ${destination} for ${travelers} travelers.
Their interests: ${interests || 'sightseeing, local food, culture'}.
Budget level: ${budget || 'moderate'}.

Format the response as a JSON object with this structure:
{
  "title": "Trip title",
  "summary": "Brief 1-line summary",
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "activities": [
        { "time": "9:00 AM", "activity": "Description", "location": "Place name" }
      ]
    }
  ],
  "estimatedCost": "₹XX,XXX per person",
  "tips": ["tip1", "tip2"]
}

Only respond with valid JSON, no markdown.`;

      const geminiRes = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: prompt }] }]
        }
      );

      const text = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text;
      // Try to parse as JSON, strip markdown fences if present
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const plan = JSON.parse(cleaned);
      res.json(plan);

    } else {
      // Smart fallback: Generate a realistic demo itinerary without AI
      const plan = generateFallbackPlan(destination, parseInt(days), travelers, interests, budget);
      res.json(plan);
    }

  } catch (error: any) {
    console.error('AI Trip Plan Error:', error?.response?.data || error.message);
    // On any error, return fallback
    const { destination, days, travelers, interests, budget } = req.body;
    const plan = generateFallbackPlan(destination, parseInt(days) || 3, travelers, interests, budget);
    res.json(plan);
  }
};

function generateFallbackPlan(destination: string, days: number, travelers: string, interests: string, budget: string) {
  const dest = destination || 'Goa';
  const numDays = days || 3;

  const morningActivities = [
    { time: '7:00 AM', activity: 'Sunrise breakfast at a local dhaba', location: `${dest} Old Town` },
    { time: '8:00 AM', activity: 'Visit the famous heritage temple', location: `${dest} Heritage Zone` },
    { time: '7:30 AM', activity: 'Morning nature walk and photography', location: `${dest} National Park` },
  ];
  const afternoonActivities = [
    { time: '12:00 PM', activity: 'Traditional thali lunch experience', location: `${dest} Food Street` },
    { time: '1:00 PM', activity: 'Guided cultural heritage tour', location: `${dest} Museum & Gallery` },
    { time: '12:30 PM', activity: 'Local market shopping and street food', location: `${dest} Bazaar` },
  ];
  const eveningActivities = [
    { time: '5:00 PM', activity: 'Scenic sunset viewpoint visit', location: `${dest} Hills` },
    { time: '6:00 PM', activity: 'Evening aarti / cultural ceremony', location: `${dest} Riverside` },
    { time: '5:30 PM', activity: 'Leisure time at resort pool or spa', location: `${dest} Resort` },
  ];

  const daysArr = [];
  for (let i = 0; i < numDays; i++) {
    daysArr.push({
      day: i + 1,
      title: i === 0 ? `Arrival & ${dest} Highlights` : i === numDays - 1 ? `Final Exploration & Departure` : `Day ${i + 1} Deep Dive`,
      activities: [
        morningActivities[i % morningActivities.length],
        afternoonActivities[i % afternoonActivities.length],
        eveningActivities[i % eveningActivities.length],
      ]
    });
  }

  return {
    title: `${numDays}-Day ${dest} Adventure`,
    summary: `A curated ${numDays}-day trip to ${dest} for ${travelers || '4'} travelers, covering heritage, food, and local culture.`,
    days: daysArr,
    estimatedCost: budget === 'luxury' ? '₹15,000 per person' : budget === 'budget' ? '₹4,000 per person' : '₹8,000 per person',
    tips: [
      'Book your Munna Travels charter bus at least 3 days in advance for the best rates.',
      `${dest} is best visited between October and March for pleasant weather.`,
      'Carry sunscreen, comfortable walking shoes, and a reusable water bottle.',
    ]
  };
}
