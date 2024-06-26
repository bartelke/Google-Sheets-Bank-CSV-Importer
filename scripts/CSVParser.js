let aPayload;
let aIncome;
let aOwnOutcome = [];
let aCommonOutcome = [];
//get only common spends values:
let aCommonValues = [];
let bIsING;

/**
 * Open CSV file
 */
function handleFiles(oFiles) {
  if (oFiles.length === 0) {
    console.log("Nie wybrano pliku");
    return;
  }
  const oFile = oFiles[0];
  const oReader = new FileReader();

  oReader.onload = (oEvent) => {
    const sText = oEvent.target.result;
    const sFirst100 = sText.slice(0, 100);

    if (sFirst100.includes("ING")) {
      bIsING = true;
      aPayload = INGconverter(sText);
    } else {
      bIsING = false;
      aPayload = processCSV(sText);
    }
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

/**
 * Separate income and expences
 */
function separate(aOriginalData) {
  const aPositiveNumbers = [];
  const aNegativeNumbers = [];

  aOriginalData.forEach((oRow) => {
    let nValue;
    let sFormatedDate;

    if (!bIsING) {
      nValue = parseFloat(oRow[2].replace(/"/g, ""));

      //convert date to DD.MM.YYYY format
      const [sYear, sMonth, sDay] = oRow[0].replace(/"/g, "").split("-");
      sFormatedDate = `${sDay}.${sMonth}.${sYear}`;
    } else {
      nValue = oRow[2];
      sFormatedDate = oRow[0];
    }
    const sOperationTitle = oRow[1]
      .replace(/"Nazwa nadawcy : /g, "")
      .replace(/"/g, ""); //remove "Nazwa nadawcy :"
    if (!isNaN(nValue)) {
      // Separate positive and negative numbers
      if (nValue >= 0) {
        aPositiveNumbers.push([sFormatedDate, sOperationTitle, nValue]);
      } else {
        aNegativeNumbers.push([sFormatedDate, sOperationTitle, nValue]);
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

  // Add a list to the element with the id "outcome_list"
  const oOwnOutcomeList = generateList(aOwnOutcome);
  document.getElementById("outcome_list").appendChild(oOwnOutcomeList);
}

/**
 * Generate whole array:
 */
function generateList(aArray) {
  const oList = document.getElementById("outcome_list");
  oList.classList.add("custom-list");

  aArray.forEach((oItem, nIndex) => {
    createElement(oItem, nIndex, oList, true);
  });

  return oList;
}

/**
 * Create new element on an HTML list
 */
function createElement(oItem, nIndex, oList, bIsOwnOutcome) {
  const oListItem = document.createElement("li");

  const oItemWrapper = document.createElement("div");
  oItemWrapper.style.width = "800px";

  const oItemContent = document.createElement("span");
  const boldText = document.createElement("strong");
  boldText.textContent = oItem[0];

  oItemContent.appendChild(boldText);
  oItemContent.appendChild(document.createTextNode(` ${oItem[1]}`));

  const oAdditionalInfo = document.createElement("span");
  oAdditionalInfo.textContent = `${oItem[2]} zł`;

  oItemWrapper.appendChild(oItemContent);
  oItemWrapper.appendChild(oAdditionalInfo);

  oListItem.appendChild(oItemWrapper);

  //button for moving data from one list to another:
  const oButton = document.createElement("button");
  oButton.classList.add("btn", "btn-outline-secondary");
  oButton.style.width = "300px";
  oButton.style.marginTop = "0.25em";
  oButton.style.marginBottom = "0.25em";

  if (bIsOwnOutcome) {
    oButton.textContent = "Przenieś do wydatków wspólnych";
    oButton.addEventListener("click", () => {
      moveToCommon(nIndex, oItem, oListItem);
    });
  } else {
    oButton.textContent = "Przenieś do wydatków własnych";
    oButton.addEventListener("click", () => {
      moveToOwn(nIndex, oItem, oListItem);
    });
  }

  oItemWrapper.appendChild(oItemContent);
  oListItem.appendChild(oItemWrapper);
  oListItem.appendChild(oAdditionalInfo);
  oListItem.appendChild(oButton);

  if (nIndex % 2 == 0) {
    oListItem.style.backgroundColor = "#bdcdd6";
  } else {
    oListItem.style.backgroundColor = "white";
  }

  oList.appendChild(oListItem);
}
/**
 * Move expense from own to common
 */
function moveToCommon(nIndex, oItem, oListItem) {
  if (aOwnOutcome.length === 1)
    aOwnOutcome = []; //handle last element (there were some bugs)
  else {
    aOwnOutcome.splice(nIndex, 1);
  }
  oListItem.remove(); //remove item from HTML list
  aCommonOutcome.push(oItem); //push item to common outcome

  //create new HTML list item in common list:
  const oNewListItem = document.createElement("li");
  createElement(oItem, nIndex, oNewListItem, false);

  document.getElementById("common_list").appendChild(oNewListItem);

  getCommonValues();
}

/**
 * Move expense from common to own
 */
function moveToOwn(nIndex, oItem, oListItem) {
  if (aCommonOutcome.length === 1)
    aCommonOutcome = []; //handle last element (there were some bugs)
  else {
    aCommonOutcome.splice(nIndex, 1);
  }
  oListItem.remove(); //remove item from HTML list
  aOwnOutcome.push(oItem); //push item to own outcome

  //create new HTML list item in own outcome list:
  const oNewListItem = document.createElement("li");
  createElement(oItem, nIndex, oNewListItem, true);
  document.getElementById("outcome_list").appendChild(oNewListItem);

  getCommonValues();
}

function getCommonValues() {
  aCommonValues = [];
  aCommonOutcome.forEach((oElement) => {
    aSingleArray = [];
    aSingleArray.push(oElement[2]);
    aCommonValues.push(aSingleArray);
  });
}
