/**
 * Компонент для отображения списка новостей
 *
 * @class NewsList
 * @author Игитян Т.А.
 * @public
 */
class NewsList {
  /**
   * Конструктор
   * @param {object} newsWrapper
   * @param {object[]} newsList
   * @public
   */
  constructor(newsWrapper, newsList) {
    this.newsList = newsList;
    this.newsWrapper = newsWrapper;
    this.swipeCount = 0;
    this.x1 = null;
    this.y1 = null;

    this.#initNewsComponent();
  }

  /**
   * Метод для создания элемента шаблона
   * @param {string} elementType
   * @param {string} className
   * @param {string} text
   * @param {string} src
   * @private
   */
  #createTemplateItem = (elementType, className, text, src) => {
    const element = document.createElement(elementType);
    element.className = className;

    if (text) {
      element.textContent = text;
    }
    if (elementType === "img") {
      element.src = src;
    }

    return element;
  };

  /**
   * Метод для создания шаблона контейнера, который содержит в себе контент новости
   * @param {object} item
   * @private
   */
  #createNewsItem = (item) => {
    const container = this.#createTemplateItem("div", "news__container");

    const image = this.#createTemplateItem(
      "img",
      "news__container-image",
      null,
      item.imageUrl
    );

    const classification = this.#createTemplateItem(
      "div",
      "news__container-classification"
    );

    const classificationText = this.#createTemplateItem(
      "div",
      "news__container-classification-text",
      item.classification
    );

    const icon = this.#createTemplateItem(
      "img",
      "news__container-classification-icon",
      null,
      "./icons/icon.png"
    );

    const title = this.#createTemplateItem(
      "div",
      "news__container-title",
      item.title
    );

    const description = this.#createTemplateItem(
      "div",
      "news__container-description",
      item.description
    );

    const date = this.#createTemplateItem(
      "div",
      "news__container-date",
      item.date
    );

    classification.appendChild(icon);
    classification.appendChild(classificationText);

    container.appendChild(image);
    container.appendChild(classification);
    container.appendChild(title);
    container.appendChild(description);
    container.appendChild(date);

    return container;
  };

  /**
   * Метод для инициализации компонента
   * @private
   */
  #initNewsComponent = () => {
    // если ширина страницы больше 1024px
    // отображае все элементы на странице
    if (this.newsWrapper.clientWidth > 1024) {
      this.newsList.forEach((item) => {
        this.newsWrapper.appendChild(this.#createNewsItem(item));
      });
    } else {
      // иначе добавляем изначально не все элементы, исходя из ширины страницы
      // т.к остальные элементы можно будет просмотреть с помощью swipe
      if (this.swipeCount === 0) {
        this.newsWrapper.appendChild(
          this.#createNewsItem(this.newsList[this.swipeCount])
        );
        if (this.newsWrapper.clientWidth > 768) {
          if (this.swipeCount + 1 > this.newsList.length - 1) {
            this.newsWrapper.appendChild(
              this.#createNewsItem(this.newsList[this.newsList.length - 1])
            );
          } else {
            this.newsWrapper.appendChild(
              this.#createNewsItem(this.newsList[this.swipeCount + 1])
            );
          }
        }
        this.swipeCount++;
      }

      // добавляем обработчики для реализации swipe

      // обработка события touchstart
      this.newsWrapper.addEventListener(
        "touchstart",
        (event) => {
          this.x1 = event.touches[0].clientX;
          this.y1 = event.touches[0].clientY;
        },
        false
      );

      // обработка события touchmove
      this.newsWrapper.addEventListener(
        "touchmove",
        (event) => {
          if (!this.x1 || !this.y1) {
            return false;
          }
          let x2 = event.touches[0].clientX;
          let y2 = event.touches[0].clientY;

          let xDiff = x2 - this.x1;
          let yDiff = y2 - this.y1;

          // если пользователь сделал свайп, то координаты начала нажатия отличаются от текущих координат
          if (Math.abs(xDiff) > Math.abs(yDiff)) {
            // свяай вправо
            if (xDiff > 0) {
              this.swipeCount++;
              if (this.swipeCount > this.newsList.length - 1) {
                this.swipeCount = 0;
              }
            } else {
              // свайп влево
              this.swipeCount--;
              if (this.swipeCount < 0) {
                this.swipeCount = this.newsList.length - 1;
              }
            }

            // удаляем все новости на странице
            while (this.newsWrapper.firstChild) {
              this.newsWrapper.removeChild(this.newsWrapper.lastChild);
            }

            // добавляем 1 элемент на страницу по умолчанию
            this.newsWrapper.appendChild(
              this.#createNewsItem(this.newsList[this.swipeCount])
            );

            // если будут 2 колонки, то добавляем также второй элемент
            if (this.newsWrapper.clientWidth > 768) {
              this.newsWrapper.appendChild(
                this.#createNewsItem(this.newsList[this.swipeCount + 1])
              );
            }
          }

          this.x1 = null;
          this.y1 = null;
        },
        false
      );
    }
  };
}
