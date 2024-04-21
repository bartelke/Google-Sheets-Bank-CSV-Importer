﻿# Google Sheets Bank CSV Importer
## About

A simple application for importing CSV files with bank transaction history into a Google Sheets spreadsheet. It was created specifically for my personal needs, but I'm sharing the code in case someone finds it useful.

*Note: Some content or interfaces have been tailored for the Polish language.*

The program automatically detects income when loading a CSV file and saves it at the specified address, occupying three columns:
1. Date
2. Description
3. Value

Additionally, the program displays remaining logs as personal expenses. The application allows for moving personal expenses from the personal and shared expenses list. The amount of shared expenses is transferred to the right (by default 5 cells from the input, change _nValueSpan_). Example data placement is shown in the image.

![image](https://github.com/bartelke/Google-Sheets-Bank-CSV-Importer/assets/109694427/938c7b16-d8a8-4fd9-9194-ac8e55c236c7)


The code was mostly created using Hungarian notation.

## How to Run

First, you need to set up the project, obtain an API key, assign scope, and grant access to specific users on Google Cloud following the official guide: [https://developers.google.com/workspace/guides/configure-oauth-consent?hl=pl](https://developers.google.com/workspace/guides/configure-oauth-consent?hl=pl)

Next, in the _script.js_ and _Upload.js_ files, you need to provide the API key, client ID, and spreadsheet ID. Additionally, in the script.js file, you can set default values for certain parameters such as default cell values or the name of the spreadsheet.

Run the program like a regular web page locally (_index.html_ file). In the future, I may create a desktop application.

## Versions and Further Development

1. Connecting to API, registering on Google Cloud ✅
2. Loading CSV files, processing into desired format ✅
3. Sending files to specified Google sheet (MVP version) ✅
4. CSS styling and attractive interface 🛠️
5. Adding validation
6. Further bug fixing

April 2024 by Bartosz Kloc
