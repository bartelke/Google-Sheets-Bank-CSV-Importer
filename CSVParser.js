let aPayload;
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
    console.log(aPayload);
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
