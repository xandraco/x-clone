// Declaración de variables globales
let loggedUser = {};
const titulo = document.getElementById('userBlog');
const postContainer = document.getElementById('postUsuarios');
const postCard = document.getElementById('cardPost').content;
const respondContainer = document.getElementById('respondUsuarios');
const respondCard = document.getElementById('cardResponse').content;
const responseContainer = document.getElementById('userToRespond');
const responseCard = document.getElementById('userToRespondCard').content;
const fragment = document.createDocumentFragment();
let respondBtn = document.getElementById('btnAddResponse');

// Evento que se dispara al cargar el contenido del documento
document.addEventListener('DOMContentLoaded', () => {
    // Carga el usuario y las publicaciones al cargar la página
    loadUser();
    loadPost();

    // Escucha el clic en cualquier lugar del documento
    document.addEventListener('click', function (event) {
        // Maneja clics en elementos con clase 'newRespond'
        if (event.target.classList.contains('newRespond')) {
            // Obtiene el ID del post al que se responde
            const modal = document.getElementById('newRespondModal');
            const idPostToRespond = event.target.getAttribute('data-post-id');
            const idPostInput = modal.querySelector('#newRespondPostId'); // Campo oculto en el formulario modal
            // Actualiza el valor del campo oculto con el ID del Post seleccionado
            idPostInput.value = idPostToRespond;
            loadRespondPost(idPostInput);
        }
    });

    // Maneja el envío del formulario de respuesta
    const searchForm = document.getElementById('AddRespondForm');
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Previene la recarga de la página por defecto al enviar el formulario
        newRespond();
    });

    // Maneja el evento cuando el modal de respuesta se oculta
    $('#newRespondModal').on('hidden.bs.modal', function () {
        document.getElementById('AddRespondForm').reset();
    });

    $('#newPostModal').on('hidden.bs.modal', function () {
        document.getElementById('newPostForm').reset();
    });

});

// Función para cargar las publicaciones
const loadPost = async () => {
    const posts = await fetch('./Backend/Files/loadPost.php');
    const items = await posts.json();
    dibujaPosts(items.MESSAGE);
    console.log('posts => ', items);
};

// Función para dibujar las publicaciones en el contenedor
const dibujaPosts = async posts => {
    const postElements = await Promise.all(posts.map(async (item) => {
        const clone = postCard.cloneNode(true); // Clona el postCard original para cada publicación

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

// Función para dibujar las respuestas a una publicación específica
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

// Función para cargar información del usuario
const loadUser = () => {
    const url = window.location.search;
    const params = new URLSearchParams(url);
    const usuario = params.get('email');

    if (usuario) {
        const sendData = {
            usuario
        };
        fetch('./Backend/Files/home.php', {
            method: 'POST',
            body: JSON.stringify(sendData),
            headers: { 'Content-Type': 'application/json ' }
        })
        .then(async (response) => {
            const user = await response.json();
            loggedUser = user.MESSAGE;
            const inputIdUser = document.getElementById('idUsuario');
            const inputIdUserModal = document.getElementById('idUsuarioModal');
            inputIdUser.value = loggedUser.email;
            inputIdUserModal.value = loggedUser.email;
            titulo.innerHTML = loggedUser.nombre;
            console.log('response => ', loggedUser);
        });
    }
};

// Función para cargar las respuestas a un post específico
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
    })
    .then(async (response) => {
        const items = await response.json();
        dibujaPost(items.MESSAGE);
        console.log('post to respond => ', items);
    })
    .catch(error => console.error('Error de Fetch:', error));
};

// Función para dibujar las respuestas a un post específico
const dibujaPost = post => {
    responseContainer.innerHTML = '';
    post.forEach((item) => {
        responseCard.querySelector('.card-title').textContent = item.idUsuario;
        responseCard.querySelector('.card-subtitle').textContent = item.titulo + '     ' + item.fecha;
        responseCard.querySelector('.card-text').textContent = item.mensaje;

        const clone = responseCard.cloneNode(true);
        fragment.appendChild(clone);
    });
    responseContainer.appendChild(fragment);
};

// Función para enviar una nueva respuesta
const newRespond = () => {
    const url = window.location.search;
    const params = new URLSearchParams(url);
    const idUsuario = params.get('email');
    const idPost = document.getElementById('newRespondPostId');
    const message = document.getElementById('addResponse');

    const sendData = {
        idPost: idPost.value,
        idUsuario: idUsuario,
        message: message.value
    };

    console.log(sendData);

    fetch('./Backend/Files/newRespond.php', {
        method: 'POST',
        body: JSON.stringify(sendData),
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(async (response) => {
        const res = await response.json();
        if (res.STATUS == 'SUCCESS') {
            console.log('Respuesta correcta', res);
            window.location.replace(`/home.html?email=${idUsuario}`);
        } else {
            console.log('Respuesta incorrecta');
        }
    })
    .catch(error => {
        console.error('Error en el fetch:', error);
    });
};
