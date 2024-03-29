const btnContainer = document.getElementById("btn-container");
const errorMsg = document.getElementById("error-msg");
const sortBtn = document.getElementById("sort-btn");
let selectedCategory = 1000;
let sortByBtn = false;

sortBtn.addEventListener("click", () => {
  sortByBtn = true;
  fetchDataByCategory(selectedCategory, sortByBtn);
});

const fetchCategory = () => {
  fetch(" https://openapi.programming-hero.com/api/videos/categories")
    .then((res) => res.json())
    .then(({ data }) =>
      data.forEach((element) => {
        const newBtn = document.createElement("button");
        newBtn.className = "btn category-btn text-white bg-gray-400";
        newBtn.innerText = element.category;
        newBtn.addEventListener("click", () => {
          fetchDataByCategory(element.category_id);
          const allBtns = document.querySelectorAll(".category-btn");
          for (const btn of allBtns) {
            btn.classList.remove("bg-red-600");
          }
          newBtn.classList.add("bg-red-600");
        });
        btnContainer.appendChild(newBtn);
      })
    );
};

const fetchDataByCategory = (categoryId, sortByBtn) => {
  selectedCategory = categoryId;
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";

  fetch(
    `https://openapi.programming-hero.com/api/videos/category/${categoryId}`
  )
    .then((res) => res.json())
    .then(({ data }) => {
      // sort Data by view
      if (sortByBtn) {
        data.sort((a, b) => {
          const totalViewFirst = a.others?.views;
          const totalViewSecond = b.others?.views;

          // convert k
          const totalViewFirstNumber =
            parseFloat(totalViewFirst.replace("K", "")) || 0;
          const totalViewSecondNumber =
            parseFloat(totalViewSecond.replace("K", "")) || 0;

          return totalViewSecondNumber - totalViewFirstNumber;
        });
      }

      if (data.length === 0) {
        errorMsg.classList.remove("hidden");
      } else {
        errorMsg.classList.add("hidden");
      }
      data.forEach((element) => {
        let verifiedBadge = "";
        if (element.authors[0].verified) {
          verifiedBadge = `<img id="verified-tag" class="h-5 w-5" src="../image/verified.png" alt ="" />`;
        }
        const div = document.createElement("div");
        div.innerHTML = `
        <div class="card bg-base-100 shadow-xl p-8">
          <figure>
            <img class="h-60"
              src="${element.thumbnail}"
              alt="Shoes"
            />
            <h6 class="absolute bottom-[40%] right-12 bg-black rounded-xl text-white p-2">0 hr</h6>
          </figure>
          <div class="flex justify-start items-start gap-4 mt-4">
            <div class="rounded-full">
              <img
                class="rounded-full w-12 h-12"
                src="${element.authors[0].profile_picture}"
                alt=""
              />
            </div>
            <div class="">
              <h2 class="text-xl font-bold">${element.title}</h2>
              <div class="flex gap-1">
              <p class="">${element.authors[0].profile_name}</p>
              ${verifiedBadge}
              </div>
              <p>${element.others.views}</p>
            </div>
          </div>
        </div>
        `;
        cardContainer.appendChild(div);
      });
    });
};

fetchCategory();
fetchDataByCategory(selectedCategory, sortByBtn);
