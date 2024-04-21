let aPayload;
let aIncome;
/**
 * Open CSV file
 */
function handleFiles(oFiles) {
  console.log(typeof oFiles);
  if (oFiles.length === 0) {
    console.log("Nie wybrano pliku");
    return;
  }
  const oFile = oFiles[0];
  const oReader = new FileReader();

  oReader.onload = (oEvent) => {
    const sText = oEvent.target.result;
    aPayload = processCSV(sText);
    separate(aPayload);
  };

  oReader.readAsText(oFile);
}
/**
 * Parse CSV data into an array
 */
function processCSV(sText) {
  const aData = sText
    .slice(0, -1)
    .split("\n")
    .map((sRow) => {
      const splitRow = sRow.split(",");
      if (splitRow[2].includes("kod mobilny")) {
        return [
          splitRow[0],
          splitRow[8].replace("Lokalizacja : Adres : ", ""),
          splitRow[3],
        ];
      } else {
        return [
          splitRow[0],
          splitRow[7].replace("Lokalizacja : Adres : ", ""),
          splitRow[3],
        ];
      }
    });

  aData.shift();
  return aData;
}

function separate(originalArray) {
  const positiveNumberArray = [];
  const negativeNumberArray = [];

  originalArray.forEach((row) => {
    const number = parseFloat(row[2].replace(/"/g, ""));
    const sender = row[1].replace(/"Nazwa nadawcy : /g, "").replace(/"/g, ""); // Usuwa "Nazwa nadawcy: " i cudzysłowy
    if (!isNaN(number) && number >= 0) {
      // Sprawdzamy czy number jest liczbą i dodatni
      positiveNumberArray.push([row[0], sender, number]);
    } else {
      negativeNumberArray.push(row);
    }
  });

  console.log("Positive numbers array:", positiveNumberArray);
  console.log("Negative numbers array:", negativeNumberArray);
  aIncome = positiveNumberArray;
}
