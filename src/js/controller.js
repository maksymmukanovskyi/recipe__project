import * as model from './model';
import { MODAL_CLOSE_SEC } from './config';
import RecipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import recipeView from './views/recipeView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';

import '../sass/main.scss';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
// if (module && module.hot) module.hot.accept();

// import { forEach } from 'core-js/core/array';

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    // 0.  Update results view to mark selected search result.
    resultsView.update(model.getSearchResultsPage());

    bookmarksView.update(model.state.bookMarks);
    //1. Loading recipe

    RecipeView.renderSpinner();

    await model.loadRecipe(id);

    //2. Rendering recipe
    // const recipe = model.state.recipe;

    RecipeView.render(model.state.recipe);
  } catch (error) {
    RecipeView.renderError();
  }
};

const ctrlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1.get search query
    const query = searchView.getQuery();
    if (!query) return;
    //2. Load search results
    await model.loadSearchResult(query);

    //3. Render results
    resultsView.render(model.getSearchResultsPage());

    //4. render initital pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const ctrlPagination = function (goToPage) {
  //1. Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2. render NEW pagination buttons
  paginationView.render(model.state.search);
};

const ctrlServings = function (newServings) {
  // Update recipe servings (in state)
  model.updateServings(newServings);
  // Updating recipe view
  // RecipeView.render(model.state.recipe);
  RecipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // update recipe view
  recipeView.update(model.state.recipe);

  // render bookmark
  bookmarksView.render(model.state.bookMarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookMarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show load spinner

    addRecipeView.renderSpinner();
    //Upload the new recipe data

    await model.uploadRecipe(newRecipe);

    //Success message
    addRecipeView.renderMessageOnSucces();

    //Render recipe

    recipeView.render(model.state.recipe);

    //Render bookmark view
    bookmarksView.render(model.state.bookMarks);

    //Change id in url

    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.log('🔥', error);
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  paginationView.addHandlerClick(ctrlPagination);
  RecipeView.addHandlerRednder(controlRecipe);
  RecipeView.addHandlerUpdateServings(ctrlServings);
  RecipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(ctrlSearchResults);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
