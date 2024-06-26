const CLIENT_ID = "your client ID";
const API_KEY = "<your API key>";

//default inputs values:
document.getElementById("income_cell").value = "T7";
document.getElementById("own_outcome_cell").value = "J7";
document.getElementById("common_outcome_cell").value = "A7";
document.getElementById("sheet_cell").value = "test";
nValueSpan = 5; //shift for common expences values

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC =
  "https://sheets.googleapis.com/$discovery/rest?version=v4";

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById("authorize_button").style.visibility = "visible";
document.getElementById("signout_button").style.visibility = "hidden";
document.getElementById("container").style.visibility = "hidden";

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
  gapi.load("client", initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Initializes the API client with the discovery doc.
 */
async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  // maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: "", // Callback defined later
  });
  gisInited = true;
}

/**
 * Sign in the user upon button click.
 */
function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw resp;
    }
    document.getElementById("signout_button").style.visibility = "visible";
    document.getElementById("container").style.visibility = "visible";
    document.getElementById("helloSection").style.visibility = "hidden";
    document.getElementById("authorize_button").style.visibility = "hidden";
  };

  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({ prompt: "consent" });
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({ prompt: "" });
  }
}

/**
 * Sign out the user upon button click.
 */
function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken("");
    document.getElementById("content").innerText = "";
    document.getElementById("signout_button").style.visibility = "hidden";
    document.getElementById("container").style.visibility = "hidden";
    document.getElementById("helloSection").style.visibility = "visible";
    document.getElementById("authorize_button").style.visibility = "visible";
  }
}
const callback = (response) => {
  console.log(response);
};
