let loggedUser = {}
const titulo = document.getElementById('userBlog')
const postContainer = document.getElementById('postUsuarios')
const postCard = document.getElementById('cardPost').content
const respondContainer = document.getElementById('respondUsuarios')
const respondCard = document.getElementById('cardResponse').content
const responseContainer = document.getElementById('userToRespond')
const responseCard = document.getElementById('userToRespondCard').content
const fragment = document.createDocumentFragment()

respondBtn = document.getElementById('btnAddResponse')

document.addEventListener('DOMContentLoaded', () => {
    loadUser()
    loadPost()

    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('newRespond')) {
            const modal = document.getElementById('newRespondModal');
            // ID Post
            const idPostToRespond = event.target.getAttribute('data-post-id');
            const idPostInput = modal.querySelector('#newRespondPostId'); // Campo oculto en el formulario modal
            // Actualizar el valor del campo oculto con el ID del Post seleccionado
            idPostInput.value = idPostToRespond;
            loadRespondPost(idPostInput)
        }
    });

    const searchForm = document.getElementById('AddRespondForm');
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Previene la recarga de la página por defecto al enviar el formulario
        newRespond();
    });

    $('#newRespondModal').on('hidden.bs.modal', function () {
        document.getElementById('AddRespondForm').reset();
    });

})

const loadPost = async () => {
    const posts = await fetch('./Backend/Files/loadPost.php')
    const items = await posts.json()
    dibujaPosts(items.MESSAGE)
    console.log('posts => ', items)
}

const dibujaPosts = async posts => {
    const postElements = await Promise.all(posts.map(async (item) => {
        const clone = postCard.cloneNode(true); // Clonar el postCard original

        clone.querySelector('.card-title').textContent = item.idUsuario;
        clone.querySelector('.card-subtitle').textContent = item.titulo + '     ' + item.fecha;
        clone.querySelector('.card-text').textContent = item.mensaje;
        clone.querySelectorAll('a')[0].setAttribute('data-post-id', item.idPost);

        const responses = await dibujaResponses(item.idPost);
        clone.querySelector('ul').innerHTML = responses;

        return clone;
    }));

    postElements.forEach(element => {
        fragment.appendChild(element);
    });

    postContainer.appendChild(fragment);
};


const dibujaResponses = async (idPost) => {
    const sendData = {
        idPost: idPost
    };
    const response = await fetch('./Backend/Files/loadResponses.php', {
        method: 'POST',
        body: JSON.stringify(sendData),
        headers: { 'Content-Type': 'application/json' }
    });
    const res = await response.json();
    let responsesHTML = '';

    if (res.STATUS === 'SUCCESS') {
        res.MESSAGE.forEach((item) => {
            responsesHTML += `
            <li>
                <div class="card" style="width: 100%;">
                    <div class="card-body">
                        <h6 class="card-subtitle mb-2 text-muted">${item.usuario_email}</h6>
                        <p class="card-text">${item.message}</p>
                    </div>
            </li>`;
        });
    } else {
        responsesHTML = '<li>No hay respuestas para mostrar</li>';
    }

    return responsesHTML;
};



const loadUser = () => {
    const url = window.location.search
    const params = new URLSearchParams(url)
    const usuario = params.get('email')

    if (usuario) {
        const sendData = {
            usuario
        }
        fetch('./Backend/Files/home.php', {
            method: 'POST',
            body: JSON.stringify(sendData),
            headers: { 'Content-Type': 'application/json ' }
        })
            .then(async (response) => {
                const user = await response.json()
                loggedUser = user.MESSAGE
                const inputIdUser = document.getElementById('idUsuario')
                inputIdUser.value = loggedUser.email
                titulo.innerHTML = loggedUser.nombre
                console.log('response => ', loggedUser)
            })
    }
}

const loadRespondPost = (idPostInput) => {
    const sendData = {
        idpost: idPostInput.value,
    };
    fetch('./Backend/Files/getResponses.php', {
        method: 'POST',
        body: JSON.stringify(sendData),
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(async (response) => {
        const items = await response.json()
        dibujaPost(items.MESSAGE)
        console.log('post to respond => ', items)
    }).catch(error => console.error('Error de Fetch:', error));
}

const dibujaPost = post => {
    responseContainer.innerHTML = '';
    post.forEach((item) => {
        responseCard.querySelector('.card-title').textContent = item.idUsuario
        responseCard.querySelector('.card-subtitle').textContent = item.titulo + '     ' + item.fecha
        responseCard.querySelector('.card-text').textContent = item.mensaje

        const clone = responseCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    responseContainer.appendChild(fragment)
}

const newRespond = () => {
    const url = window.location.search
    const params = new URLSearchParams(url)
    const idUsuario = params.get('email');
    const idPost = document.getElementById('newRespondPostId');
    const message = document.getElementById('addResponse');

    const sendData = {
        idPost: idPost.value,
        idUsuario: idUsuario,
        message: message.value
    };

    console.log(sendData)

    fetch('./Backend/Files/newRespond.php', {
        method: 'POST',
        body: JSON.stringify(sendData),
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(async (response) => {
        const res = await response.json()
        if (res.STATUS == 'SUCCESS') {
            console.log('Respuesta correcta', res)
            window.location.replace(`/home.html?email=${idUsuario}`)
        } else {
            console.log('Respuesta incorrecta')
        }
    }).catch(error => {
        console.error('Error en el fetch:', error);
    });
}
