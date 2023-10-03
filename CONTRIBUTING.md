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