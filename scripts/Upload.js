const sSpreadsheetID = "<your spreetsheet ID>";

function upload() {
  let sIncomeCell = document.getElementById("income_cell").value;
  let sOwnOutcomeCell = document.getElementById("own_outcome_cell").value;
  let sCommonOutcomeCell = document.getElementById("common_outcome_cell").value;
  let sSheetCell = document.getElementById("sheet_cell").value;

  //upload income:
  batchUpdateValues(
    sSpreadsheetID,
    `${sSheetCell}!${sIncomeCell}`,
    "USER_ENTERED",
    aIncome,
    callback
  );

  //upload own outcome:
  batchUpdateValues(
    sSpreadsheetID,
    `${sSheetCell}!${sOwnOutcomeCell}`,
    "USER_ENTERED",
    aOwnOutcome,
    callback
  );

  //upload common expences:
  batchUpdateValues(
    sSpreadsheetID,
    `${sSheetCell}!${sCommonOutcomeCell}`,
    "USER_ENTERED",
    aCommonOutcome,
    callback
  );
  /**
   * Shift range for values:
   */
  let sCellLetter = sCommonOutcomeCell.charAt(0);
  let nCellDigit = parseInt(sCommonOutcomeCell.substr(1));

  //shift letter:
  let sNewLetter = String.fromCharCode(sCellLetter.charCodeAt(0) + nValueSpan);
  let sNewCell = sNewLetter + nCellDigit;

  //upload only shifted prices (common expences):
  batchUpdateValues(
    sSpreadsheetID,
    `${sSheetCell}!${sNewCell}`,
    "USER_ENTERED",
    aCommonValues,
    callback
  );
}

function batchUpdateValues(
  spreadsheetId,
  range,
  valueInputOption,
  _values,
  callback
) {
  let values = [
    [
      // Cell values ...
    ],
    // Additional rows ...
  ];
  values = _values;
  const data = [];
  data.push({
    range: range,
    values: values,
  });
  // Additional ranges to update.

  const body = {
    data: data,
    valueInputOption: valueInputOption,
  };
  try {
    gapi.client.sheets.spreadsheets.values
      .batchUpdate({
        spreadsheetId: spreadsheetId,
        resource: body,
      })
      .then((response) => {
        const result = response.result;
        console.log(`${result.totalUpdatedCells} cells updated.`);
        if (callback) callback(response);
      });
  } catch (err) {
    document.getElementById("content").innerText = err.message;
    return;
  }
}
