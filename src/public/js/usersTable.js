const btn_change_rol = document.querySelectorAll('#btn_change_rol');
const btn_delete = document.querySelectorAll('#btn_delete');

btn_change_rol.forEach(btn=>{
    btn.addEventListener('click', evt=>{
        let user_id = btn.getAttribute('user_id');

        Swal.fire({
            title: 'Cambiando rol del usuario',
            html: 'Aguarde unos momentos...',
            didOpen: () => {
                Swal.showLoading()
    
                fetch(`http://localhost:8080/api/users/premium/${user_id}`)
                    .then(res=>res.json())
                    .then(data=>{
                        console.log(data);
            
                        if(data.status === 'success'){
                            Swal.fire({
                                title:data.message,
                                icon: "success",
                                timer: 2000,
                                showConfirmButton: false
                            }).then(()=>{
                                location.reload();
                            })
                        }else if(data.status === 'error') {
                            Swal.fire({
                                text: data.message,
                                icon: 'error'
                            });
                        }
                    })
            }
        })
    })
})

btn_delete.forEach(btn=>{
    btn.addEventListener('click', evt=>{
        let user_id = btn.getAttribute('user_id');

        Swal.fire({
            title: 'Eliminando usuario',
            html: 'Aguarde unos momentos...',
            didOpen: () => {
                Swal.showLoading()
    
                fetch(`http://localhost:8080/api/users/${user_id}`, {
                    method: 'DELETE'
                })
                    .then(res=>res.json())
                    .then(data=>{
                        console.log(data);
            
                        if(data.status === 'success'){
                            Swal.fire({
                                title:data.message,
                                icon: "success",
                                timer: 2000,
                                showConfirmButton: false
                            }).then(()=>{
                                location.reload();
                            })
                        }else if(data.status === 'error') {
                            Swal.fire({
                                text: data.message,
                                icon: 'error'
                            });
                        }
                    })
            }
        })
    })
})