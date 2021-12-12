document.addEventListener('DOMContentLoaded', init)

function init(){
    document.querySelector("#github-form").addEventListener('submit', search)
}

function search(event) {
    event.preventDefault()
    const input = event.target.querySelector('#search').value;
    switch (event.target.querySelector('#users-repos').value) {
        case 'users':
            serchUsers(input);
            break;
        case 'repos':
            searchRepos(input);
            break;
    }
}

function serchUsers(input) {    
    fetch(`https://api.github.com/search/users?q=${input}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/vnd.github.v3+json',
        },
    })
        .then(resp => resp.json())
        .then(showUsers)
        .catch(error => console.error(error));
}

function showUsers(data) {
    const list = document.querySelector('#user-list')
    document.querySelector('#repos-list').innerHTML = ''
    document.querySelector('#user-list').innerHTML = ''
    data.items.forEach(element => {
        const li = document.createElement('li')
        list.appendChild(li)

        const img = document.createElement('img')
        li.appendChild(img)
        img.src = element.avatar_url
        img.style.width = '30px'

        const a = document.createElement('a')
        li.appendChild(a)
        a.href = element.html_url
        a.textContent = element.login

        const repoBtn = document.createElement('button')
        repoBtn.addEventListener('click', getRepos)
        repoBtn.textContent = 'repos'
        repoBtn.dataset.reposUrl = element.repos_url
        li.appendChild(repoBtn)
    });
}

function getRepos(event){
    document.querySelector('#user-list').innerHTML = ''
    document.querySelector('#repos-list').innerHTML = ''
    fetch(event.target.dataset.reposUrl, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/vnd.github.v3+json',
        },
    })
    .then(resp => resp.json())
    .then(showRepos)
    .catch(error => console.error(error))
    
}

function showRepos(data){
    const list = document.querySelector('#repos-list')
    data.forEach(element => {
        const li = document.createElement('li')
        list.appendChild(li)
        li.textContent = element.name
    })
}

function searchRepos(input) {
    document.querySelector('#repos-list').innerHTML = ''
    document.querySelector('#user-list').innerHTML = ''

    fetch(`https://api.github.com/search/repositories?q=${input}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/vnd.github.v3+json',
        },
    })
        .then(resp => resp.json())
        .then(data=>showRepos(data.items))
        .catch(error => console.error(error));
    
}