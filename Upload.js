const sSpreadsheetID = "<your spreedsheet ID>";

function upload() {
  let sIncomeCell = document.getElementById("income_cell").value;
  let sOwnOutcomeCell = document.getElementById("own_outcome_cell").value;

  console.log(`test!${sIncomeCell}`);
  batchUpdateValues(
    sSpreadsheetID,
    `test!${sIncomeCell}`,
    "USER_ENTERED",
    aIncome,
    callback
  );

  batchUpdateValues(
    sSpreadsheetID,
    `test!${sOwnOutcomeCell}`,
    "USER_ENTERED",
    aOwnOutcome,
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
