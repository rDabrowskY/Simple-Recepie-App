let API = "https://www.themealdb.com/api/json/v1/1/";
const body = document.querySelector("body");
const main = document.querySelector("main");
const recepieContainer = document.querySelector("#fullRecepieSection__content");
const appInit = () => {
  setApp();
  const likedRecepies = document.querySelector("#likedBtn");
  likedRecepies.addEventListener("click", () => {
    const fullRecepiePage = document.querySelector("#fullRecepieSection");
    fullRecepiePage.scrollIntoView();
  });
  const backBtn = document.querySelector("#back");
  backBtn.addEventListener("click", () => {
    body.scrollIntoView();
    body.classList.add("no-scroll");
  });
};
const setApp = () => {
  const typeSubcategoryCon = document.querySelector("#categorySubmenu__type");
  const areaSubcategoryCon = document.querySelector("#categorySubmenu__area");
  setCategories(typeSubcategoryCon, "list.php?c=list");
  setCategories(areaSubcategoryCon, "list.php?a=list");
  body.classList.add("no-scroll");
};
const setCategories = async (container, target) => {
  try {
    const res = await fetch(`${API}${target}`);
    const data = await res.json();
    const category = data.meals;
    for (let i = 0; i < category.length; i++) {
      let div = document.createElement("div");
      div.textContent = category[i].strCategory
        ? category[i].strCategory
        : category[i].strArea;
      div.addEventListener("click", (e) => {
        getRecepiesFromCategories(
          e,
          category[i].strCategory
            ? category[i].strCategory
            : category[i].strArea
        );
      });
      container.appendChild(div);
    }
    console.log(data);
  } catch (err) {
    displayError(err);
    console.log(err);
  }
};
const getRecepiesFromCategories = async (e, category) => {
  let url;
  const recepiesContainer = document.querySelector("#resultsSection__content");
  if (e.path[1].id === "categorySubmenu__type") {
    url = `${API}filter.php?c=${category}`;
    displayRecepies(url, recepiesContainer);
  } else {
    url = `${API}filter.php?a=${category}`;
    displayRecepies(url, recepiesContainer);
  }
};
const displayRecepies = async (url, conteiner) => {
  const resultCount = document.querySelector(".resultsSection__amount");
  resultCount.textContent = "Results:";
  conteiner.innerHTML = "";
  try {
    const res = await fetch(url);
    const data = await res.json();
    const meals = data.meals;
    console.log(meals);
    for (let i = 0; i < meals.length; i++) {
      let recepie = `
      <div class="recepie" data-recepie-id="${meals[i].idMeal}">
        <img class="recepie__img" src=${meals[i].strMealThumb} alt=${meals[i].strMeal}>
        <div class="recepie__text">
          <h2 class="recepie__name">${meals[i].strMeal}</h2>
        </div>
        <button class="recepie__btn primary-btn">Let's cook!</button>
      </div>`;
      conteiner.innerHTML += recepie;
    }
    resultCount.textContent = `Results: ${meals.length}`;
  } catch (err) {
    console.log(err);
  }
  const recepieBtn = document.querySelectorAll(".recepie__btn");
  recepieBtn.forEach((btn) => btn.addEventListener("click", showFullRecepie));
};

const showFullRecepie = (e) => {
  const recepieID = e.path[1].getAttribute("data-recepie-id");
  const fullRecepie = document.querySelector("#fullRecepieSection");
  getFullRecepie(recepieID);
  fullRecepie.scrollIntoView();
  body.style.overflowX = "hidden";
  body.classList.remove("no-scroll");
};

const displayError = (msg) => {
  const confirmation = document.querySelector(".resultsSection__confirmation");
  confirmation.textContent = msg;
};

const getFullRecepie = async (id) => {
  try {
    const resp = await fetch(`${API}lookup.php?i=${id}`);
    const data = await resp.json();
    const meal = data.meals[0];
    const formatedObj = createRecepieObj(meal);
    createRecepie(formatedObj);
  } catch (err) {
    console.error(err);
  }
};
const createRecepieObj = (obj) => {
  let recepieObj = {
    name: obj.strMeal,
    category: obj.strCategory,
    area: obj.strArea,
    // tag: obj.strTags ? obj.strTags : "",
    image: obj.strMealThumb,
    instruction: obj.strInstructions,
    ingredient: [],
    measure: [],
  };

  let regexpIngredient = /strIngredient/;
  let regexpMeasure = /strMeasure/;

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (regexpMeasure.test(key)) {
        recepieObj.measure.push(obj[key]);
        if (obj[key] == "" || obj[key] === " ") {
          recepieObj.measure.pop(obj[key]);
          break;
        }
      }
    }
  }
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (regexpIngredient.test(key)) {
        recepieObj.ingredient.push(obj[key]);
        if (obj[key] === "" || obj[key] === " " || obj[key] === null) {
          recepieObj.ingredient.pop(obj[key]);
          break;
        }
      }
    }
  }
  return recepieObj;
};
const createRecepie = (obj) => {
  console.log(obj);
  recepieContainer.innerHTML = "";
  let recepie = `
    <img class="recepie__image" src=${obj.image} alt=${obj.name}>
    <h2 class="recepie__title">${obj.name}</h2>
    <div class="recepie__tags">
      <p class="info">${obj.category}</p>
      <p class="info">${obj.area}</p>
    </div>
    <div class="recepie__ingredients">
      <h3 class="title">Ingredients</h3>
        ${createIngredientsList(obj.ingredient, obj.measure)}
    </div>
    <div class="recepie__description">
      <h3 class="title">Instruction</h3>
      <p class="description">${obj.instruction}</p>
    </div>
    <p class="enjoy">Enjoy!</p>`;
  recepieContainer.innerHTML += recepie;
  console.log(recepieContainer);
};
const createIngredientsList = (objIng, objMeas) => {
  const list = document.createElement("ul");
  list.classList.add("ingredients__list");
  for (let i = 0; i < objIng.length; i++) {
    let item = `
    <li class="ingredient">
      <span class="name">${objIng[i]}</span>
      <span class="measure">${objMeas[i]}</span>
    </li>`;
    list.innerHTML += item;
  }
  return list.outerHTML;
};
document.addEventListener("DOMContentLoaded", appInit);
