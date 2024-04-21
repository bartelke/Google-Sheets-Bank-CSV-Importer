let aPayload;
let aIncome;
let aOwnOutcome;
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

function separate(aOriginalData) {
  const aPositiveNumbers = [];
  const aNegativeNumbers = [];

  aOriginalData.forEach((oRow) => {
    const nValue = parseFloat(oRow[2].replace(/"/g, ""));
    const sOperationTitle = oRow[1]
      .replace(/"Nazwa nadawcy : /g, "")
      .replace(/"/g, ""); //remove "Nazwa nadawcy :"
    if (!isNaN(nValue)) {
      // Separate positive and negative numbers
      if (nValue >= 0) {
        aPositiveNumbers.push([oRow[0], sOperationTitle, nValue]);
      } else {
        aNegativeNumbers.push([oRow[0], sOperationTitle, nValue]);
      }
    }
  });

  // Update global variables if needed
  aIncome = aPositiveNumbers;
  aOwnOutcome = aNegativeNumbers.map((item) => [
    item[0],
    item[1],
    Math.abs(item[2]),
  ]);
  console.log(aOwnOutcome);

  // Add a list to the element with the id "outcome_list"
  const outcomeList = generateList(aOwnOutcome);
  document.getElementById("outcome_list").appendChild(outcomeList);
}

function generateList(array) {
  const list = document.createElement("ul");
  list.classList.add("custom-list"); // Dodaj klasę dla dodatkowych stylów

  array.forEach((item) => {
    const listItem = document.createElement("li");

    const itemWrapper = document.createElement("div");
    itemWrapper.style.width = "800px"; // Ustaw szerokość diva na 1000px

    const itemContent = document.createElement("span");
    itemContent.textContent = `${item[0]} - ${item[1]}`;

    const additionalInfo = document.createElement("span"); // Nowy element na trzeci element
    additionalInfo.textContent = item[2];

    const button = document.createElement("button");
    button.textContent = "Przenieś do wydatków wspólnych";
    button.addEventListener("click", () => {
      console.log(item);
    });

    itemWrapper.appendChild(itemContent);
    listItem.appendChild(itemWrapper);
    listItem.appendChild(additionalInfo); // Dodaj trzeci element poza divem
    listItem.appendChild(button);

    list.appendChild(listItem);
  });

  return list;
}
