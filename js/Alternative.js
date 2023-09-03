// Log a message to indicate that the JavaScript file is loaded
console.log("JavaScript file is loaded.");

// Wait for the DOM to be fully loaded before executing the JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Define the API URLs
  const categoriesAPI =
    "https://openapi.programming-hero.com/api/videos/categories";
  const baseAPIURL =
    "https://openapi.programming-hero.com/api/videos/category/";

  // Function to fetch data from an API
  async function fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not successful");
      }
      return await response.json();
    } catch (error) {
      console.error("Error occurred while fetching data:", error);
    }
  }

  // Function to create a dynamic API link for a category
  function createCategoryLink(categoryId) {
    return `${baseAPIURL}${categoryId}`;
  }

  // Function to create a card for a media item
  function createMediaCard(mediaData) {
    const mediaContainer = document.getElementById("media-container");
    const card = document.createElement("div");
    card.classList.add(
      "card",
      "w-96",
      "bg-transparent",
      "text-black",
      "shadow-xl"
    );

    // Create HTML for all authors
    const authorsHTML = mediaData.authors
      .map(
        (author) => `
        <div class="flex items-center p-4">
          <img class="rounded-full w-12 h-12 mr-4" src="${author.profile_picture}" alt="${author.profile_name}'s profile picture">
          <div>
            <h2 class="font-bold">${mediaData.title}</h2>
            <p>${author.profile_name}</p>
            <p>Views: ${mediaData.others.views}</p>
          </div>
        </div>
      `
      )
      .join("");

    card.innerHTML = `
      <figure><img src="${mediaData.thumbnail}" alt="${mediaData.title}'s thumbnail" class="h-48 object-cover w-full" /></figure>
      <div class="">
        ${authorsHTML}
      </div>
    `;

    mediaContainer.appendChild(card);
  }

  // Function to fetch and display media data for a category
  function fetchAndDisplayMediaData(categoryId) {
    const categoryLinkId = createCategoryLink(categoryId);
    fetchData(categoryLinkId).then((mediaData) => {
      // Clear previous media cards
      const mediaContainer = document.getElementById("media-container");
      mediaContainer.innerHTML = "";

      // Create media cards for each item in the response
      mediaData.data.forEach((mediaItem) => {
        createMediaCard(mediaItem);
      });
    });
  }

  // Function to handle sorting when "Sort by view" button is clicked
  let sortByViews = false;
  function handleSortByViews() {
    sortByViews = !sortByViews;

    const mediaContainer = document.getElementById("media-container");
    const mediaCards = Array.from(mediaContainer.children);

    if (sortByViews) {
      // Sort by views in descending order
      mediaCards.sort((a, b) => {
        const viewsAElement = a.querySelector(".card p:last-child");
        const viewsBElement = b.querySelector(".card p:last-child");

        if (viewsAElement && viewsBElement) {
          const viewsA = parseInt(viewsAElement.textContent.match(/\d+/)[0]);
          const viewsB = parseInt(viewsBElement.textContent.match(/\d+/)[0]);
          return viewsB - viewsA;
        } else {
          return 0;
        }
      });

      // Change the color of the "Sort by view" button to #FF1F3D when sorted
      const sortByViewButton = document.querySelector(".btn-sort-by-view");
      sortByViewButton.classList.add("bg-[#FF1F3D]", "text-white");
    } else {
      // Revert the color of the "Sort by view" button when unsorted
      const sortByViewButton = document.querySelector(".btn-sort-by-view");
      sortByViewButton.classList.remove("bg-[#FF1F3D]", "text-white");

      // Reverse the order of media cards to unsort
      mediaCards.reverse();
    }

    // Re-append the cards to the container
    mediaCards.forEach((card) => {
      mediaContainer.appendChild(card);
    });
  }

  // Function to handle category button clicks
  function handleCategoryButtonClick(event) {
    // Remove the 'bg-[#FF1F3D]' class from all category buttons
    const categoryButtons = document.querySelectorAll(".btn-category");
    categoryButtons.forEach((button) => {
      button.classList.remove("bg-[#FF1F3D]", "text-white");
    });

    // Add the 'bg-[#FF1F3D]' class to the clicked category button
    event.target.classList.add("bg-[#FF1F3D]", "text-white");

    // Fetch and display media data for the selected category
    const categoryId = event.target.dataset.categoryId;
    fetchAndDisplayMediaData(categoryId);
  }

  // Fetch categories data and create category buttons
  fetchData(categoriesAPI).then((data) => {
    const categoryButtonsContainer = document.getElementById("categorie-btn");

    // Iterate through the categories data and create category buttons
    data.data.forEach((category) => {
      const categoryButton = document.createElement("button");
      categoryButton.classList.add(
        "btn",
        "btn-category",
        "transition-colors",
        "duration-300"
      );
      categoryButton.textContent = category.category;
      categoryButton.dataset.categoryId = category.category_id; // Store category ID

      // Add event listener to handle category button clicks
      categoryButton.addEventListener("click", handleCategoryButtonClick);

      categoryButtonsContainer.appendChild(categoryButton);
    });

    // Fetch and display unsorted media data for the "All" category on page load
    fetchAndDisplayMediaData("1000");

    // Set the "All" category button as active by default
    const allCategoryButton = document.querySelector(
      '[data-category-id="1000"]'
    );
    allCategoryButton.classList.add("bg-[#FF1F3D]", "text-white");
  });

  // Add event listener to "Sort by view" button
  const sortByViewButton = document.querySelector(".btn-sort-by-view");
  if (sortByViewButton) {
    sortByViewButton.addEventListener("click", handleSortByViews);
  }
});
