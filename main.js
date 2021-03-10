function loginToPeloton(username, password) {
  console.log('attempting to auth');

  const payload = {
    password,
    username_or_email: username,
  };

  const res = UrlFetchApp.fetch('https://api.onepeloton.com/auth/login', {
    'method': 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(payload),
  });
  const data = JSON.parse(res.getContentText());

  return data.session_id;
}

function fetchReservations(sessionId) {
  const res = UrlFetchApp.fetch('https://api.onepeloton.com/api/user/reservations', {
    headers: {
      'Cookie': `peloton_session_id=${sessionId};`,
      'peloton-platform-header': 'web',
    },
  });
  const parsedRes = JSON.parse(res.getContentText());
  return parsedRes.data;
}

function fetchPeloton(pelotonId) {
  const res = UrlFetchApp.fetch(`https://api.onepeloton.com/api/peloton/${pelotonId}`, {
    headers: {
      'Cookie': `peloton_session_id=${pelotonId};`,
      'peloton-platform-header': 'web',
    },
  });
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

  const reservations = fetchReservations(sessionId);
  console.log(fetchPeloton(reservations[0].peloton_id));
}
