import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const DemoFlowContext = createContext(null);
const STORAGE_KEY = 'helphive_demo_state';

const nowLabel = () => 'Just now';

const createEventId = () => `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
const createItemId = () => `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

const defaultState = {
  events: [
    {
      _id: 'evt-seed-1',
      title: 'Flood Relief Camp',
      location: 'Chennai',
      date: '2026-03-20',
      volunteersRequired: 20,
      createdBy: 'admin',
    },
  ],
  pendingVolunteers: [
    {
      id: 'vol-pending-1',
      name: 'Rahul Sharma',
      location: 'Bangalore',
      skills: ['Medical', 'Logistics'],
      status: 'pending',
    },
  ],
  volunteerProfile: {
    name: 'Rahul Sharma',
    location: 'Bangalore',
    skills: ['Medical', 'Logistics'],
    eventsJoined: 3,
    hoursWorked: 24,
    impactScore: 78,
    dutyStatus: 'off-duty',
  },
  volunteerEventIds: [],
  volunteerNotifications: [
    {
      id: 'notif-seed-1',
      message: 'Welcome to HelpHive demo mode.',
      time: 'Just now',
    },
  ],
  volunteerTimeline: [
    { id: 'timeline-seed-1', title: 'Profile created for HelpHive demo', time: 'Just now' },
  ],
};

const loadState = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultState;

  try {
    const parsed = JSON.parse(raw);
    return {
      ...defaultState,
      ...parsed,
    };
  } catch {
    return defaultState;
  }
};

export const DemoFlowProvider = ({ children }) => {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const createEvent = (payload) => {
    const event = {
      _id: createEventId(),
      title: payload.title,
      location: payload.location,
      date: payload.date,
      volunteersRequired: Number(payload.volunteersRequired) || 0,
      createdBy: 'admin',
    };

    setState((prev) => ({
      ...prev,
      events: [event, ...prev.events],
      volunteerNotifications: [
        {
          id: createItemId(),
          message: `New Event Available: ${event.title}`,
          time: nowLabel(),
        },
        ...prev.volunteerNotifications,
      ].slice(0, 20),
    }));
  };

  const approveVolunteer = (id) => {
    setState((prev) => {
      const volunteer = prev.pendingVolunteers.find((item) => item.id === id);
      if (!volunteer) return prev;

      return {
        ...prev,
        pendingVolunteers: prev.pendingVolunteers.filter((item) => item.id !== id),
        volunteerNotifications: [
          {
            id: createItemId(),
            message: 'You have been approved.',
            time: nowLabel(),
          },
          ...prev.volunteerNotifications,
        ].slice(0, 20),
      };
    });
  };

  const assignVolunteerToEvent = (eventId) => {
    setState((prev) => {
      const event = prev.events.find((item) => item._id === eventId);
      if (!event) return prev;

      return {
        ...prev,
        volunteerNotifications: [
          {
            id: createItemId(),
            message: `You were assigned to event: ${event.title}`,
            time: nowLabel(),
          },
          ...prev.volunteerNotifications,
        ].slice(0, 20),
      };
    });
  };

  const sendVolunteerNotification = (message) => {
    if (!message?.trim()) return;

    setState((prev) => ({
      ...prev,
      volunteerNotifications: [
        {
          id: createItemId(),
          message: message.trim(),
          time: nowLabel(),
        },
        ...prev.volunteerNotifications,
      ].slice(0, 20),
    }));
  };

  const joinEvent = (eventId) => {
    setState((prev) => {
      if (prev.volunteerEventIds.includes(eventId)) return prev;
      const event = prev.events.find((item) => item._id === eventId);
      if (!event) return prev;

      return {
        ...prev,
        volunteerEventIds: [eventId, ...prev.volunteerEventIds],
        volunteerProfile: {
          ...prev.volunteerProfile,
          eventsJoined: prev.volunteerProfile.eventsJoined + 1,
          hoursWorked: prev.volunteerProfile.hoursWorked + 4,
          impactScore: prev.volunteerProfile.impactScore + 6,
        },
        volunteerTimeline: [
          {
            id: createItemId(),
            title: `Joined event: ${event.title}`,
            time: nowLabel(),
          },
          ...prev.volunteerTimeline,
        ].slice(0, 15),
      };
    });
  };

  const updateDutyStatus = (dutyStatus) => {
    setState((prev) => ({
      ...prev,
      volunteerProfile: {
        ...prev.volunteerProfile,
        dutyStatus,
      },
      volunteerTimeline: [
        {
          id: createItemId(),
          title: `Duty status updated to ${dutyStatus}`,
          time: nowLabel(),
        },
        ...prev.volunteerTimeline,
      ].slice(0, 15),
    }));
  };

  const resetDemoState = () => setState(defaultState);

  const value = useMemo(
    () => ({
      state,
      createEvent,
      approveVolunteer,
      assignVolunteerToEvent,
      sendVolunteerNotification,
      joinEvent,
      updateDutyStatus,
      resetDemoState,
    }),
    [state]
  );

  return <DemoFlowContext.Provider value={value}>{children}</DemoFlowContext.Provider>;
};

export const useDemoFlow = () => {
  const context = useContext(DemoFlowContext);
  if (!context) {
    throw new Error('useDemoFlow must be used inside DemoFlowProvider');
  }

  return context;
};
