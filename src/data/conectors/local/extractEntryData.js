export const TODAY = "TODAY";
export const YESTERDAY = "YESTERDAY";

export const BREAKFAST = "BREAKFAST";
export const LUNCH = "LUNCH";
export const DINNER = "DINNER";
export const SNACKS = "SNACKS";

export const BREAKFAST_TIME = "Breakfast";
export const LUNCH_TIME = "Lunch";
export const DINNER_TIME = "Dinner";
export const SNACKS_TIME = "Snacks";

const REPLACMENTS = [
  { word: "today's", replace: "", token: TODAY },
  { word: "todays", replace: "", token: TODAY },
  { word: "today", replace: "", token: TODAY },

  { word: "yesterday's", replace: "", token: YESTERDAY },
  { word: "yesterdays", replace: "", token: YESTERDAY },
  { word: "yesterday", replace: "", token: YESTERDAY },

  { word: "breakfast", replace: "", token: BREAKFAST },
  { word: "lunch", replace: "", token: LUNCH },
  { word: "dinner", replace: "", token: DINNER },
  { word: "snacks", replace: "", token: SNACKS },
  { word: "snack", replace: "", token: SNACKS },

  { word: "one hundred ", replace: "100 " },

  { word: "half ", replace: "0.5 " },
  { word: "quater  ", replace: "0.25 " },
  { word: "three quaters  ", replace: "0.75 " },

  { word: "one ", replace: "1 " },
  { word: "two ", replace: "2 " },
  { word: "three ", replace: "3 " },
  { word: "four ", replace: "4 " },
  { word: "five ", replace: "5 " },
  { word: "six ", replace: "6 " },
  { word: "seven ", replace: "7 " },
  { word: "eight ", replace: "8 " },
  { word: "nine ", replace: "9 " },

  { word: "ten ", replace: "10 " },
  { word: "twenty ", replace: "20 " },
  { word: "thirity ", replace: "30 " },
  { word: "fourty ", replace: "40 " },
  { word: "fifity ", replace: "50 " },
  { word: "sixity ", replace: "60 " },
  { word: "seventy ", replace: "70 " },
  { word: "eighty ", replace: "80 " },
  { word: "ninity ", replace: "90 " }
];

const UNIT_MATCHES = [
  { word: "g", replace: "grams" },
  { word: "gram", replace: "grams" },
  { word: "grams", replace: "grams" }
];

const DAYS = 86400000;

function extractEntryData(input) {
  let output = input;
  let tokens = [];

  const now = new Date();

  let dayDate;
  let mealTime;
  let lines = [];

  REPLACMENTS.forEach(item => {
    if (output.indexOf(item.word) > -1) {
      output = output.replace(item.word, item.replace);

      if (item.token) {
        tokens = [...tokens, item.token];
      }
    }
  });

  output = output.trim();

  if (tokens.indexOf(TODAY) > -1) {
    dayDate = now.toISOString();
  } else if (tokens.indexOf(YESTERDAY) > -1) {
    dayDate = new Date(now - 1 * DAYS).toISOString();
  }

  if (tokens.indexOf(BREAKFAST) > -1) {
    mealTime = BREAKFAST_TIME;
  } else if (tokens.indexOf(LUNCH) > -1) {
    mealTime = LUNCH_TIME;
  } else if (tokens.indexOf(DINNER) > -1) {
    mealTime = DINNER_TIME;
  } else if (tokens.indexOf(SNACKS) > -1) {
    mealTime = SNACKS_TIME;
  }

  lines = extractLinesFromData(output);

  return { dayDate, mealTime, lines };
}

function extractLinesFromData(input) {
  let output = [];
  let lastChar;
  let stringArray = input.split("");
  let text = "";
  let quantity = "";
  let isQuantity;
  let unit = "";
  let foodName = "";
  let saveNewItem = false;
  let firstWord;

  stringArray.forEach((item, i) => {
    saveNewItem = false;
    isQuantity = false;

    if (
      lastChar &&
      lastChar === " " &&
      item !== " " &&
      item !== "." &&
      Number.isInteger(+item) === true
    ) {
      saveNewItem = true;
    } else if (i === stringArray.length - 1) {
      text = text + item;
      saveNewItem = true;
    }

    if (item !== " " && (item === "." || Number.isInteger(+item) === true)) {
      isQuantity = true;
    }

    if (saveNewItem === true) {
      foodName = text.replace(quantity, "");

      const matches = foodName.trim().match(/^([\w-]+)/gm);

      if (matches && matches.length > -1) {
        firstWord = matches[0];
      }

      UNIT_MATCHES.some(item => {
        if (item.word === firstWord) {
          unit = item.replace;

          foodName = foodName.replace(firstWord, "").trim();

          return true;
        }
        return false;
      });

      foodName = foodName.trim();
      foodName = foodName.replace(/^of\s+/gm, "");
      foodName = foodName.replace(/^a\s+/gm, "");
      foodName = foodName.replace(/\s+and$/gm, "");

      text = text.trim();
      text = text.replace(/\s+and$/gm, "");

      text = text.replace("0.25 ", "quater ");
      text = text.replace("0.5 ", "half ");
      text = text.replace("0.75 ", "three quaters ");

      const newItem = {
        text,
        quantity: +quantity,
        unit,
        foodName
      };

      output.push(newItem);

      text = item;
      quantity = "";
      unit = "";
      foodName = "";
      saveNewItem = false;

      quantity = isQuantity === true ? item : "";
    } else {
      text = text + item;

      quantity = isQuantity === true ? quantity + item : quantity;
    }

    lastChar = item;
  });

  return output;
}

export default extractEntryData;
