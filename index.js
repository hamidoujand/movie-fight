let autocompleteConfig = {
  renderOptions(movie) {
    let imageSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
      <img src="${imageSrc}" />
      ${movie.Title}
    `;
  },

  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(search) {
    let response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "YOUR_API_KEY",
        s: search,
      },
    });
    if (response.data.Error) {
      return [];
    }
    return response.data.Search;
  },
};
createAutoComplete({
  ...autocompleteConfig,
  root: document.querySelector("#left-autocomplete"),
  onOptionsSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#left-summary"), "left");
  },
});
createAutoComplete({
  ...autocompleteConfig,
  root: document.querySelector("#right-autocomplete"),
  onOptionsSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#right-summary"), "right");
  },
});
let leftMovie;
let rightMovie;

let onMovieSelect = async (movie, summaryElem, side) => {
  let response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "422fc185",
      i: movie.imdbID,
    },
  });
  summaryElem.innerHTML = movieTemplate(response.data);
  if (side === "left") {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }
  if (leftMovie && rightMovie) {
    runCompare();
  }
};

function runCompare() {
  let leftSideStats = document.querySelectorAll("#left-summary .notification");
  let rightSideStats = document.querySelectorAll(
    "#right-summary .notification"
  );
  leftSideStats.forEach((leftStats, index) => {
    let rightStats = rightSideStats[index];
    let leftSideValues = parseInt(leftStats.dataset.value);
    let rightSideValues = parseInt(rightStats.dataset.value);
    if (rightSideValues > leftSideValues) {
      leftStats.classList.remove("is-primary");
      leftStats.classList.add("is-warning");
    } else {
      rightStats.classList.remove("is-primary");
      rightStats.classList.add("is-warning");
    }
  });
}

let movieTemplate = (movieObj) => {
  let dolors = parseInt(
    movieObj.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
  );
  let metaScore = parseInt(movieObj.Metascore);
  let imdbScore = parseFloat(movieObj.imdbRating);
  let imdbVotes = parseInt(movieObj.imdbVotes.replace(/,/g, ""));

  let award = movieObj.Awards.split(" ").reduce((pre, word) => {
    let value = parseInt(word);
    if (isNaN(value)) {
      return pre;
    } else {
      pre = pre + value;
      return pre;
    }
  }, 0);
  return `
    <article class='media'>
          <figure class="media-left">
            <p class='image'>
                <img src="${movieObj.Poster}"/>
            </p>
          </figure>
          <div class='media-content'>
              <div class='content'>
                    <h1>${movieObj.Title}</h1>
                    <h4>${movieObj.Genre}</h4>
                    <p>${movieObj.Plot}</p>
              </div>
          </div>  
    </article>
    <article data-value=${award} class='notification is-primary'>
          <p class="title">${movieObj.Awards}</p>
          <p class='subtitle'>Awards</p>
    </article>
    <article data-value=${dolors} class='notification is-primary'>
          <p class="title">${movieObj.BoxOffice}</p>
          <p class='subtitle'>Box Office</p>
    </article>
    <article data-value=${metaScore} class='notification is-primary'>
          <p class="title">${movieObj.Metascore}</p>
          <p class='subtitle'>Metascore</p>
    </article>
    <article data-value=${imdbScore} class='notification is-primary'>
          <p class="title">${movieObj.imdbRating}</p>
          <p class='subtitle'>IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class='notification is-primary'>
          <p class="title">${movieObj.imdbVotes}</p>
          <p class='subtitle'>IMDB Votes</p>
    </article>
  
  `;
};
