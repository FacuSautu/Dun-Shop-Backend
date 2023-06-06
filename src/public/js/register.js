const register_form = document.getElementById('register_form');

register_form.addEventListener('submit', evt=>{
    evt.preventDefault();

    Swal.fire({
        title: 'Registrando sus datos',
        html: 'Aguarde unos momentos...',
        didOpen: () => {
          Swal.showLoading()

          const data = new URLSearchParams();
          for (const pair of new FormData(evt.target)) {
              data.append(pair[0], pair[1]);
          }
      
          fetch('/api/sessions/register', {
              method: 'POST',
              body: data
          })
              .then(res=>res.json())
              .then(data=>{
                  console.log(data);
                  if(data.status === 'error'){
                      location.href = `/register?validation=${data.message.valCode}`;
                  }else{
                      location.href = '/login?register=1';
                  }
              })
        }
    })
})