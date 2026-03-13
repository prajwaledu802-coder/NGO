import {
  answerAiChat,
  predictResources,
  recommendVolunteers,
} from '../services/aiService.js';
import Groq from 'groq-sdk';
import { supabase } from '../config/supabase.js';

const groqClient = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

const defaultFallbackRecommendations = [
  'Assign volunteers with medical skills to high-risk flood zones.',
  'Deploy logistics volunteers to supply distribution centers.',
  'Monitor availability and reroute nearby responders every 30 minutes.',
];

export const chatWithAi = async (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ message: 'message is required' });
  }

  const answer = await answerAiChat(message);
  res.json({ answer });
};

export const getVolunteerRecommendations = async (req, res) => {
  const recommendations = await recommendVolunteers(req.body || {});
  res.json({ recommendations });
};

export const getResourcePrediction = async (_req, res) => {
  const prediction = await predictResources();
  res.json({ prediction });
};

export const getVolunteerAiInsights = async (req, res) => {
  const volunteerRecommendations = await recommendVolunteers({ location: req.user.location || '' });
  const [upcomingEvents, activeDisasters] = await Promise.all([
    supabase
      .from('events')
      .select('id,title,location,date')
      .in('status', ['planned', 'active'])
      .order('date', { ascending: true })
      .limit(5),
    supabase
      .from('disasters')
      .select('id,type,location,severity,detected_at')
      .eq('status', 'active')
      .order('detected_at', { ascending: false })
      .limit(5),
  ]);

  let success = false;
  let insight = defaultFallbackRecommendations.join(' ');

  if (groqClient) {
    try {
      const response = await groqClient.chat.completions.create({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'user',
            content:
              'Give concise volunteer coordination suggestions for disaster response in 3 bullet points.',
          },
        ],
        temperature: 0.2,
      });

      const content = response?.choices?.[0]?.message?.content?.trim();
      if (content) {
        success = true;
        insight = content;
      }
    } catch (error) {
      console.log('AI Error:', error?.message || error);
    }
  }

  res.json({
    success,
    insight,
    fallbackRecommendations: defaultFallbackRecommendations,
    suggestedEvents: (upcomingEvents.data || []).map((event) => ({
      id: event.id,
      title: event.title,
      location: event.location,
      date: event.date,
    })),
    bestVolunteerRoles: volunteerRecommendations.slice(0, 3).map((item) => ({
      volunteer: item.name,
      recommendationScore: item.recommendationScore,
      suggestedRole: (item.skills || [])[0] || 'Field Volunteer',
    })),
    disasterAlerts: (activeDisasters.data || []).map((item) => ({
      ...item,
      detectedAt: item.detected_at,
    })),
  });
};
