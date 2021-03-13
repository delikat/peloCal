# peloCal 🚲 📆

A simple script that creates Google Calendar events for your scheduled Peloton classes, including live rides and sessions.

## Configuration

1. Copy [Code.gs](Code.gs) to your own [Google Apps Script](https://script.google.com) project.
2. Store your Peloton credentials in the `pelotonUsername` and `pelotonPassword` script properties. This unfortunately requires switching to the legacy editor.
3. Deploy your project and set up a [time-driven trigger](https://developers.google.com/apps-script/guides/triggers/installable#time-driven_triggers) so it runs automatically.

## Notes

- Please be kind to the Peloton API and don't set too aggressive of a trigger (e.g. every minute), or you may find yourself rate limited.
- This script interacts with _unofficial, undocumented_ endpoints, meaning it can and probably will break if Peloton changes their API.
- Thanks to [@DovOps](https://github.com/DovOps) for his incredibly helpful [unofficial Swagger docs for the Peloton API](https://app.swaggerhub.com/apis/DovOps/peloton-unofficial-api/).

## TODO / Feature Ideas

- [ ] Improve README with a step-by-step setup guide
- [ ] Better exception handling around HTTP requests and authentication
- [ ] Output an .ics file for compatibility with non-Google calendar apps

---

##### This is a fan project for personal use, and is in no way officially affiliated with Peloton Interactive.
