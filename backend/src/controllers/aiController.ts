import { Request, Response } from 'express';
import axios from 'axios';
import prisma from '../config/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

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
  "tips": ["tip1", "tip2"],
  "recommendedBusType": "Volvo A/C Sleeper",
  "totalDistance": "XXX km"
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

      // Save plan to DB if user is authenticated
      const authReq = req as AuthRequest;
      if (authReq.user?.id) {
        await prisma.tripPlan.create({
          data: {
            userId: authReq.user.id,
            destination: destination || '',
            days: parseInt(days) || 3,
            travelers: String(travelers || '2'),
            interests: interests || '',
            budget: budget || 'moderate',
            plan: JSON.stringify(plan),
            aiModel: 'gemini',
          },
        }).catch(() => {}); // Non-critical
      }

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

// @desc    AI Chatbot conversation
// @route   POST /api/ai/chat
// @access  Public
export const chatWithAI = async (req: Request, res: Response) => {
  try {
    const { message, sessionId } = req.body;
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id || null;

    // Save user message
    await prisma.chatMessage.create({
      data: {
        sessionId: sessionId || `session-${Date.now()}`,
        userId,
        role: 'user',
        content: message,
      },
    }).catch(() => {});

    // Get conversation history for context
    const history = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      take: 10,
    }).catch(() => []);

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    let reply: string;

    if (GEMINI_API_KEY) {
      const contextMessages = history.map((m: any) => `${m.role}: ${m.content}`).join('\n');
      
      const prompt = `You are a helpful, friendly AI assistant for Munna Tours & Travels, a premium charter bus and group travel company in India.
You help customers with:
- Booking information and route details
- Trip planning and destination suggestions
- Travel tips for Indian destinations
- Package and hotel recommendations
- General travel queries

Current conversation:
${contextMessages}
user: ${message}

Respond naturally and helpfully. Keep responses concise but informative (2-3 paragraphs max).
If they ask about bookings or specific routes, suggest they check the Routes or Packages page.
Always be warm and use an enthusiastic tone. Mention Munna Travels services when relevant.`;

      const geminiRes = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        { contents: [{ parts: [{ text: prompt }] }] }
      );

      reply = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || getSmartFallbackReply(message);
    } else {
      reply = getSmartFallbackReply(message);
    }

    // Save assistant message
    await prisma.chatMessage.create({
      data: {
        sessionId: sessionId || `session-${Date.now()}`,
        userId,
        role: 'assistant',
        content: reply,
      },
    }).catch(() => {});

    res.json({ reply, sessionId: sessionId || `session-${Date.now()}` });
  } catch (error: any) {
    console.error('AI Chat Error:', error?.response?.data || error.message);
    res.json({ reply: getSmartFallbackReply(req.body.message || ''), sessionId: req.body.sessionId });
  }
};

// @desc    AI Route Optimization (suggest optimal stop ordering)
// @route   POST /api/ai/optimize-route
// @access  Private/Admin
export const optimizeRoute = async (req: Request, res: Response) => {
  try {
    const { stops, startPoint, endPoint } = req.body;

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (GEMINI_API_KEY && stops?.length > 2) {
      const prompt = `You are a route optimization AI. Given these stops for a bus route in India:
Start: ${startPoint || stops[0]}
Stops: ${stops.join(', ')}
End: ${endPoint || stops[stops.length - 1]}

Calculate the optimal order to visit all stops to minimize total travel distance.
Consider actual road distances in India.

Return ONLY valid JSON:
{
  "optimizedRoute": ["stop1", "stop2", ...],
  "estimatedDistance": "XXX km",
  "estimatedDuration": "XX hours",
  "savings": "XX% shorter than original",
  "fuelEstimate": "XXX liters (diesel bus)"
}`;

      const geminiRes = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        { contents: [{ parts: [{ text: prompt }] }] }
      );

      const text = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const result = JSON.parse(cleaned);
      res.json(result);
    } else {
      // Fallback: just return the stops in original order with estimates
      res.json({
        optimizedRoute: stops || [],
        estimatedDistance: `${(stops?.length || 3) * 150} km`,
        estimatedDuration: `${(stops?.length || 3) * 2.5} hours`,
        savings: '0% (optimization requires Gemini API key)',
        fuelEstimate: `${(stops?.length || 3) * 15} liters`,
      });
    }
  } catch (error: any) {
    console.error('Route Optimization Error:', error?.response?.data || error.message);
    res.json({
      optimizedRoute: req.body.stops || [],
      estimatedDistance: 'N/A',
      estimatedDuration: 'N/A',
      savings: 'Error during optimization',
      fuelEstimate: 'N/A',
    });
  }
};

// @desc    Get saved trip plans for a user
// @route   GET /api/ai/trip-plans
// @access  Private
export const getSavedTripPlans = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const plans = await prisma.tripPlan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    res.json(plans);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching trip plans', error: error.message });
  }
};

// @desc    Get chat history for a session
// @route   GET /api/ai/chat/:sessionId
// @access  Public
export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { sessionId: req.params.sessionId as string },
      orderBy: { createdAt: 'asc' },
    });
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching chat history', error: error.message });
  }
};

// @desc    Get AI Package Recommendations
// @route   GET /api/ai/recommendations
// @access  Private
export const getAIRecommendations = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user?.id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    // Fetch user's past bookings to build profile
    const pastBookings = await prisma.booking.findMany({
      where: { userId: authReq.user.id },
      include: { tourPackage: true, route: true },
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    const userInterests = pastBookings.map(b => 
      b.tourPackage ? b.tourPackage.destination : b.route?.to
    ).filter(Boolean).join(', ');

    // Fetch all available packages
    const allPackages = await prisma.tourPackage.findMany({
      select: { id: true, title: true, destination: true, category: true, price: true }
    });

    if (!GEMINI_API_KEY) {
      // Fallback: just return top 3 packages randomly or based on popularity
      res.json({ recommendations: allPackages.slice(0, 3), rationale: "Popular choices based on our top destinations." });
      return;
    }

    const prompt = `You are an AI travel recommendation engine. 
The user has previously traveled to: ${userInterests || 'nowhere yet'}.
Here is a list of our available tour packages in JSON format: 
${JSON.stringify(allPackages)}

Based on their past travel history (or general popularity if they have no history), recommend EXACTLY 3 packages from the list above. 
Return a JSON object in this format strictly:
{
  "recommendations": ["package_id_1", "package_id_2", "package_id_3"],
  "rationale": "A friendly 1-2 sentence explanation of why you picked these based on their history."
}
Only output valid JSON, no markdown.`;

    const aiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] }
    );

    const aiText = aiRes.data.candidates[0].content.parts[0].text;
    const cleanJson = aiText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const result = JSON.parse(cleanJson);

    // Hydrate the full package details for the recommended IDs
    const recommendedPackages = await prisma.tourPackage.findMany({
      where: { id: { in: result.recommendations } }
    });

    res.json({
      recommendations: recommendedPackages,
      rationale: result.rationale
    });
  } catch (error: any) {
    console.error('AI Recommendation Error:', error);
    res.status(500).json({ message: 'Error generating recommendations', error: error.message });
  }
};

// @desc    Budget Optimizer
// @route   POST /api/ai/budget-optimizer
// @access  Public
export const optimizeBudget = async (req: Request, res: Response): Promise<void> => {
  try {
    const { destination, maxBudget, travelers, days } = req.body;
    
    // Fetch live inventory
    const routes = await prisma.route.findMany({ where: { to: { contains: destination || '' } }, take: 5 });
    const hotels = await prisma.hotel.findMany({ where: { location: { contains: destination || '' } }, take: 5 });
    
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (GEMINI_API_KEY) {
      const prompt = `You are an advanced Budget Optimizer for Munna Tours & Travels. 
The user wants to travel to ${destination || 'anywhere'} for ${days || 3} days with ${travelers || 2} travelers. 
Their STRICT maximum total budget is ₹${maxBudget}.

Here is our live inventory:
Routes: ${JSON.stringify(routes)}
Hotels: ${JSON.stringify(hotels)}

Find the best combination of Route + Hotel that stays UNDER the ₹${maxBudget} budget limit for the entire trip (including all travelers and days).
Return a strictly formatted JSON object:
{
  "recommendedRouteId": "route_id_here",
  "recommendedHotelId": "hotel_id_here",
  "totalCost": "₹XX,XXX",
  "remainingBudget": "₹XX,XXX",
  "rationale": "A friendly explanation of why this combo fits their budget."
}
Only output valid JSON, no markdown fences.`;

      const aiRes = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        { contents: [{ parts: [{ text: prompt }] }] }
      );

      const aiText = aiRes.data.candidates[0].content.parts[0].text;
      const cleanJson = aiText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      res.json(JSON.parse(cleanJson));
    } else {
       res.json({
         recommendedRouteId: routes[0]?.id || null,
         recommendedHotelId: hotels[0]?.id || null,
         totalCost: `₹${maxBudget - 1000}`,
         remainingBudget: '₹1,000',
         rationale: 'Mock budget optimization since Gemini is disabled.'
       });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Budget optimization failed', error: error.message });
  }
};

// ─── HELPERS ─────────────────────────────────────────────────────

function getSmartFallbackReply(message: string): string {
  const msg = message.toLowerCase();

  if (msg.includes('book') || msg.includes('ticket') || msg.includes('reserve')) {
    return "🎫 I'd love to help you book! You can browse our available routes on the **Routes** page or check out our curated **Travel Packages** for the best deals. If you need a custom quote for a group booking, head to our **Contact** page and we'll get back to you within 2 hours!\n\nFor immediate bookings, select a route, pick your date and passengers, and you can pay securely via Razorpay. You'll get an e-ticket with QR code instantly! 🚌";
  }
  if (msg.includes('track') || msg.includes('where') || msg.includes('bus location')) {
    return "📍 You can track your bus in real-time on our **Live Tracking** page! Just enter your PNR number or registered phone number, and you'll see the live location on a map along with the estimated arrival time.\n\nOur GPS tracking updates every 30 seconds so you'll always know exactly where your bus is.";
  }
  if (msg.includes('package') || msg.includes('tour') || msg.includes('trip')) {
    return "🏖️ We have amazing travel packages! Here are some popular ones:\n\n• **Royal Rajasthan Heritage Tour** (7 days) — ₹28,500/person\n• **Goa Beach Paradise** (4 days) — ₹12,500/person\n• **Kashmir Valley Dream** (6 days) — ₹32,000/person\n• **Kerala Backwaters & Hills** (5 days) — ₹22,000/person\n\nAll packages include hotel stays, AC bus transport, meals, and guided tours. Check our **Packages** page for details!";
  }
  if (msg.includes('price') || msg.includes('cost') || msg.includes('fare') || msg.includes('rate')) {
    return "💰 Our fares are very competitive! Here are some popular routes:\n\n• Ahmedabad → Mumbai: ₹900 (Volvo AC Sleeper)\n• Ahmedabad → Pune: ₹1,200 (Scania Multi-Axle)\n• Ahmedabad → Udaipur: ₹550 (Premium Seater)\n• Delhi → Jaipur: ₹850 (Volvo AC Sleeper)\n\nGroup bookings of 20+ passengers get a **15% discount**! Contact us for a custom quote.";
  }
  if (msg.includes('cancel') || msg.includes('refund')) {
    return "📋 Our cancellation policy:\n\n• **24+ hours before departure**: Full refund\n• **Within 24 hours**: 50% refund\n• **After departure**: No refund\n\nYou can cancel from your **My Bookings** page. Refunds are processed within 5-7 business days to your original payment method.";
  }
  if (msg.includes('hotel') || msg.includes('stay') || msg.includes('accommodation')) {
    return "🏨 Yes, we partner with quality hotels across India! From budget-friendly Zostels (₹1,200/night) to luxury 5-star properties like The Leela Palace (₹18,500/night). You can browse hotels on our **Hotels** page or get them bundled in our travel packages for the best value!";
  }
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('namaste')) {
    return "🙏 Namaste! Welcome to Munna Tours & Travels! I'm your AI travel assistant. How can I help you today?\n\nI can assist with:\n• 🚌 **Route Information** and booking\n• 🏖️ **Travel Packages** and deals\n• 📍 **Live Bus Tracking**\n• 🏨 **Hotel Recommendations**\n• 🗺️ **Trip Planning** with AI\n\nJust ask me anything!";
  }
  if (msg.includes('driver') || msg.includes('safe') || msg.includes('staff')) {
    return "👨‍✈️ All our drivers are professionally trained with 5+ years of experience. They hold valid commercial licenses and undergo regular background checks.\n\nOur fleet is equipped with GPS tracking, speed governors, and CCTV cameras for your safety. We maintain a 4.8★ average driver rating!";
  }

  return "Thanks for reaching out! 😊 I'm your Munna Travels AI assistant. I can help you with:\n\n• **Route bookings** and fare info\n• **Travel packages** across India\n• **Trip planning** powered by AI\n• **Live bus tracking**\n• **Hotel recommendations**\n\nFeel free to ask me anything about your travel plans! You can also explore our **Routes** and **Packages** pages for the latest deals. 🚌✨";
}

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
    recommendedBusType: 'Volvo A/C Sleeper',
    totalDistance: `${numDays * 120} km`,
    tips: [
      'Book your Munna Travels charter bus at least 3 days in advance for the best rates.',
      `${dest} is best visited between October and March for pleasant weather.`,
      'Carry sunscreen, comfortable walking shoes, and a reusable water bottle.',
    ]
  };
}
