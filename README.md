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
4. Update the `timeZone` to your timezone ([see list](https://joda-time.sourceforge.net/timezones.html)) in `appsscript.json` in the **Editor** (this ensures events in the past do not accidently get deleted)
5. Check for successful/failed executions under **Executions** on the left menu 

## Notes

- Please be kind to the Peloton API and don't set too aggressive of a trigger (e.g. every minute), or you may find yourself rate limited.
- This script interacts with _unofficial, undocumented_ endpoints, meaning it can and probably will break if Peloton changes their API.
- Thanks to [@DovOps](https://github.com/DovOps) for his incredibly helpful [unofficial Swagger docs for the Peloton API](https://app.swaggerhub.com/apis/DovOps/peloton-unofficial-api/).

## TODO / Feature Ideas

- [ ] Output an .ics file for compatibility with non-Google calendar apps.

---

##### This is a fan project for personal use, and is in no way officially affiliated with Peloton Interactive.
