import { API_BASE_URL, endpoints } from "./constants.js";
import { getAllData } from "./helpers.js";

const cardsContainer = document.querySelector("#cardsContainer");
const loader = document.querySelector("#loader");
const searchInp = document.querySelector("#search");
const sortSelect = document.querySelector("#sortSelect");
const filterSelect = document.querySelector("#filterSelect");
let cards = [];

// Load cards on DOM content load
document.addEventListener("DOMContentLoaded", async () => {
    loader.classList.remove("d-none");
    try {
        // Load cards from local storage
        const response = await getAllData(API_BASE_URL,endpoints.catalog)
        // cards = JSON.parse(localStorage.getItem('cards')) || []; // Fetching from local storage
        loader.classList.add("d-none");
        renderCardsHTML(response);
    } catch (error) {
        console.error('Error fetching data:', error);
        loader.classList.add("d-none");
    }
});

sortSelect.addEventListener("change", () => {
    sortCards();
});
filterSelect.addEventListener("change", () => {
    filterCards();
});
searchInp.addEventListener("input", () => {
    searchCards();
});

function sortCards() {
    const sortValue = sortSelect.value;
    if (sortValue === "price-asc") {
        cards.sort((a, b) => a.price - b.price);
    } else if (sortValue === "price-desc") {
        cards.sort((a, b) => b.price - a.price);
    } else if (sortValue === "name-asc") {
        cards.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortValue === "name-desc") {
        cards.sort((a, b) => b.name.localeCompare(a.name));
    }
    renderCardsHTML(cards);
}

function filterCards() {
    const filterValue = filterSelect.value;
    const filteredCards = filterValue === "all" ? cards : cards.filter(card => card.name.toLowerCase().includes(filterValue));
    renderCardsHTML(filteredCards);
}


function searchCards() {
    const searchTerm = searchInp.value.toLowerCase();
    const searchedCards = cards.filter(card => card.name.toLowerCase().includes(searchTerm));
    renderCardsHTML(searchedCards);
}

// Delete card functionality
function deleteCard(id) {
    cards = cards.filter(c => c.id !== id);
    localStorage.setItem('cards', JSON.stringify(cards)); // Update local storage
    filterAndSortCards(); // Re-render cards after deletion
}

// Edit card functionality
function editCard(id) {
    document.location.href = `edit.html?id=${id}`; // Redirecting to edit page
}

// Show details of the card
function showDetails(id) {
    const card = cards.find(c => c.id === id);
    alert(`Name: ${card.name}\nPrice: $${card.price}\nRating: ${card.rating}\nDescription: ${card.description}`);
}

// Add to wishlist functionality
function addToWishlist(id) {
    const card = cards.find(c => c.id === id);
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (!wishlist.some(item => item.id === card.id)) {
        wishlist.push(card);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        alert(`${card.name} has been added to your wishlist!`);
    } else {
        alert(`${card.name} is already in your wishlist.`);
    }
}

// Render cards HTML
function renderCardsHTML(arr) {
    cardsContainer.innerHTML = ""; // Clear existing content

    arr.forEach((card) => {
        const cardElement = document.createElement("div");
        cardElement.className = "col-md-4 mb-4"; // Custom class for styling
        cardElement.innerHTML = `
            <div style="
                background-color: #E6F0DC; 
                border: 1px solid green; 
                border-radius: 8px; 
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); 
                margin: 10px; 
                padding: 20px; 
                transition: box-shadow 0.3s ease;
                height: 100%;">
                
                <h3 style="height: 60px; overflow: hidden;">Name: ${card.name}</h3>
                <p style="margin: 0; height: 40px;">Price: $${card.price.toFixed(2)}</p>
                <p style="margin: 0; height: 30px;">Rating: ${card.rating}</p>
                <p style="margin: 0; height: 30px;">Description: ${card.description}</p>
                <img style="
                    width: 100%; 
                    height: 200px; 
                    object-fit: cover;" 
                    src="${card.photo}" alt="${card.name}" class="card-img-top">
               <button class="details-btn" style="background-color: pink; color: black; border: none; padding: 5px 20px; ; border-radius: 5px; cursor: pointer; transition: background-color 0.3s;">Details</button>
               <button class="edit-btn" style="background-color: lightblue; color: black; border: none; padding: 5px 20px; border-radius: 5px; cursor: pointer; transition: background-color 0.3s;">Edit</button>
               <button class="delete-btn" style="background-color: yellow; color: black; border: none; padding: 5px 20px; border-radius: 5px; cursor: pointer; transition: background-color 0.3s;">Delete</button>
               <i class="fa fa-heart wishlist-icon" style="font-size: 24px; color: red; cursor: pointer; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'"></i>

            </div>
        `;
        
        cardsContainer.appendChild(cardElement);
        
        // Add event listeners
        cardElement.querySelector('.details-btn').addEventListener('click', () => showDetails(card.id));
        cardElement.querySelector('.edit-btn').addEventListener('click', () => editCard(card.id));
        cardElement.querySelector('.delete-btn').addEventListener('click', () => deleteCard(card.id));
        cardElement.querySelector('.wishlist-icon').addEventListener('click', () => addToWishlist(card.id));
    });
}
