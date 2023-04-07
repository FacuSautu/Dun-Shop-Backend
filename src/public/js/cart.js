const btnDelete = document.querySelectorAll('#deleteProduct');
const btnEndCompra = document.getElementById('finalizar_compra');

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

btnEndCompra.addEventListener('click', evt=>{
    fetch(`/api/carts/${cart_id.value}/purchase`)
        .then(res=>res.json())
        .then(data=>{
            if(data.status == 'success'){
                let html = `Compra finalizada! Su numero de ticket es: ${data.payload.ticket}.`;
                if(data.payload.products_out_of_stock.length > 0){
                    html += `<br>Los siguientes articulos no se compraron por falta de stock<br><ul>`;
                    data.payload.products_out_of_stock.forEach(prod=>{
                        html += `<li>${prod.title} - cant: ${prod.quantity} - stock: ${prod.stock}</li>`;
                    })
                    html += `</ul>`;
                }

                Swal.fire({
                    html,
                    icon: 'success',
                }).then(()=>{
                    location.reload();
                })
            }
        })
})