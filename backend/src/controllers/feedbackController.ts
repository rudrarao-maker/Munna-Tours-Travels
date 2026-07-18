import { Request, Response } from 'express';
import prisma from '../config/prisma';
import axios from 'axios';
import { AuthRequest } from '../middlewares/authMiddleware';

// @desc    Submit feedback for a booking
// @route   POST /api/feedback
// @access  Private
export const submitFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const { bookingId, rating, comment, categories } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // Check if feedback already exists for this booking
    const existing = await prisma.feedback.findUnique({ where: { bookingId } });
    if (existing) {
      res.status(400).json({ message: 'Feedback already submitted for this booking' });
      return;
    }

    // Analyze sentiment using Gemini API (or fallback)
    let sentimentScore = 0;
    let sentimentLabel = 'neutral';

    try {
      const sentimentResult = await analyzeSentiment(comment || '');
      sentimentScore = sentimentResult.score;
      sentimentLabel = sentimentResult.label;
    } catch {
      // Fallback simple sentiment
      const simpleResult = simpleSentimentAnalysis(comment || '');
      sentimentScore = simpleResult.score;
      sentimentLabel = simpleResult.label;
    }

    const feedback = await prisma.feedback.create({
      data: {
        bookingId,
        userId,
        rating: parseInt(String(rating)),
        comment: comment || '',
        sentimentScore,
        sentimentLabel,
        categories: categories ? JSON.stringify(categories) : '[]',
        analyzedAt: new Date(),
      },
    });

    res.status(201).json(feedback);
  } catch (error: any) {
    res.status(500).json({ message: 'Error submitting feedback', error: error.message });
  }
};

// @desc    Get all feedback (admin)
// @route   GET /api/feedback
// @access  Private/Admin
export const getAllFeedback = async (req: Request, res: Response) => {
  try {
    const { sentiment, minRating, page = '1', limit = '20' } = req.query;
    const skip = (parseInt(String(page)) - 1) * parseInt(String(limit));

    const where: any = {};
    if (sentiment) where.sentimentLabel = String(sentiment);
    if (minRating) where.rating = { gte: parseInt(String(minRating)) };

    const [feedbacks, total] = await Promise.all([
      prisma.feedback.findMany({
        where,
        include: {
          user: { select: { email: true, name: true } },
          booking: { include: { route: { select: { from: true, to: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        take: parseInt(String(limit)),
        skip,
      }),
      prisma.feedback.count({ where }),
    ]);

    // Calculate sentiment distribution
    const [positive, neutral, negative] = await Promise.all([
      prisma.feedback.count({ where: { sentimentLabel: 'positive' } }),
      prisma.feedback.count({ where: { sentimentLabel: 'neutral' } }),
      prisma.feedback.count({ where: { sentimentLabel: 'negative' } }),
    ]);

    const avgRating = await prisma.feedback.aggregate({ _avg: { rating: true } });

    res.json({
      feedbacks,
      total,
      page: parseInt(String(page)),
      pages: Math.ceil(total / parseInt(String(limit))),
      stats: {
        avgRating: avgRating._avg.rating || 0,
        distribution: { positive, neutral, negative },
        total,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching feedback', error: error.message });
  }
};

// @desc    Respond to feedback (admin)
// @route   PUT /api/feedback/:id/respond
// @access  Private/Admin
export const respondToFeedback = async (req: Request, res: Response) => {
  try {
    const { adminResponse } = req.body;
    const feedback = await prisma.feedback.update({
      where: { id: req.params.id as string },
      data: { adminResponse },
    });
    res.json(feedback);
  } catch (error: any) {
    res.status(500).json({ message: 'Error responding to feedback', error: error.message });
  }
};

// @desc    Get sentiment analytics
// @route   GET /api/feedback/analytics
// @access  Private/Admin
export const getSentimentAnalytics = async (req: Request, res: Response) => {
  try {
    const totalFeedback = await prisma.feedback.count();
    const avgRating = await prisma.feedback.aggregate({ _avg: { rating: true, sentimentScore: true } });
    
    const [positive, neutral, negative] = await Promise.all([
      prisma.feedback.count({ where: { sentimentLabel: 'positive' } }),
      prisma.feedback.count({ where: { sentimentLabel: 'neutral' } }),
      prisma.feedback.count({ where: { sentimentLabel: 'negative' } }),
    ]);

    // Recent feedback trend (last 30)
    const recentFeedback = await prisma.feedback.findMany({
      take: 30,
      orderBy: { createdAt: 'desc' },
      select: { rating: true, sentimentScore: true, sentimentLabel: true, createdAt: true },
    });

    res.json({
      totalFeedback,
      avgRating: avgRating._avg.rating || 0,
      avgSentiment: avgRating._avg.sentimentScore || 0,
      distribution: { positive, neutral, negative },
      trend: recentFeedback.reverse(),
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching sentiment analytics', error: error.message });
  }
};

// ─── AI SENTIMENT ANALYSIS ──────────────────────────────────────

async function analyzeSentiment(text: string): Promise<{ score: number; label: string }> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY || !text.trim()) {
    return simpleSentimentAnalysis(text);
  }

  const prompt = `Analyze the sentiment of this customer feedback for a travel/bus company. 
Return ONLY a JSON object with no markdown:
{"score": <number between -1.0 and 1.0>, "label": "<positive|neutral|negative>"}

Feedback: "${text}"`;

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    { contents: [{ parts: [{ text: prompt }] }] }
  );

  const resultText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const cleaned = resultText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}

function simpleSentimentAnalysis(text: string): { score: number; label: string } {
  if (!text.trim()) return { score: 0, label: 'neutral' };
  
  const positiveWords = ['great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'best', 'perfect', 'comfortable', 'clean', 'punctual', 'friendly', 'smooth', 'recommend', 'enjoyed', 'happy', 'superb', 'awesome', 'good'];
  const negativeWords = ['terrible', 'awful', 'worst', 'bad', 'horrible', 'dirty', 'late', 'rude', 'uncomfortable', 'broken', 'poor', 'disappointed', 'waste', 'never', 'complaint', 'pathetic', 'disgusting', 'delayed', 'overpriced'];

  const words = text.toLowerCase().split(/\s+/);
  let score = 0;
  words.forEach(word => {
    if (positiveWords.includes(word)) score += 0.2;
    if (negativeWords.includes(word)) score -= 0.2;
  });

  score = Math.max(-1, Math.min(1, score));
  const label = score > 0.1 ? 'positive' : score < -0.1 ? 'negative' : 'neutral';
  return { score: parseFloat(score.toFixed(2)), label };
}
