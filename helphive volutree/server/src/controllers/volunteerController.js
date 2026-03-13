import { Volunteer } from '../models/Volunteer.js';

export const getVolunteers = async (req, res) => {
  const search = req.query.search;
  const query = search
    ? { name: { $regex: search, $options: 'i' } }
    : {};

  const volunteers = await Volunteer.find(query).sort({ createdAt: -1 });
  res.json(volunteers);
};

export const createVolunteer = async (req, res) => {
  const volunteer = await Volunteer.create(req.body);
  res.status(201).json(volunteer);
};

export const getVolunteerById = async (req, res) => {
  const volunteer = await Volunteer.findById(req.params.id);
  if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
  res.json(volunteer);
};
