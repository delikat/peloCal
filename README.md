# peloCal 🚲 📆

A simple script to synchronize your Peloton schedule with Google Calendar. peloCal works with both live classes and sessions across all activity types.

## Setup

1. Make a copy of [the deployed script](https://script.google.com/d/1Hc9ncp32lwjjKcR0XCB6QjZAQep0BpRE1mFQkmzMDwp9a711mCYEAmAb/edit?usp=sharing) to your Google account by choosing the Overview tab then clicking the Copy icon on the top right.
2. Store your Peloton credentials in the `pelotonUsername` and `pelotonPassword` script properties. This unfortunately requires switching to the legacy editor.
3. Deploy your project and set up a [time-driven trigger](https://developers.google.com/apps-script/guides/triggers/installable#time-driven_triggers) so it runs automatically.

## Notes

- Please be kind to the Peloton API and don't set too aggressive of a trigger (e.g. every minute), or you may find yourself rate limited.
- This script interacts with _unofficial, undocumented_ endpoints, meaning it can and probably will break if Peloton changes their API.
- Thanks to [@DovOps](https://github.com/DovOps) for his incredibly helpful [unofficial Swagger docs for the Peloton API](https://app.swaggerhub.com/apis/DovOps/peloton-unofficial-api/).

## TODO / Feature Ideas

- [ ] Improve README with a step-by-step setup guide
- [ ] Output an .ics file for compatibility with non-Google calendar apps

---

##### This is a fan project for personal use, and is in no way officially affiliated with Peloton Interactive.
