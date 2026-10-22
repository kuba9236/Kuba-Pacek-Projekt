const products = [
    {
        id: 1,
        name: "Zamek Hogwart™ i błonia",
        category: "Harry Potter",
        price: 729.99 ,
        image: "hpdwa.png"
    },

    {
        id: 2,
        name: "Dom Luny Lovegood",
        category: "Harry Potter",
        price: 419.99,
        image: "hpcztery.png"
    },

    {
        id: 3,
        name: "Wolny skrzat Zgredek",
        category: "Harry Potter",
        price: 249,
        image: "hptrzy.png"
    },

    {
        id: 4,
        name: "Nora edycja kolekcjonerska",
        category: "Harry Potter",
        price: 1129.99,
        image: "hpjeden.png"
    },

    {
        id: 5,
        name: "Zamek Hogwart™ Ceremonia przydziału",
        category: "Harry Potter",
        price: 61.99,
        image: "hppiec.png"
    },

    {
        id: 6,
        name: "Bukiet różowych róż",
        category: "Botanicals",
        price: 249.99,
        image: "kwiatyjeden.png"
    },

    {
        id: 7,
        name: "Wiszące epipremnum złociste",
        category: "Botanicals",
        price: 249.99,
        image: "kwiatydwa.png"
    },

    {
        id: 8,
        name: "Mała orchidea",
        category: "Botanicals",
        price: 124.99,
        image: "kwiatytrzy.png"
    },

     {
        id: 9,
        name: "Małe drzewka bonsai",
        category: "Botanicals",
        price: 249.99,
        image: "kwiatycztery.png"
    },

    {
        id: 10,
        name: "Grzyby leśne",
        category: "Botanicals",
        price: 239.99,
        image: "kwiatypiec.png"
    },

     {
        id: 11,
        name: "Panorama uniwersum Marvela",
        category: "MARVEL",
        price: 429.99,
        image: "marveljeden.png"
    },

    {
        id: 12,
        name: "Avengers: Doomsday Nowa Wieża Avengersów",
        category: "MARVEL",
        price: 469.99,
        image: "marveldwa.png"
    },

    {
        id: 13,
        name: "X-Men: Instytut Xaviera",
        category: "MARVEL",
        price: 1399.99,
        image: "marveltzy.png"
    },

    {
        id: 14,
        name: "Logo MARVEL z minifigurkami",
        category: "MARVEL",
        price: 439.99,
        image: "marvelpiec.png"
    },

    
    

];


let cart = JSON.parse(localStorage.getItem("cart")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let currentCategory = "Wszystkie";


const productsContainer =
    document.getElementById("productsContainer");

const favoritesContainer =
    document.getElementById("favoritesContainer");

const cartItems =
    document.getElementById("cartItems");

const cartCount =
    document.getElementById("cartCount");

const cartTotal =
    document.getElementById("cartTotal");


function displayProducts(productsToDisplay) {

    productsContainer.innerHTML = "";

    productsToDisplay.forEach(product => {

        const isFavorite =
            favorites.includes(product.id);

        productsContainer.innerHTML += `

            <div class="product-card">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <div class="product-info">

                    <span class="product-category">
                        ${product.category}
                    </span>

                    <h3>${product.name}</h3>

                    <p class="price">
                        ${product.price} zł
                    </p>

                    <div class="product-buttons">

                        <button
                            class="add-cart"
                            onclick="addToCart(${product.id})"
                        >
                            Dodaj do koszyka
                        </button>

                        <button
                            class="favorite-btn"
                            onclick="toggleFavorite(${product.id})"
                        >
                            ${isFavorite ? "❤️" : "🤍"}
                        </button>

                    </div>

                </div>

            </div>
        `;
    });
}


function addToCart(id) {

    const product =
        products.find(product => product.id === id);

    const existingProduct =
        cart.find(item => item.id === id);


    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    saveCart();

    displayCart();
}


function removeFromCart(id) {

    cart =
        cart.filter(item => item.id !== id);

    saveCart();

    displayCart();
}


function displayCart() {

    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;


    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p>Twój koszyk jest pusty.</p>";

    }


    cart.forEach(item => {

        total +=
            item.price * item.quantity;

        count += item.quantity;


        cartItems.innerHTML += `

            <div class="cart-item">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >

                <div class="cart-info">

                    <h4>${item.name}</h4>

                    <p>
                        ${item.quantity} ×
                        ${item.price} zł
                    </p>

                </div>

                <button
                    class="remove-item"
                    onclick="removeFromCart(${item.id})"
                >
                    Usuń
                </button>

            </div>
        `;
    });


    cartCount.textContent = count;

    cartTotal.textContent =
        total + " zł";
}


function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
}


function toggleFavorite(id) {

    const user =
        localStorage.getItem("currentUser");


    if (!user) {

        alert(
            "Musisz być zalogowany, aby dodawać zestawy do ulubionych."
        );

        openAccount();

        return;
    }


    if (favorites.includes(id)) {

        favorites =
            favorites.filter(
                favoriteId =>
                    favoriteId !== id
            );

    } else {

        favorites.push(id);

    }


    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );


    displayProducts(
        getFilteredProducts()
    );

    displayFavorites();
}


function displayFavorites() {

    favoritesContainer.innerHTML = "";


    const favoriteProducts =
        products.filter(
            product =>
                favorites.includes(product.id)
        );


    if (
        favoriteProducts.length === 0
    ) {

        favoritesContainer.innerHTML =
            "<p>Nie masz jeszcze ulubionych zestawów.</p>";

        return;
    }


    favoriteProducts.forEach(product => {

        favoritesContainer.innerHTML += `

            <div class="product-card">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <div class="product-info">

                    <span class="product-category">
                        ${product.category}
                    </span>

                    <h3>${product.name}</h3>

                    <p class="price">
                        ${product.price} zł
                    </p>

                    <div class="product-buttons">

                        <button
                            class="add-cart"
                            onclick="addToCart(${product.id})"
                        >
                            Dodaj do koszyka
                        </button>

                        <button
                            class="favorite-btn"
                            onclick="toggleFavorite(${product.id})"
                        >
                            ❤️
                        </button>

                    </div>

                </div>

            </div>
        `;
    });
}


/* KATEGORIE */

document
    .querySelectorAll(".category")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".category")
                    .forEach(btn =>
                        btn.classList.remove("active")
                    );


                button.classList.add(
                    "active"
                );


                currentCategory =
                    button.dataset.category;


                displayProducts(
                    getFilteredProducts()
                );

            }
        );

    });


function getFilteredProducts() {

    const searchText =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase();


    return products.filter(product => {

        const categoryMatch =
            currentCategory === "Wszystkie" ||
            product.category === currentCategory;


        const searchMatch =
            product.name
                .toLowerCase()
                .includes(searchText);


        return (
            categoryMatch &&
            searchMatch
        );

    });
}


/* WYSZUKIWANIE */

document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        () => {

            displayProducts(
                getFilteredProducts()
            );

        }
    );


/* PANELE */

const cartPanel =
    document.getElementById("cart");

const accountPanel =
    document.getElementById("accountPanel");

const overlay =
    document.getElementById("overlay");


document
    .getElementById("cartBtn")
    .addEventListener(
        "click",
        () => {

            cartPanel.classList.add("open");

            overlay.classList.add("show");

        }
    );


document
    .getElementById("closeCart")
    .addEventListener(
        "click",
        closePanels
    );


document
    .getElementById("accountBtn")
    .addEventListener(
        "click",
        openAccount
    );


document
    .getElementById("closeAccount")
    .addEventListener(
        "click",
        closePanels
    );


overlay.addEventListener(
    "click",
    closePanels
);


function closePanels() {

    cartPanel.classList.remove("open");

    accountPanel.classList.remove("open");

    overlay.classList.remove("show");
}


function openAccount() {

    accountPanel.classList.add("open");

    overlay.classList.add("show");

    updateAccountPanel();
}


/* REJESTRACJA */

document
    .getElementById("showRegister")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById("loginForm")
                .classList.add("hidden");

            document
                .getElementById("registerForm")
                .classList.remove("hidden");

        }
    );


document
    .getElementById("showLogin")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById("registerForm")
                .classList.add("hidden");

            document
                .getElementById("loginForm")
                .classList.remove("hidden");

        }
    );


document
    .getElementById("registerBtn")
    .addEventListener(
        "click",
        () => {

            const username =
                document
                    .getElementById("registerUsername")
                    .value;

            const password =
                document
                    .getElementById("registerPassword")
                    .value;


            if (!username || !password) {

                alert(
                    "Wypełnij wszystkie pola."
                );

                return;
            }


            const users =
                JSON.parse(
                    localStorage.getItem("users")
                ) || [];


            users.push({
                username,
                password
            });


            localStorage.setItem(
                "users",
                JSON.stringify(users)
            );


            alert(
                "Konto zostało utworzone!"
            );


            document
                .getElementById("registerForm")
                .classList.add("hidden");

            document
                .getElementById("loginForm")
                .classList.remove("hidden");

        }
    );


/* LOGOWANIE */

document
    .getElementById("loginBtn")
    .addEventListener(
        "click",
        () => {

            const username =
                document
                    .getElementById("loginUsername")
                    .value;

            const password =
                document
                    .getElementById("loginPassword")
                    .value;


            const users =
                JSON.parse(
                    localStorage.getItem("users")
                ) || [];


            const user =
                users.find(
                    user =>
                        user.username === username &&
                        user.password === password
                );


            if (!user) {

                alert(
                    "Nieprawidłowy login lub hasło."
                );

                return;
            }


            localStorage.setItem(
                "currentUser",
                username
            );


            updateAccountPanel();
        }
    );


/* WYLOGOWANIE */

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "currentUser"
            );

            updateAccountPanel();
        }
    );


function updateAccountPanel() {

    const user =
        localStorage.getItem("currentUser");


    const loginForm =
        document.getElementById("loginForm");

    const registerForm =
        document.getElementById("registerForm");

    const userPanel =
        document.getElementById("userPanel");


    if (user) {

        loginForm.classList.add(
            "hidden"
        );

        registerForm.classList.add(
            "hidden"
        );

        userPanel.classList.remove(
            "hidden"
        );


        document
            .getElementById("currentUser")
            .textContent = user;

    } else {

        loginForm.classList.remove(
            "hidden"
        );

        registerForm.classList.add(
            "hidden"
        );

        userPanel.classList.add(
            "hidden"
        );
    }
}


/* START */

displayProducts(products);

displayCart();

displayFavorites();

updateAccountPanel();