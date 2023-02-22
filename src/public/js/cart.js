const btnDelete = document.querySelectorAll('#deleteProduct');

const cart_id = document.getElementById('cart_id');

btnDelete.forEach(btn=>{
    btn.addEventListener('click', evt=>{
        evt.stopPropagation();
        const product_id = btn.value;
        fetch(`/api/carts/${cart_id.value}/product/${product_id}`, {method: 'DELETE'})
            .then(res=>res.json())
            .then(data=>{
                console.log(data);
                if(data.status === 'success'){
                    Swal.fire({
                        text: `Producto eliminado del carrito.`,
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(()=>{
                        location.reload();
                    })
                }
            })
    })
})
