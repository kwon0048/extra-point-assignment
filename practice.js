// 1. Save the shopping cart data in the local storage.
    // localStorage.setItem('cart',JSON.stringify(cart))

// 2. Display the Cart with Values Saved in Local Storage

const loadCartFromLocalStorage = JSON.parse(localStorage.getItem('cart'))

console.log(loadCartFromLocalStorage)
if(loadCartFromLocalStorage){
    cart = loadCartFromLocalStorage
    displayCart()
}


// 3. Remove products from the shopping cart and update the local storage accordingly

const $cartSection = document.getElementById('cart')
$cartSection.addEventListener('click',function(e){

    if(e.target.classList.contains('delete-button')){

        const indexToRemove = e.target.dataset.index
        cart.splice(indexToRemove, 1)
        displayCart()
        localStorage.setItem('cart', JSON.stringify(cart))
    }

})
