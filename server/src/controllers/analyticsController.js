import { Event } from '../models/Event.js';
import { Resource } from '../models/Resource.js';
import { VolunteerActivity } from '../models/VolunteerActivity.js';

export const getVolunteerActivityAnalytics = async (_req, res) => {
  const result = await VolunteerActivity.aggregate([
    {
      $group: {
        _id: '$volunteerId',
        hoursContributed: { $sum: '$hoursContributed' },
        impactScore: { $sum: '$impactScore' },
        eventsJoined: { $sum: 1 },
        lastActivityAt: { $max: '$timestamp' },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'volunteer',
      },
    },
    { $unwind: '$volunteer' },
    {
      $project: {
        _id: 0,
        volunteerId: '$_id',
        volunteerName: '$volunteer.name',
        hoursContributed: 1,
        impactScore: 1,
        eventsJoined: 1,
        lastActivityAt: 1,
      },
    },
    { $sort: { impactScore: -1 } },
  ]);

  res.json(result);
};

export const getResourceUsageAnalytics = async (_req, res) => {
  const usageByResource = await Event.aggregate([
    { $unwind: { path: '$resourcesRequired', preserveNullAndEmptyArrays: false } },
    {
      $group: {
        _id: '$resourcesRequired.resourceName',
        totalRequired: { $sum: '$resourcesRequired.quantity' },
        eventsCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        resourceName: '$_id',
        totalRequired: 1,
        avgRequiredPerEvent: {
          $cond: [{ $eq: ['$eventsCount', 0] }, 0, { $divide: ['$totalRequired', '$eventsCount'] }],
        },
        eventsCount: 1,
      },
    },
    { $sort: { totalRequired: -1 } },
  ]);

  const inventory = await Resource.find().select('resourceName quantity status');
  const merged = usageByResource.map((item) => {
    const stock = inventory.find((resource) => resource.resourceName === item.resourceName);

    return {
      ...item,
      currentStock: stock?.quantity ?? 0,
      currentStatus: stock?.status ?? 'unknown',
    };
  });

  res.json(merged);
};

export const getEventParticipationAnalytics = async (_req, res) => {
  const events = await Event.aggregate([
    {
      $project: {
        title: 1,
        status: 1,
        location: 1,
        date: 1,
        assignedCount: { $size: { $ifNull: ['$assignedVolunteers', []] } },
        requiredResourcesCount: { $size: { $ifNull: ['$resourcesRequired', []] } },
      },
    },
    { $sort: { date: -1 } },
  ]);

  const statusSummary = await Event.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  res.json({
    events,
    statusSummary,
  });
};
