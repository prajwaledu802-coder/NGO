import { VolunteerActivity } from '../models/VolunteerActivity.js';

export const getActivity = async (req, res) => {
  const query = req.user.role === 'admin' ? {} : { volunteerId: req.user._id };

  const activities = await VolunteerActivity.find(query)
    .populate('volunteerId', 'name email location')
    .populate('eventId', 'title location date status')
    .sort({ timestamp: -1 })
    .limit(200);

  res.json(activities);
};
