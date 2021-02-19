# Movie Fight

![image](images/movieFight.png)

---

## ABOUT

This is the "Movie Fight" and written in Vanilla js and fetches data from an "http://www.omdbapi.com/" and compares 2 movies side by side based on the IMDB and awards that each won etc.

---

## INSTALLING

add your API_KEY and open **index.html**

```js
let response = await axios.get("http://www.omdbapi.com/", {
  params: {
    apikey: "YOUR_API_KEY",
    s: search,
  },
});
```

## BUILT WITH

- Javascript
