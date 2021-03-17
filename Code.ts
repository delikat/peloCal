const API_BASE_PATH = 'https://api.onepeloton.com';
// String appended to event descriptions, used to identify peloCal events
const EVENT_DESCRIPTION_SIGNATURE = '(Automatically created by peloCal)';

function isSessionValid(sessionId: String) {
  return fetchFromApi(sessionId, '/auth/check_session').is_authed;
}

function loginToPeloton(username: String, password: String) {
  console.log('Attempting to auth...');

  const payload = {
    password,
    username_or_email: username,
  };

  const res = UrlFetchApp.fetch(`${API_BASE_PATH}/auth/login`, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
  });
  const data = JSON.parse(res.getContentText());

  return data.session_id;
}

function fetchFromApi(sessionId: String, path: String) {
  const res = UrlFetchApp.fetch(`${API_BASE_PATH}${path}`, {
    headers: {
      Cookie: `peloton_session_id=${sessionId};`,
      'peloton-platform-header': 'web',
    },
  });
  return JSON.parse(res.getContentText());
}

function fetchPeloton(sessionId: String, pelotonId: String) {
  return fetchFromApi(sessionId, `/api/peloton/${pelotonId}`);
}

function fetchReservations(sessionId: String) {
  return fetchFromApi(sessionId, '/api/user/reservations').data;
}

function fetchRide(sessionId: String, rideId: String) {
  return fetchFromApi(sessionId, `/api/ride/${rideId}/details`);
}

function createEventFromRide(ride) {
  console.log(`Adding new event from ride ${ride.id}...`);
  const eventTitle = `${ride.title} with ${ride.instructorName}`;
  const startDate = new Date(ride.startTime * 1000);
  const newEvent = CalendarApp.createEvent(
    eventTitle,
    startDate,
    new Date(startDate.getTime() + ride.duration * 1000),
    {
      description: `${ride.description}\n\n${EVENT_DESCRIPTION_SIGNATURE}`,
    }
  );
  newEvent.setTag('pelotonId', ride.id);
  console.log(`Added ${eventTitle} at ${startDate.toUTCString()}`);
  return newEvent;
}

function main() {
  const scriptProps = PropertiesService.getScriptProperties();
  let {
    pelotonUsername,
    pelotonPassword,
    sessionId,
  } = scriptProps.getProperties();

  if (!sessionId || !isSessionValid(sessionId)) {
    sessionId = loginToPeloton(pelotonUsername, pelotonPassword);
    scriptProps.setProperty('sessionId', sessionId);
  }

  const scheduledRides = fetchReservations(sessionId)
    .map(({ peloton_id }) => fetchPeloton(sessionId, peloton_id))
    .map(peloton => {
      const { ride } = fetchRide(sessionId, peloton.ride_id);

      // Session rides' scheduled_start_times are one minute early, so prefer pedaling_start_time
      const startTime = peloton.is_session
        ? peloton.pedaling_start_time
        : peloton.scheduled_start_time;

      return {
        startTime,
        id: peloton.id,
        description: ride.description,
        duration: ride.duration,
        instructorName: ride.instructor.name,
        title: ride.title,
      };
    });
  const scheduledRideIds = scheduledRides.map(ride => ride.id);

  // get existing peloCal events from Google Calendar
  const now = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 14);
  const existingRideIds = new Set();
  CalendarApp.getDefaultCalendar()
    .getEvents(now, endDate, { search: EVENT_DESCRIPTION_SIGNATURE })
    .forEach(event => {
      const id = event.getTag('pelotonId');
      // delete calendar events for rides no longer on the schedule
      if (!scheduledRideIds.includes(id)) {
        console.log(`Deleting event for ride ${id}...`);
        event.deleteEvent();
        return;
      }
      existingRideIds.add(id);
    });

  // add new rides to Google Calendar
  scheduledRides.forEach(ride => {
    if (!existingRideIds.has(ride.id)) {
      createEventFromRide(ride);
    }
  });
}
