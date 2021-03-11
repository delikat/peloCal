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
    `https://api.onepeloton.com/api/ride/${rideId}`,
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
    .map(peloton => {
      const { description, duration, title } = fetchRide(
        sessionId,
        peloton.ride_id
      );
      return {
        id: peloton.id,
        startTime: new Date(peloton.scheduled_start_time * 1000),
        description,
        duration,
        title,
      };
    });

  console.log(scheduledRides);
}
