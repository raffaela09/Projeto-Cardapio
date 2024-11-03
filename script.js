const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-bnt")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addresInput = document.getElementById("addres")
const addresWarn = document.getElementById("addres-warn")



let cart = [];
// abrir o modal do carrinho
cartBtn.addEventListener("click", function() {
  cartModal.style.display = "flex"
  updateCartModal()
})

//fechar o modal
cartModal.addEventListener("click", function(event){
  if(event.target === cartModal){
    cartModal.style.display = "none"
  }
})

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

menu.addEventListener("click", function(event){


 let parentButton = event.target.closest(".add-to-cart-btn")
  if (parentButton) {
    const name = parentButton.getAttribute("data-name")
    const price = parseFloat(parentButton.getAttribute("data-price"))

    AddToCart(name, price)
  
  }
})

// function to add to cart
function AddToCart(name, price) {
  const existingItem = cart.find(item => item.name === name)

  if (existingItem) {
    // se ja existe, aumenta a quantidade
    existingItem.quantity+=1;
    return;
  }
  else{
    cart.push({
      name,
      price,
      quantity: 1,
     })
  }
  Toastify({
    text: "Um item foi adicionado ao carrinho",
    duration: 2000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "green",
    },
  }).showToast();

 updateCartModal()

}

// att the cart

function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;


  cart.forEach(item => {
     const cartItemsElement = document.createElement("div");
     cartItemsElement.classList.add("flex", "justify-between", "mb-4","flex-col")
     cartItemsElement.innerHTML = `
     <div class = "flex items-center justify-between">
        <div>
        <p class = "font-medium">${item.name}</p>
        <p>Quantidade: ${item.quantity}</p>
        <p class = "font-medium">R$${item.price.toFixed(2)}</p>
        </div>

       <div>
        <button class="remove-from-cart-btn"  data-name="${item.name}">Remover</button>
        </div>
  
     </div>
     `

     total+= item.price * item.quantity;
     cartItemsContainer.appendChild(cartItemsElement)
  })
  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  cartCounter.innerHTML = cart.length;


}


// function to remove item

cartItemsContainer.addEventListener("click", function(event){
  if(event.target.classList.contains("remove-from-cart-btn")){
    const name = event.target.getAttribute("data-name")
    removeItemCart(name);
  }
})

function removeItemCart(name) {
  const index = cart.findIndex(item => item.name === name);
  if(index !== -1){
    const item = cart[index];
    if(item.quantity > 1){
      item.quantity -=1;
      updateCartModal();
      return;
    }

    cart.splice(index, 1);
    updateCartModal();
    

  }

}

addresInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;
  
  if (inputValue!== "") {
    addresInput.classList.remove("border-red-500")
    addresWarn.classList.add("hidden")
    
  }
})

checkoutBtn.addEventListener("click",function () {

  const isOpen = checkRestauranteOpen();
  if (!isOpen) {
    alert("Restaurante fechado no momento!")
  }
  if (cart.length === 0) return;

  if(addresInput.value === ""){
    addresWarn.classList.remove("hidden")
    addresInput.classList.add("border-red-500")
    return;
  }

  const cartItems = cart.map((item)=>{
    return (
     ` ${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price} `
    )
  }).join("")

  const message = encodeURIComponent(cartItems)
  const phone = "+5567996236636"
  
  window.open(`http://wa.me/${phone}?text=${message} Endereço: ${addresInput.value}`, "_blank")

  cart = [];
  updateCartModal(); 
  
})


function checkRestauranteOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18 && hora <22;
}


const spanItem = document.getElementById("data-span")
const isOpen = checkRestauranteOpen();


if(isOpen){
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600")
}else{
  spanItem.classList.remove("bg-green-600")
  spanItem.classList.add("bg-red-500")
}