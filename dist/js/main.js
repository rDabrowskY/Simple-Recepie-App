let API = "https://www.themealdb.com/api/json/v1/1/";


const appInit = () => {
  setApp();
  const likedRecepies = document.querySelector("#likedBtn");
  likedRecepies.addEventListener("click", () => {
    const fullRecepiePage = document.querySelector("#fullRecepieSection");
    fullRecepiePage.scrollIntoView();
  });
  const backBtn = document
    .querySelector("#back")
    .addEventListener("click", () => {
      const main = document.querySelector("body");
      main.scrollIntoView();
    });
};
const setApp = () => {
  const typeSubcategoryCon = document.querySelector("#categorySubmenu__type");
  const areaSubcategoryCon = document.querySelector("#categorySubmenu__area");

  setCategories(typeSubcategoryCon, "list.php?c=list");
  setCategories(areaSubcategoryCon, "list.php?a=list");
  // setAreaCategories(areaSubcategoryCon)
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
  const fullRecepie = document.querySelector('#fullRecepieSection')
  const recepieData = await getFullRecepie(recepieID)
  fullRecepie.scrollIntoView()
};

const displayError = (msg) => {
  const confirmation = document.querySelector(".esultsSection__confirmation");
  confirmation.textContent = msg;
};

const getFullRecepie = async (id) =>{
  let recepieData = {}
  try{

  }
}
document.addEventListener("DOMContentLoaded", appInit);
