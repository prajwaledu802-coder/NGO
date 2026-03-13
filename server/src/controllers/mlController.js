import { Event } from '../models/Event.js';
import { VolunteerActivity } from '../models/VolunteerActivity.js';
import { predictEventNeeds } from '../services/mlService.js';

const statusScoreMap = {
  completed: 90,
  active: 75,
  planned: 65,
  cancelled: 20,
};

const inferEventType = (title) => {
  const value = (title || '').toLowerCase();

  if (value.includes('flood')) return 'Flood Relief';
  if (value.includes('cleanup') || value.includes('clean-up')) return 'Cleanup Drive';
  if (value.includes('medical') || value.includes('health')) return 'Medical Camp';
  if (value.includes('food')) return 'Food Distribution';

  return 'General Relief';
};

const resourceQtyByKeywords = (resourcesRequired, keywords) =>
  (resourcesRequired || []).reduce((sum, item) => {
    const name = (item.resourceName || '').toLowerCase();
    if (keywords.some((key) => name.includes(key))) {
      return sum + (item.quantity || 0);
    }

    return sum;
  }, 0);

const buildHistoricalRows = async () => {
  const events = await Event.find().select('title assignedVolunteers resourcesRequired status date');

  const eventIds = events.map((event) => event._id);
  const impactByEvent = await VolunteerActivity.aggregate([
    {
      $match: {
        eventId: { $in: eventIds },
      },
    },
    {
      $group: {
        _id: '$eventId',
        totalImpact: { $sum: '$impactScore' },
        totalHours: { $sum: '$hoursContributed' },
      },
    },
  ]);

  const impactMap = new Map(impactByEvent.map((row) => [row._id.toString(), row]));

  return events.map((event) => {
    const volunteerCount = event.assignedVolunteers?.length || 0;
    const foodKits = resourceQtyByKeywords(event.resourcesRequired, ['food', 'ration', 'meal']);
    const medicalKits = resourceQtyByKeywords(event.resourcesRequired, ['medical', 'medicine', 'first aid']);
    const totalResources = (event.resourcesRequired || []).reduce((sum, item) => sum + (item.quantity || 0), 0);

    const impact = impactMap.get(event._id.toString()) || { totalImpact: 0, totalHours: 0 };

    const estimatedPeople = Math.max(
      30,
      Math.round(volunteerCount * 18 + totalResources * 2 + (impact.totalHours || 0) * 0.4)
    );

    const successBase = statusScoreMap[event.status] ?? 70;
    const successScore = Math.max(
      10,
      Math.min(99, Math.round(successBase + Math.min(10, (impact.totalImpact || 0) / 15)))
    );

    return {
      eventType: inferEventType(event.title),
      expectedPeople: estimatedPeople,
      volunteersNeeded: volunteerCount,
      foodKitsNeeded: foodKits,
      medicalKitsNeeded: medicalKits,
      successScore,
    };
  });
};

export const predictResourcesAndDemand = async (req, res) => {
  const { eventType, expectedPeople } = req.body;

  if (!eventType || expectedPeople === undefined) {
    return res.status(400).json({ message: 'eventType and expectedPeople are required' });
  }

  const historicalEvents = await buildHistoricalRows();
  const prediction = await predictEventNeeds({
    eventType,
    expectedPeople,
    historicalEvents,
  });

  res.json({
    eventType,
    expectedPeople,
    volunteersNeeded: prediction.volunteersNeeded,
    foodKitsNeeded: prediction.foodKitsNeeded,
    medicalKitsNeeded: prediction.medicalKitsNeeded,
    eventSuccessProbability: prediction.eventSuccessProbability,
    modelType: prediction.modelType,
    trainingSamples: prediction.trainingSamples || historicalEvents.length,
  });
};
