const API_BASE_PATH = 'https://api.onepeloton.com';
// String appended to event descriptions, used to identify peloCal events
const EVENT_DESCRIPTION_SIGNATURE = '(Automatically created by peloCal)';

function loginToPeloton(username, password) {
  console.log('attempting to auth');

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

function fetchFromApi(sessionId, path) {
  const res = UrlFetchApp.fetch(`${API_BASE_PATH}${path}`, {
    headers: {
      Cookie: `peloton_session_id=${sessionId};`,
      'peloton-platform-header': 'web',
    },
  });
  const parsedRes = JSON.parse(res.getContentText());
  return parsedRes;
}

function fetchReservations(sessionId) {
  return fetchFromApi(sessionId, '/api/user/reservations').data;
}

function fetchPeloton(sessionId, pelotonId) {
  return fetchFromApi(sessionId, `/api/peloton/${pelotonId}`);
}

function fetchRide(sessionId, rideId) {
  return fetchFromApi(sessionId, `/api/ride/${rideId}/details`);
}

function createEventFromRide(ride) {
  const startDate = new Date(ride.startTime * 1000);
  const newEvent = CalendarApp.createEvent(
    `${ride.title} with ${ride.instructorName}`,
    startDate,
    new Date(startDate.getTime() + ride.duration * 1000),
    {
      description: `${ride.description}\n\n${EVENT_DESCRIPTION_SIGNATURE}`,
    }
  );
  newEvent.setTag('pelotonId', ride.id);
  return newEvent;
}

function main() {
  const scriptProps = PropertiesService.getScriptProperties();
  let { peloUser, peloPass, sessionId } = scriptProps.getProperties();

  if (!sessionId) {
    sessionId = loginToPeloton(peloUser, peloPass);
    scriptProps.setProperty('sessionId', sessionId);
  }

  const scheduledRides = fetchReservations(sessionId)
    .map(({ peloton_id }) => fetchPeloton(sessionId, peloton_id))
    .map(({ id, ride_id: rideId, scheduled_start_time: startTime }) => {
      const { ride } = fetchRide(sessionId, rideId);
      return {
        id,
        startTime,
        description: ride.description,
        duration: ride.duration,
        instructorName: ride.instructor.name,
        title: ride.title,
      };
    });

  // get existing peloCal events
  const now = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 14);
  const existingRideIds = CalendarApp.getDefaultCalendar()
    .getEvents(now, endDate, { search: EVENT_DESCRIPTION_SIGNATURE })
    .map(event => event.getTag('pelotonId'));

  // add new rides to the calendar
  scheduledRides.forEach(ride => {
    if (!existingRideIds.includes(ride.id)) {
      createEventFromRide(ride);
    }
  });
}
