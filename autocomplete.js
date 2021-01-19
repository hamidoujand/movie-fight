let createAutoComplete = ({
  root,
  renderOptions,
  onOptionsSelect,
  inputValue,
  fetchData,
}) => {
  root.innerHTML = `
  <label>
    <b>Search</b>
  </label>
  <input class='input' />
  <div class='dropdown'>
      <div class='dropdown-menu'>
            <div class='dropdown-content results'>

            </div>
      </div>
  </div>
  `;
  let input = root.querySelector("input");
  let dropdown = root.querySelector(".dropdown");
  let resultWrapper = root.querySelector(".results");

  let onInput = debounce(async (e) => {
    let items = await fetchData(e.target.value);
    if (!items.length) {
      dropdown.classList.remove("is-active");
      return;
    }
    resultWrapper.innerHTML = ""; //empty it
    dropdown.classList.add("is-active");
    for (let item of items) {
      let options = document.createElement("a");

      options.classList.add("dropdown-item");
      options.innerHTML = renderOptions(item);
      options.addEventListener("click", (e) => {
        dropdown.classList.remove("is-active");
        input.value = inputValue(item);
        onOptionsSelect(item);
      });
      resultWrapper.appendChild(options);
    }
  }, 1000);

  input.addEventListener("input", onInput);

  document.addEventListener("click", (event) => {
    if (!root.contains(event.target)) {
      //if the click was not happened on the widget then close the widget because events bubbles up
      dropdown.classList.remove("is-active");
    }
  });
};
