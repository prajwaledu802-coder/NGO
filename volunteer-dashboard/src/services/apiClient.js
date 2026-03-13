const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:10000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export function getDashboard(userId) {
  return request(`/dashboard?userId=${encodeURIComponent(userId || 'demo')}`);
}

export function getEvents() {
  return request('/events');
}

export function joinEventApi(eventId, userId) {
  return request(`/events/${eventId}/join`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}

export function getActivities(userId) {
  return request(`/activities?userId=${encodeURIComponent(userId || 'demo')}`);
}

export function getHelpRequests() {
  return request('/help-requests');
}

export function respondToRequestApi(requestId, userId) {
  return request(`/help-requests/${requestId}/respond`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}

export function getMapData() {
  return request('/map-data');
}

export function getImpact(userId) {
  return request(`/impact?userId=${encodeURIComponent(userId || 'demo')}`);
}

export function getNotifications() {
  return request('/notifications');
}

export function getProfile(userId) {
  return request(`/profile/${encodeURIComponent(userId || 'demo')}`);
}

export function saveProfile(userId, payload) {
  return request(`/profile/${encodeURIComponent(userId || 'demo')}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function getCertificate(userId) {
  return request(`/certificates/${encodeURIComponent(userId || 'demo')}`);
}
