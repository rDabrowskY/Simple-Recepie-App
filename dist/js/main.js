const API = "https://www.themealdb.com/api/json/v1/1/";

const body = document.querySelector("body");
const main = document.querySelector("main");
const recepieContainer = document.querySelector("#fullRecepieSection__content");
const fullRecepiePage = document.querySelector("#fullRecepieSection");
const backBtn = document.querySelector("#back");
const likeBtn = document.querySelector("#likeRecepie");
const likedRecepeiesBtn = document.querySelector("#likedBtn");
const confirmation = document.querySelector(".resultsSection__confirmation");
const recepiesContainer = document.querySelector("#resultsSection__content");
const resultCount = document.querySelector(".resultsSection__amount");
const form = document.querySelector("#formContainer__form");

const appInit = () => {
  setApp();
  backBtn.addEventListener("click", () => {
    fullRecepiePage.classList.add("fullRecepieSection--none");
    body.classList.add("no-scroll");
    main.classList.remove("none");
  });
  likeBtn.addEventListener("click", likeRecepie);
  likedRecepeiesBtn.addEventListener("click", displayLikedRecepies);
  form.addEventListener("submit", getRecepieByName);
};
const setApp = () => {
  const typeSubcategoryCon = document.querySelector("#categorySubmenu__type");
  const areaSubcategoryCon = document.querySelector("#categorySubmenu__area");

  setCategories(typeSubcategoryCon, "list.php?c=list");
  setCategories(areaSubcategoryCon, "list.php?a=list");

  body.classList.add("no-scroll");
  main.classList.remove("none");
};

//Getting and set sublist of categories

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
  } catch (err) {
    console.error(err);
  }
};

const getRecepiesFromCategories = async (e, category) => {
  let flag;

  if (e.path[1].id === "categorySubmenu__type") {
    flag = "c";
    displayRecepies(flag, category);
  } else {
    flag = "a";
    displayRecepies(flag, category);
  }
};

//Recepies by category or area

const displayRecepies = async (flag, category) => {
  resultCount.textContent = "Results:";
  recepiesContainer.innerHTML = "";
  try {
    const res = await fetch(`${API}filter.php?${flag}=${category}`);
    const data = await res.json();
    const meals = data.meals;
    for (let i = 0; i < meals.length; i++) {
      let recepie = `
      <div class="recepie" data-id="${meals[i].idMeal}">
        <img class="recepie__img" src=${meals[i].strMealThumb} alt=${meals[i].strMeal}>
        <div class="recepie__text">
          <h2 class="recepie__name">${meals[i].strMeal}</h2>
        </div>
        <button class="recepie__btn primary-btn">Let's cook!</button>
      </div>`;
      recepiesContainer.innerHTML += recepie;
    }
    resultCount.textContent = `Results: ${meals.length}`;
  } catch (err) {
    console.error(err);
  }
  const recepieBtn = document.querySelectorAll(".recepie__btn");
  recepieBtn.forEach((btn) => btn.addEventListener("click", showFullRecepie));
};

//Full recepie functions, display all info about recepie

const showFullRecepie = (e) => {
  const recepieID = e.path[1].dataset.id;
  getFullRecepie(recepieID);
  fullRecepiePage.classList.remove("fullRecepieSection--none");
  main.classList.add("none");
  body.classList.remove("no-scroll");
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
    id: obj.idMeal,
    name: obj.strMeal,
    category: obj.strCategory,
    area: obj.strArea,
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
  recepieContainer.innerHTML = "";
  let recepie = `
    <img class="recepie__image" src=${obj.image} alt=${obj.name}>
    <div class="recepie__text">  
      <h2 class="recepie__title">${obj.name}</h2>
      <div class="recepie__tags">
        <p class="info">${obj.category}</p>
        <p class="info">${obj.area}</p>
      </div>
    </div>
    <div class="recepie__ingredients">
      <h3 class="title">Ingredients</h3>
        ${createIngredientsList(obj.ingredient, obj.measure)}
    </div>
    <div class="recepie__description">
      <h3 class="title">Instruction</h3>
      <p class="description">${obj.instruction}</p>
      <p class="enjoy">Enjoy!</p>
    </div>
    `;
  recepieContainer.innerHTML += recepie;
  likeBtn.dataset.id = obj.id;
  setLikeBtn(likeBtn);
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
//

//local storage functions

const getRecepieLS = () => {
  const recepies = JSON.parse(localStorage.getItem("recepiesIDs"));
  return recepies === null ? [] : recepies;
};

const addRecepieLS = (recepieId) => {
  const recepies = getRecepieLS();
  localStorage.setItem("recepiesIDs", JSON.stringify([...recepies, recepieId]));
};

const removeRecepieLS = (recepieId) => {
  const recepies = getRecepieLS();
  localStorage.setItem(
    "recepiesIDs",
    JSON.stringify(recepies.filter((id) => id !== recepieId))
  );
};

//
//liked recepies functions
const likeRecepie = () => {
  const btnID = likeBtn.dataset.id;
  if (likeBtn.classList.contains("likeRecepie--active")) {
    removeRecepieLS(btnID);
    likeBtn.classList.remove("likeRecepie--active");
  } else {
    addRecepieLS(btnID);
    likeBtn.classList.add("likeRecepie--active");
  }
};
const setLikeBtn = (likeBtn) => {
  const btnId = likeBtn.dataset.id;
  const likedRecepies = getRecepieLS();
  if (likedRecepies.length) {
    for (let key of likedRecepies) {
      if (key === btnId) {
        likeBtn.classList.add("likeRecepie--active");
        return;
      } else {
        likeBtn.classList.remove("likeRecepie--active");
      }
    }
  } else {
    likeBtn.classList.remove("likeRecepie--active");
  }
};
const displayLikedRecepies = async () => {
  const likedRecepies = getRecepieLS();
  recepiesContainer.innerHTML = "";
  if (likedRecepies.length) {
    resultCount.textContent = `You have ${likedRecepies.length} liked recepies :D`;

    for (let recepieID of likedRecepies) {
      try {
        const resp = await fetch(`${API}lookup.php?i=${recepieID}`);
        const data = await resp.json();
        const meal = data.meals[0];
        displayRecepie(meal);
      } catch (err) {
        console.error(err);
      }
    }
    const recepieBtn = document.querySelectorAll(".recepie__btn");
    recepieBtn.forEach((btn) => btn.addEventListener("click", showFullRecepie));
  } else {
    resultCount.textContent = `You don't have any liked recepies :(`;
  }
};

const displayRecepie = (meal) => {
  let recepie = `
      <div class="recepie" data-id="${meal.idMeal}">
        <img class="recepie__img" src=${meal.strMealThumb} alt=${meal.strMeal}>
        <div class="recepie__text">
          <h2 class="recepie__name">${meal.strMeal}</h2>
        </div>
        <button class="recepie__btn primary-btn">Let's cook!</button>
      </div>`;

  recepiesContainer.innerHTML += recepie;
};

//

//form functions to display recepies by name

const getRecepieByName = (e) => {
  e.preventDefault();
  const input = document.querySelector("#formContainer__text");
  recepiesContainer.innerHTML = "";
  displayRecepiesByName(input.value);
};

const displayRecepiesByName = async (name) => {
  let trimedName = trimName(name);
  const url = encodeURI(`${API}search.php?s=${trimedName}`);
  try {
    const resp = await fetch(url);
    const data = await resp.json();
    const meals = data.meals;
    if (!data.meals) {
      resultCount.textContent = `No recepies matches :(`;
      return;
    }
    for (let i = 0; i < meals.length; i++) {
      let recepie = `
      <div class="recepie" data-id="${meals[i].idMeal}">
        <img class="recepie__img" src=${meals[i].strMealThumb} alt=${meals[i].strMeal}>
        <div class="recepie__text">
          <h2 class="recepie__name">${meals[i].strMeal}</h2>
        </div>
        <button class="recepie__btn primary-btn">Let's cook!</button>
      </div>`;
      recepiesContainer.innerHTML += recepie;
    }
    resultCount.textContent = `Results: ${meals.length}`;
  } catch (err) {
    console.error(err);
  }
  const recepieBtn = document.querySelectorAll(".recepie__btn");
  recepieBtn.forEach((btn) => btn.addEventListener("click", showFullRecepie));
};

//Trim text function to prevent double spacebar

const trimName = (string) => {
  let regex = / {2,}/g;
  return string.replace(regex, "").trim();
};
//

document.addEventListener("DOMContentLoaded", appInit);
