// =====================
//     Configuration
// =====================

// String appended to event descriptions, used to identify peloCal events
const EVENT_DESCRIPTION_SIGNATURE = '(Automatically created by peloCal)';

// Add a location to events (leave string empty for no location)
const EVENT_LOCATION = 'Peloton';

// Tag name used on Google Calendar events to store Peloton IDs
const EVENT_ID_TAG = 'pelotonId';

// Time (in minutes) a reminder will be created before each event. Set to 0 for no reminders
const REMINDER_MINUTES_BEFORE = 5;

// Exact name of the Google Calendar in which events will be created. Leave blank for default calendar
const TARGET_CALENDAR_NAME = '';

// =====================

function createEventFromRide(
  calendar: GoogleAppsScript.Calendar.Calendar,
  ride
): GoogleAppsScript.Calendar.CalendarEvent {
  console.log(`Adding new event from ride ${ride.id}...`);
  const eventTitle = `${ride.title} with ${ride.instructorName}`;
  const startDate = new Date(ride.startTime * 1000);
  const newEvent = calendar.createEvent(
    eventTitle,
    startDate,
    new Date(startDate.getTime() + ride.duration * 1000),
    {
      description: `${ride.description}\n\n${EVENT_DESCRIPTION_SIGNATURE}`,
      location: `${EVENT_LOCATION}`
    }
  );

  if (REMINDER_MINUTES_BEFORE) {
    newEvent.addPopupReminder(REMINDER_MINUTES_BEFORE);
  }

  newEvent.setTag(EVENT_ID_TAG, ride.id);
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
  const calendar = TARGET_CALENDAR_NAME
    ? CalendarApp.getCalendarsByName(TARGET_CALENDAR_NAME)[0]
    : CalendarApp.getDefaultCalendar();
  calendar
    .getEvents(now, endDate, { search: EVENT_DESCRIPTION_SIGNATURE })
    .forEach(event => {
      const id = event.getTag(EVENT_ID_TAG);
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
      createEventFromRide(calendar, ride);
    }
  });
}
