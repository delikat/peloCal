# peloCal 🚲 📆

A simple script to synchronize your Peloton schedule with Google Calendar. peloCal works with both live classes and sessions across all activity types.

## Setup

1. Make a copy of [the deployed script](https://script.google.com/d/1Hc9ncp32lwjjKcR0XCB6QjZAQep0BpRE1mFQkmzMDwp9a711mCYEAmAb/edit?usp=sharing) to your Google account by going to the **Overview** menu and then clicking the **Make a copy** icon on the top right.
2. Store your Peloton credentials in the `pelotonUsername` and `pelotonPassword` script properties under **Project Settings** > **Script Properties**
3. Deploy your project (optional). If you don't deploy/version your project the Head deployment will be used.
4. Set up a [time-driven trigger](https://developers.google.com/apps-script/guides/triggers/installable#time-driven_triggers) under **Triggers** on the left menu so it runs automatically. Below is an example on setting the script to run every 10 minutes:
	1. "Choose which function to run" should be set to `run`
	2. "Select event source" should be set to `Time-driven`
	2. "Select type of time based trigger" should be set to `Minutes Timer`
	3. "Select minute interval" should be set to `Every 10 Minutes`
4. Check for successful/failed executions under **Executions** on the left menu

## Contributing & Testing

If you would like to make changes to this script and deploy them to Google Apps Script, you will need to convert all `.ts` files to `.gs`. This can be done with [`ts2gas`](https://github.com/grant/ts2gas) or automatically with [`clasp`](https://github.com/google/clasp). Below are some basic instructions on getting set up with `clasp`:

1. Download peloCal repo locally
2. Install `clasp` via `npm install @google/clasp -g` ([full setup instructions here](https://developers.google.com/apps-script/guides/clasp))
3. Login to Google Apps Script with `clasp login`
4. Clone the peloCal project from Google Apps Script `clasp clone <scriptId>`. To get your project Script ID:
	1. Open Apps Script project.
	2. At the left, click **Project Settings**
	3. Under IDs, copy the **Script ID**.
4. Note: Once the project is cloned, Google will convert the existing the `.gs` files in your Apps Script and download them locally as `.js` files. These can be removed, and we are only going to be using the `.ts` files in this repo.
5. *...Make desired changes...*
6. Push changes to Apps Script with `clasp push`

## Notes

- Please be kind to the Peloton API and don't set too aggressive of a trigger (e.g. every minute), or you may find yourself rate limited.
- This script interacts with _unofficial, undocumented_ endpoints, meaning it can and probably will break if Peloton changes their API.
- Thanks to [@DovOps](https://github.com/DovOps) for his incredibly helpful [unofficial Swagger docs for the Peloton API](https://app.swaggerhub.com/apis/DovOps/peloton-unofficial-api/).

## Todo

- [ ] Don't delete (or include an option not to delete) calendar events for rides/workouts that have already past (allowing you to see what workouts you did in the past in your Google Calendar).
- [ ] Output an .ics file for compatibility with non-Google calendar apps.

---

##### This is a fan project for personal use, and is in no way officially affiliated with Peloton Interactive.
