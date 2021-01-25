var imagePath = "https://image.tmdb.org/t/p/w300/";
var ajaxUrl = "https://api.themoviedb.org/3/search/person";
var api_key = "4809e2c8d7aced296b24cc62c56871c4";
var container = document.getElementById("container");
var moreInfoDiv = document.getElementById("moreInfo");
let searchBtn = document.getElementById("searchBtn");
let searchInput = document.getElementById("searchInput");
let pageNumberInput = document.getElementById("pageNumber");
let totalPagesSpan = document.getElementById("totalPages");
searchInput.addEventListener("keypress", testKey);
searchInput.addEventListener("keyup", () => {
  pageNumberInput.value = 1;
});
searchBtn.addEventListener("click", callApi);
pageNumberInput.addEventListener("change", callApi);

function testKey(e) {
  if (e.key == "Enter") {
    callApi();
  }
}

function callApi(e) {
  let page = pageNumberInput.value;
  container.innerHTML = "";
  let url =
    ajaxUrl +
    "?api_key=" +
    api_key +
    "&query=" +
    searchInput.value +
    "&page=" +
    page +
    "&include_adult=false";
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      showResults(data);
    })
    .catch(console.error);
}

function showResults(obj) {
  if (searchInput.value == "") {
    totalPagesSpan.innerText = "/0";
    alert("Unesi ime glumca/glumice");
    return;
  }
  if (obj.results.length == 0) {
    totalPagesSpan.innerText = "/0";
    alert("Nema glumca sa takvim imenom");
    return;
  }

  totalPagesSpan.innerText = "/" + obj.total_pages;
  pageNumberInput.setAttribute("max", obj.total_pages);
  for (let x of obj.results) {
    if (x.known_for_department == "Acting") {
      let xDiv = document.createElement("div");
      container.appendChild(xDiv);
      xDiv.setAttribute("class", "actor");
      let xImg = document.createElement("img");
      if (x.profile_path != null) {
        xImg.setAttribute("src", imagePath + x.profile_path);
      } else {
        xImg.setAttribute("src", "no-image.png");
      }
      xImg.style.width = "140px";
      let xDivOpis = document.createElement("div");
      xDivOpis.classList.add("opis");
      let xIme = document.createElement("h2");
      xIme.innerText = x.name;
      let xBtn = document.createElement("button");
      xBtn.setAttribute("class", "readMore");
      xBtn.innerText = "Projekti";
      xBtn.addEventListener("click", () => {
        moreInfoMovies(x);
        moreInfoDiv.classList.add("showInfo");
      });
      let xMovies = document.createElement("p");
      x.gender == 1
        ? (xMovies.innerText = "Poznata po: ")
        : x.gender == 2
        ? (xMovies.innerText = "Poznat po: ")
        : (xMovies.innerText = "Poznat/a po: ");
      for (let y of x.known_for) {
        if (y.title) {
          xMovies.innerText += y.title + ", ";
        } else {
          xMovies.innerText += y.name + ", ";
        }
      }
      xMovies.innerText = xMovies.innerText.slice(0, -2);

      xDiv.appendChild(xImg);
      xDiv.appendChild(xDivOpis);
      xDivOpis.appendChild(xIme);
      xDivOpis.appendChild(xMovies);
      xDivOpis.appendChild(xBtn);
    }
  }
}

function moreInfoMovies(x) {
  moreInfoDiv.innerHTML = "";
  let moviePosters = document.createElement("div");
  for (let m of x.known_for) {
    let mDiv = document.createElement("div");
    let mTitle = document.createElement("h2");
    let mOverview = document.createElement("p");
    let image = document.createElement("img");
    m.poster_path
      ? image.setAttribute("src", imagePath + m.poster_path)
      : image.setAttribute("src", "no-image.png");
    image.setAttribute("alt", m.title ? m.title : m.name);
    image.setAttribute("class", "moviePoster");
    m.title ? (mTitle.innerText = m.title) : (mTitle.innerText = m.name);
    mOverview.innerText = m.overview;
    mDiv.classList.add("mDiv");
    mDiv.appendChild(mTitle);
    mDiv.appendChild(mOverview);
    mDiv.appendChild(image);
    moviePosters.appendChild(mDiv);
  }
  moreInfoDiv.appendChild(moviePosters);
}

window.addEventListener("click", function (e) {
  if (
    !moreInfoDiv.contains(e.target) &&
    !e.target.classList.contains("readMore")
  ) {
    moreInfoDiv.classList.remove("showInfo");
  }
});
