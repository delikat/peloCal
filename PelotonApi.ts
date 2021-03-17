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
