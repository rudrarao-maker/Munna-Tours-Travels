import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

// @desc    Get all reviews (for Admin or a specific route)
// @route   GET /api/reviews
// @access  Public
export const getReviews = async (req: Request, res: Response) => {
  try {
    const { routeId } = req.query;
    const filter = routeId ? { routeId: String(routeId), status: 'Approved' } : {};
    
    const reviews = await prisma.review.findMany({
      where: filter,
      include: {
        user: { select: { email: true } },
        route: { select: { from: true, to: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req: Request, res: Response) => {
  try {
    const { rating, comment, userId, routeId } = req.body;
    
    let sentimentScore = 0;
    let sentimentLabel = 'neutral';

    // AI Sentiment Analysis
    if (comment && process.env.GEMINI_API_KEY) {
      try {
        const prompt = `Analyze the sentiment of this travel review: "${comment}". 
        Return a JSON object strictly in this format: {"score": [number between -1.0 and 1.0], "label": "[positive, neutral, or negative]"}`;
        
        const aiRes = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
          { contents: [{ parts: [{ text: prompt }] }] }
        );
        
        const aiText = aiRes.data.candidates[0].content.parts[0].text;
        const cleanJson = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
        const sentimentData = JSON.parse(cleanJson);
        
        sentimentScore = sentimentData.score;
        sentimentLabel = sentimentData.label;
      } catch (err) {
        console.error('AI Sentiment Analysis Failed:', err);
      }
    }

    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        comment,
        userId,
        routeId,
        sentimentScore,
        sentimentLabel
      }
    });
    res.status(201).json(review);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating review', error: error.message });
  }
};

// @desc    Update a review status
// @route   PUT /api/reviews/:id
// @access  Private/Admin
export const updateReviewStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const review = await prisma.review.update({
      where: { id: (req.params.id as string) },
      data: { status }
    });
    res.json(review);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating review', error: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
export const deleteReview = async (req: Request, res: Response) => {
  try {
    await prisma.review.delete({
      where: { id: (req.params.id as string) }
    });
    res.json({ message: 'Review removed' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
};
