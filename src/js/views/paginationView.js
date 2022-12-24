import View from './View';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      console.log(goToPage);
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;

    const prevMarkupButton = function (currentPage) {
      return `
      <button data-goto="${
        currentPage - 1
      }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
      </button>
      `;
    };
    const nextMarkupButton = function (currentPage) {
      return `
      <button data-goto="${
        currentPage + 1
      }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
      </button>
      `;
    };
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(numPages);

    //Page 1 and there are other pages
    if (currentPage === 1 && numPages > 1) {
      return nextMarkupButton(currentPage);
    }
    // Last page
    if (currentPage === numPages && numPages > 1) {
      return prevMarkupButton(currentPage);
    }
    //Other page
    if (currentPage < numPages) {
      return `${prevMarkupButton(currentPage)} ${nextMarkupButton(
        currentPage
      )}`;
    }
    //Page 1 and there are no pages
    return 'no more pages is found';
  }
}
export default new PaginationView();
