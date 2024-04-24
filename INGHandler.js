function INGconverter(sInput) {
  let aRows = sInput.split("\n");
  let nCounter = 0;

  for (let i = 0; i < aRows.length; i++) {
    if (aRows[i].includes(`"Data transakcji";`)) {
      nCounter = i;
      break;
    }
  }
  aRows.splice(0, nCounter + 1); //delete unnecesarry data until transactions start
  aRows.splice(aRows.length - 4, 4); //delete last 4 rows (ING footer)

  return parseINGCSV(aRows);
}

function parseINGCSV(aFullTransactions) {
  return aFullTransactions.map((oItem) => {
    //separate into fields:
    const aFields = oItem.split(";");

    // remove special characters
    const sanitizedFields = aFields.map((sField) =>
      sField.replace(/["']/g, "").trim()
    );

    //convert date to DD.MM.YYYY format
    const oDateFields = sanitizedFields.slice(0, 2).map((sDate) => {
      const [sYear, sMonth, sDay] = sDate.split("-");
      return `${sDay}.${sMonth}.${sYear}`;
    });

    //Take columns with date and description (and later also price):
    const aSelectedFields = [oDateFields[0], sanitizedFields[2]];

    //if trans. value (9th colkumn) is empty, take blocked value (11th column)
    const sTransactionValue = sanitizedFields[8].trim();
    const sPriceFinalValue = sTransactionValue
      ? sTransactionValue
      : sanitizedFields[10];
    aSelectedFields.push(parseFloat(sPriceFinalValue.replace(",", ".")));

    return aSelectedFields;
  });
}
