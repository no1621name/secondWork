import server from './modules/server.js';
import userInterface from './modules/userInterface.js';

async function init(){
    userInterface.tableBody.innerHTML = `<div class="loading__box"><div class="loading"></div></div>`;
    userInterface.render(await server.getClientsList());

    document.querySelector('#searchInput').addEventListener('input', (event) => {setTimeout(server.search, 300, event.target.value)});

    if(location.hash !== '') userInterface.changeClientInfo(+location.hash.substring(1, location.hash.length));

    document.querySelector('#addClientBtn').addEventListener('click', userInterface.createNewClient);
    document.querySelectorAll('.table__sort-methods').forEach((el) => el.addEventListener('click', () => userInterface.chooseSortMethod(event)));

    document.querySelectorAll('.client__edit-button').forEach((el) => el.addEventListener('click', (event) => userInterface.changeClientInfo(event.target.parentElement.dataset.id)));
    document.querySelectorAll('.client__delete-button').forEach((el) => el.addEventListener('click', (event) => userInterface.confirmClientDelete(event.target.parentElement.dataset.id)));
}

init();