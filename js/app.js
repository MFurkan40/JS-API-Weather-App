const form = document.querySelector("section.top-banner form");
const input = document.querySelector(".container input");
const msg = document.querySelector("span.msg");
const list = document.querySelector(".ajax-section .cities");
const langList = document.querySelector("#weight-unit");
const langListOption = document.querySelector("#weight-unit option");

localStorage.setItem(
  "tokenKey",
  "SHoxu5GROKvCyQInTdcOZeX0FmFehr0dm55kBcT8WeO5o5SfoGkDEN4gYpvbTKZu"
); //! encrypted token

// localStorage.setItem(
//   "tokenKeyEncrypted",
//   EncryptStringAES("bdc0a9d3300e48e270c3b01f5ccac115")
// );

// ! Language Choice
localStorage.setItem("lang", "tr");
langList.onchange = () => {
  localStorage.setItem("lang", `${langList.value}`);
  if (langList.value === "tr") {
    langListOption.innerHTML = "Türkçe";
    langListOption.nextElementSibling.innerHTML = "İngilizce";
  } else if (langList.value === "en") {
    langListOption.innerHTML = "Türkish";
    langListOption.nextElementSibling.innerHTML = "English";
  }
};

//! form submit and get Api Info
form.addEventListener("submit", (e) => {
  e.preventDefault();
  getWeatherDataFromApi();
});

// ? Get api function (http methods == Verbs)

const getWeatherDataFromApi = async () => {
  const tokenKey = DecryptStringAES(localStorage.getItem("tokenKey"));

  const inputValue = input.value;
  const units = "metric";
  let lang = localStorage.getItem("lang");
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${tokenKey}&units=${units}&lang=${lang}`;

  try {
    const res = await fetch(url).then((res) => res.json());
    console.log(res);

    const { main, sys, weather, name } = res; //! dest

    const iconUrl = `http://openweathermap.org/img/wn/10d@2x.png`;

    const iconUrlAWS = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;

    // ? Avoid having same  city names
    const cityNameSpans = list.querySelectorAll(".city span");
    const cityNameSpansArray = Array.from(cityNameSpans);
    if (cityNameSpansArray.length > 0) {
      const filteredArray = cityNameSpansArray.filter(
        (span) => span.innerText == name
      );
      if (filteredArray.length > 0) {
        msg.innerText = `You already know the weather for ${name}, Please search for another city`;
        setTimeout(() => {
          msg.innerText = "";
        }, 3000);
        form.reset();
        return;
      }
    }

    //? Card Structre
    const createdLi = document.createElement("li");
    createdLi.classList.add("city");
    createdLi.innerHTML = `<h2 class="city-name" data-name="${name}, ${
      sys.country
    }">
                                <span>${name}</span>
                                <sup>${sys.country}</sup>
                            </h2>
                            <div class="city-temp">${Math.round(
                              main.temp
                            )}<sup>°C</sup>
                            </div>
                            <figure>
                                <img class="city-icon" src="${iconUrl}">
                                <figcaption>${
                                  weather[0].description
                                }</figcaption>
                            </figure>`;
    //append vs. prepend
    list.prepend(createdLi);

    // ! Icon dynamic with Capturing
    createdLi.addEventListener("click", (e) => {
      if (e.target.tagName == "IMG") {
        e.target.src = e.target.src == iconUrl ? iconUrlAWS : iconUrl;
      }
    });

    form.reset();
  } catch (error) {
    msg.innerText = `404 (City Not Found)`;
    setTimeout(() => {
      msg.innerText = "";
    }, 3000);
    form.reset();
  }
};

//! With Axios and CAPTURİNG-BUBLİNG Testing
//! ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// // ? (?) Where this sign is different with fetch.
// const getWeatherDataFromApi = async () => {
//   const tokenKey = DecryptStringAES(localStorage.getItem("tokenKey"));

//   const inputValue = input.value;
//   const units = "metric";
//   let lang = localStorage.getItem("lang");
//   const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${tokenKey}&units=${units}&lang=${lang}`;

//   try {
//     const res = await axios(url); //? (?)

//     const { main, sys, weather, name } = res.data; //? (?)

//     const iconUrl = `http://openweathermap.org/img/wn/10d@2x.png`;

//     const iconUrlAWS = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;

//     // ? Avoid having same  city names
//     const cityNameSpans = list.querySelectorAll(".city span");
//     const cityNameSpansArray = Array.from(cityNameSpans);
//     if (cityNameSpansArray.length > 0) {
//       const filteredArray = cityNameSpansArray.filter(
//         (span) => span.innerText == name
//       );
//       if (filteredArray.length > 0) {
//         msg.innerText = `You already know the weather for ${name}, Please search for another city`;
//         setTimeout(() => {
//           msg.innerText = "";
//         }, 3000);
//         form.reset();
//         return;
//       }
//     }

//     //? Card Structre
//     const createdLi = document.createElement("li");
//     createdLi.classList.add("city");
//     createdLi.innerHTML = `<h2 class="city-name" data-name="${name}, ${
//       sys.country
//     }">
//                                 <span>${name}</span>
//                                 <sup>${sys.country}</sup>
//                             </h2>
//                             <div class="city-temp">${Math.round(
//                               main.temp
//                             )}<sup>°C</sup>
//                             </div>
//                             <figure>
//                                 <img class="city-icon" src="${iconUrl}">
//                                 <figcaption>${
//                                   weather[0].description
//                                 }</figcaption>
//                             </figure>`;
//     //append vs. prepend
//     list.prepend(createdLi);

//     // ! Icon dynamic with Capturing
//     createdLi.addEventListener("click", (e) => {
//       if (e.target.tagName == "IMG") {
//         e.target.src = e.target.src == iconUrl ? iconUrlAWS : iconUrl;
//       }
//     });

//     // //! Card dynamic with Bubling
//     // createdLi.addEventListener("click", (e) => {
//     //   alert(`Li element is clicked!!`);
//     //   window.location.href = "https://clarusway.com/";
//     // });

//     // createdLi.querySelector("figure").addEventListener("click", (e) => {
//     //   alert(`FIGURE element is clicked!!`);
//     //   e.stopPropagation();
//     //   // * STOP BUBLING
//     //   // window.location.href = "https://clarusway.com/";
//     // });

//     // createdLi.querySelector("img").addEventListener("click", (e) => {
//     //   alert(`IMG element is clicked!!`);
//     //   // window.location.href = "https://clarusway.com/";
//     // });

//     form.reset();
//   } catch (error) {
//     msg.innerText = `404 (City Not Found)`;
//     setTimeout(() => {
//       msg.innerText = "";
//     }, 3000);
//     form.reset();
//   }
// };

// // window onload

// // document.querySelector(".cities").addEventListener("click", (e) => {
// //   if (e.target.tagName == "IMG") {
// //     alert("img is clicked!!!");
// //   }
// // });
