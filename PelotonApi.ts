// ========================
//     Peloton API Code
// ========================

// Base path for the Peloton API
const API_BASE_PATH = 'https://api.onepeloton.com';

// Build API call
function fetchFromApi(sessionId: string, path: string) {
  const res = UrlFetchApp.fetch(`${API_BASE_PATH}${path}`, {
    headers: {
      Cookie: `peloton_session_id=${sessionId};`,
      'peloton-platform-header': 'web',
    },
  });
  return JSON.parse(res.getContentText());
}

// Check if we are authenticated in Peloton with a valid session
function isSessionValid(sessionId: string): boolean {
  return fetchFromApi(sessionId, '/auth/check_session').is_valid;
}

// Log in to Peloton using username/password
function loginToPeloton(username: string, password: string): string {
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

// Get a list of all reservations (scheduled Peloton rides/workouts)
function fetchReservations(sessionId: string) {
  return fetchFromApi(sessionId, '/api/user/reservations').data;
}

// Get a single reservation (scheduled Peloton ride/workout)
function fetchPeloton(sessionId: string, pelotonId: string) {
  return fetchFromApi(sessionId, `/api/peloton/${pelotonId}`);
}

// Get a Peloton ride/workout class details
function fetchRide(sessionId: string, rideId: string) {
  return fetchFromApi(sessionId, `/api/ride/${rideId}/details`);
}
