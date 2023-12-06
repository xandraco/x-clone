let loggedUser = {}
const titulo = document.getElementById('userBlog')
const postContainer = document.getElementById('postUsuarios')
const postCard = document.getElementById('cardPost').content
const fragment = document.createDocumentFragment()

document.addEventListener('DOMContentLoaded', () => {
    loadUser()
    loadPost()
})

const loadPost = async () => {
    const posts = await fetch('./Backend/Files/loadPost.php')
    const items = await posts.json()
    dibujaPosts(items.MESSAGE)
    console.log('posts => ', await posts.json)
}

const dibujaPosts = posts => {
    posts.forEach((item) => {
        postCard.querySelector('.card-title').textContent = item.idUsuario
        postCard.querySelector('.card-subtitle').textContent = item.titulo + '     ' + item.fecha
        postCard.querySelector('.card-text').textContent = item.mensaje

        const clone = postCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    postContainer.appendChild(fragment)
}

const loadUser = () => {
    const url = window.location.search
    const params = new URLSearchParams(url)
    const usuario = params.get('email')

    if (usuario) {
        const sendData = {
            usuario
        }
        fetch ('./Backend/Files/home.php', {
            method: 'POST',
            body: JSON.stringify(sendData),
            headers: { 'Content-Type': 'application/json '}
        })
        .then( async (response) => {
            const user = await response.json()
            loggedUser = user.MESSAGE
            const inputIdUser = document.getElementById('idUsuario')
            inputIdUser.value = loggedUser.email
            titulo.innerHTML = loggedUser.nombre
            console.log('response => ', loggedUser)
        })
    }
}
