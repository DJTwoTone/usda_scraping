import axios from 'axios';
import fs from 'fs';

let seed = [
'Beef','Milk','Cheese','Fish','Eggs','Pork','Tofu','Beans','Olive oil','Rice','Chicken','Tomato','Soy milk','Onion','Carrots','Peanuts','Palm oil','Wheat','Potatoes','Sugar','Almond Milk','Apples'
];

let testSeed = 'beef';
let dataType = 'SR Legacy';
let api_key = 'jEpUeB2ALb7nkKLjtSb9VZzuGNKnagwBdh2Tn9cE';

let foodDataObj = {}


async function getFoodData(food, dataType, apiKey) {
    try {
      const res = await axios.get(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${food}&dataType=${dataType}&api_key=${apiKey}`);
    //   console.log(res.data.foods);
        return res.data.foods;
    } catch (error) {
      console.error(error);
    }
  }

function formatFoodData(obj) {
    let newObj = {}
    let {fdcId, description, foodCategory} = obj;
    newObj.fdcId = fdcId;
    newObj.description = description;
    newObj.foodCategory = foodCategory;

    obj.foodNutrients.forEach(nutrient => {
        newObj[nutrient.nutrientName] = `${nutrient.value}${nutrient.unitName}`;
    })
    return newObj;
}

async function makeFoodJson(seedStr) {
    let data = await getFoodData(seedStr, dataType, api_key);
    let mappedData = data.map(formatFoodData);
    fs.writeFile(`${seedStr}Data.json`, JSON.stringify(mappedData), function(err) {
        if (err) throw err;
        console.log(`completed - ${seedStr}`);
    })
}

seed.forEach(s => makeFoodJson(s));



// let foodData = await getFoodData(testSeed, dataType, api_key)

// let mappedData = foodData.map(formatFoodData);

// console.log(mappedData[0])
