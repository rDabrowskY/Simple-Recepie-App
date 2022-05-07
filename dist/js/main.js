const appInit = () => {
  //btns
  const categoriesBtn = document.querySelector("#categoriesBtn");
  categoriesBtn.addEventListener("click", categories);
};

document.addEventListener("DOMContentLoaded", appInit);
