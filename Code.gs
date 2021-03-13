function loginToPeloton(username, password) {
  console.log('attempting to auth');

  const payload = {
    password,
    username_or_email: username,
  };

  const res = UrlFetchApp.fetch('https://api.onepeloton.com/auth/login', {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
  });
  const data = JSON.parse(res.getContentText());

  return data.session_id;
}

function fetchReservations(sessionId) {
  const res = UrlFetchApp.fetch(
    'https://api.onepeloton.com/api/user/reservations',
    {
      headers: {
        Cookie: `peloton_session_id=${sessionId};`,
        'peloton-platform-header': 'web',
      },
    }
  );
  const parsedRes = JSON.parse(res.getContentText());
  return parsedRes.data;
}

function fetchPeloton(sessionId, pelotonId) {
  const res = UrlFetchApp.fetch(
    `https://api.onepeloton.com/api/peloton/${pelotonId}`,
    {
      headers: {
        Cookie: `peloton_session_id=${pelotonId};`,
        'peloton-platform-header': 'web',
      },
    }
  );
  const parsedRes = JSON.parse(res.getContentText());
  return parsedRes;
}

function fetchRide(sessionId, rideId) {
  const res = UrlFetchApp.fetch(
    `https://api.onepeloton.com/api/ride/${rideId}/details`,
    {
      headers: {
        Cookie: `peloton_session_id=${sessionId};`,
        'peloton-platform-header': 'web',
      },
    }
  );
  const parsedRes = JSON.parse(res.getContentText());
  return parsedRes;
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
  const existingEventIds = CalendarApp.getDefaultCalendar()
    .getEvents(now, endDate, { search: '(Automatically created by peloCal)' })
    .map(event => event.getTag('pelotonId'));

  scheduledRides.forEach(ride => {
    if (!existingEventIds.includes(ride.id)) {
      const startDate = new Date(ride.startTime * 1000);
      const newEvent = CalendarApp.createEvent(
        `${ride.title} with ${ride.instructorName}`,
        startDate,
        new Date(startDate.getTime() + ride.duration * 1000),
        {
          description: `${ride.description}\n\n(Automatically created by peloCal)`,
        }
      );
      newEvent.setTag('pelotonId', ride.id);
    }
  });
}
