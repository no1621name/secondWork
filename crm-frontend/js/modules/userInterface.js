import server from './server.js';

const userInterface = {
    //variables and side data
    tableBody:  document.querySelector('.table__content'),
    mainWindow: document.querySelector('#mainWimdow'),
    deleteWindow: document.querySelector('#confirmDeleteWindow'),
    valid: {
        'Телефон': /(\+)?\d9\d{9,}/g,
        'Email': /^[-.\w]+@([\w-]+\.)+[\w-]+/gi,
        'Facebook': /(https:\/\/(www\.)?)?facebook\.com\/profile\.php\?id=\d+$|(https:\/\/(www\.)?)?facebook\.com\/\S+|\@\S+/gi,
        'VK': /(https:\/\/(www\.)?)?vk\.com\/\S+|\@\S+/gi,
        'Другое': /.+/
    },

    forms: {
        newClient: `
            <span class="close__btn close"></span>
            <h5>Новый клиент</h5>
            <form action="/" method="get">
                <label for="surname">
                    <input type="text" name="surname" id="surname" placeholder=" " class="form__input" autocomplete="off" data-required="1">
                    <div class="placeholder">Фамилия<span>*</span></div>
                </label>
                <label for="name">
                    <input type="text" name="name" id="name" placeholder=" " class="form__input" autocomplete="off" data-required="1">
                    <div class="placeholder">Имя<span>*</span></div>
                </label>
                <label for="lastName">
                    <input type="text" name="lastName" id="lastName" placeholder=" " class="form__input" autocomplete="off">
                    <div class="placeholder">Отчество</div>
                </label>
                <div class="contacts" id="contatcs"></div>
                <button class="contact__add-button" type="button" id="contactAddBtn"><img src="img/addContact.png" alt="add contact"> Добавить контакт</button>
                <div class="warning" id="warning"></div>
                <button class="save-button" id="saveBtn" type="submit">Сохранить</button>
            </form>
            <span class="cancel close">Отмена</span>
        `,
        editClient: `
            <span class="close__btn close"></span>
            <h5>Изменить данные <span class="client-id" id="clientId"></span></h5>
            <form action="/" method="get">
                <label for="surname">
                    <input type="text" name="surname" id="surname" placeholder=" " class="form__input" autocomplete="off" data-required="1">
                    <div class="placeholder">Фамилия<span>*</span></div>
                </label>
                <label for="name">
                    <input type="text" name="name" id="name" placeholder=" " class="form__input" autocomplete="off" data-required="1">
                    <div class="placeholder">Имя<span>*</span></div>
                </label>
                <label for="lastName">
                    <input type="text" name="lastName" id="lastName" placeholder=" " class="form__input" autocomplete="off">
                    <div class="placeholder">Отчество</div>
                </label>
                <div class="contacts" id="contatcs"></div>
                <button class="contact__add-button" type="button" id="contactAddBtn"><img src="img/addContact.png" alt="add contact"> Добавить контакт</button>
                <div class="warning" id="warning"></div>
                <button class="save-button" id="saveBtn" type="submit">Сохранить</button>
            </form>
            <span class="client-delete" id="clientDelete">Удалить клиента</span>
        `
    },

    //sort clients list
    sortMethods: {
        byID: (a, b) => {
            if(a.id > b.id)return 1;
            if(a.id == b.id)return 0;
            if(a.id < b.id)return -1;
        },
        byFullName: (a, b) => {
            if(a.surname > b.surname)return 1;
            if(a.surname == b.surname)return 0;
            if(a.surname < b.surname)return -1;
        },
        byCreateTime: (a, b) => {
            const dateA = Date.parse(a.createdAt);
            const dateB = Date.parse(b.createdAt);
            if(dateA < dateB)return 1;
            if(dateA == dateB)return 0;
            if(dateA > dateB)return -1;
        },
        byUpdateTime: (a, b) => {
            const dateA = Date.parse(a.updatedAt);
            const dateB = Date.parse(b.updatedAt);
            if(dateA < dateB)return 1;
            if(dateA == dateB)return 0;
            if(dateA > dateB)return -1;
        }
    },

    chooseSortMethod: async function(event){
        const arr = await server.getClientsList();

        document.querySelectorAll('.table__sort-methods').forEach((el) => el.classList.remove('active'));
        event.target.classList.add('active');

        arr.sort(userInterface.sortMethods[event.target.dataset.sorttype]);
        userInterface.render(arr);
    },

    //render table
    render: function(arr){
        arr = arr.sort(this.sortMethods[document.querySelector('.table__sort-methods.active').dataset.sorttype]);

        for(let clientObj of arr){
            if(arr.indexOf(clientObj) == arr.length-1){document.querySelector('.loading__box') !== null ? this.tableBody.removeChild(document.querySelector('.loading__box')) : null};

            const client = document.createElement('div');

            client.classList.add('client');
            client.innerHTML = `
                <span class="client__id">${clientObj.id}</span>
                <span class="client__full-name">${clientObj.surname} ${clientObj.name} ${clientObj.lastName}</span>
                <span class="client__date">${clientObj.createdAt.slice(0, 10).split('-').reverse().join('.')} <span class="client__date-time">${clientObj.updatedAt.slice(11, 16)}</span></span>
                <span class="client__date">${clientObj.updatedAt.slice(0, 10).split('-').reverse().join('.')} <span class="client__date-time">${clientObj.updatedAt.slice(11, 16)}</span></span>
                ${this.renderContacts(clientObj.contacts).outerHTML}
                <div class="client__doings" data-id="${clientObj.id}">
                    <button class="client__edit-button"><img src="img/editBtn.png" alt="editBtn"> Изменить</button>
                    <button class="client__delete-button"><img src="img/deleteBtn.png" alt="deleteBtn"> Удалить</button>
                </div>
            `;
            this.tableBody.append(client);
        }
    },

    renderContacts: function(contacts){
        const contactsList = document.createElement('div');
        contactsList.classList.add('client__contacts');

        for(let contact of contacts){
            const a = document.createElement('a');
            a.innerHTML = `
                    <span class="tip">${contact.type}: <span class="hilighted">${contact.value}</span></span>
                    <img src="img/${contact.type}.png" alt="${contact.type}">
            `
            contactsList.append(a);
        }

        const allContacts = contactsList.childNodes;

        if(allContacts.length > 4){
            allContacts.forEach((el, ind) => {
                if(ind >=4) el.style.display = "none";
            });

            const showAllContactsBtn = document.createElement('button');

            showAllContactsBtn.classList.add('showAllContactsBtn');
            showAllContactsBtn.innerHTML = `+${allContacts.length - 4}`;
            showAllContactsBtn.setAttribute('onclick', 'userInterface.showAllContacts(event)');
            contactsList.append(showAllContactsBtn);
        }

        return contactsList;
    },

    showAllContacts: function(event){
        event.target.parentElement.childNodes.forEach(el => el.style.display = "inline-flex");
        event.target.style.display = "none";
    },

    //windows and actions on them
    openMainWindow: function(formType){
        userInterface.mainWindow.querySelector('#mainWindowContent').innerHTML = ``;
        userInterface.mainWindow.querySelector('#mainWindowContent').innerHTML = userInterface.forms[formType];

        userInterface.mainWindow.classList.add('active');

        userInterface.mainWindow.addEventListener('click', (event) => {
            if(event.target.classList.contains('close')){
                userInterface.mainWindow.classList.remove('active');
                history.pushState("", document.title, window.location.pathname);
            }
        });
    },

    confirmClientDelete: function(id){
        const warningMessage = userInterface.deleteWindow.querySelector('#warning');

        userInterface.deleteWindow.classList.add('active');
        userInterface.deleteWindow.addEventListener('click', (event) => {
            if(event.target.classList.contains('close')){
                userInterface.deleteWindow.classList.remove('active');
            }
        });

        userInterface.deleteWindow.querySelector('#confirmDeleteBtn').onclick = deleteClient;

        function deleteClient(){
            server.DELETE(id)
            .then((response) => {
                if(response.status == 200 || response.status == 201){
                    userInterface.deleteWindow.classList.remove('active');
                    server.getClientsList().then((arr) => userInterface.render(arr));
                } else{
                    warningMessage.innerHTML = 'Упс, что-то пошло не так...';
                    userInterface.hideWarningMessage(userInterface.deleteWindow)
                }
            });
        };
    },

    createNewContact: function(type='Телефон', value='', list, btn){
        const contact = document.createElement('label');

        contact.classList.add('contact');
        contact.innerHTML = `
        <select name="type" id="contactType" class="contact__type__list">
            <option value="Телефон">Телефон</option>
            <option value="Email">Email</option>
            <option value="Facebook">Facebook</option>
            <option value="VK">VK</option>
            <option value="Другое">Другое</option>
        </select>
        <input type="text" name="value" id="contactValue">
        <button class="contact__delete-button" type="button" id="contactDeleteBtn"><img src="img/deleteBtn.png" alt="deleteBtn"><span class="tip">Удалить клиента</span></button>`;

        contact.querySelector('#contactDeleteBtn').addEventListener('click', () => {
            list.removeChild(contact);
            checkContactsAmont();
        });

        contact.querySelector('select').value = type;
        contact.querySelector('input').value = value;

        list.append(contact);

        checkContactsAmont();

        function checkContactsAmont(){
            if(list.children.length > 9){
                btn.style.display = "none";
            } else{
                btn.style.display = "flex";
            }
        }
    },

    hideWarningMessage: (window) => {setTimeout(() => window.querySelector('#warning').innerHTML = ``, 15000);},


    //actions with client
    changeClientInfo: async function(id) {
        userInterface.openMainWindow('editClient');

        const contactAddBtn = userInterface.mainWindow.querySelector('#contactAddBtn');
        const contactsCreateList = userInterface.mainWindow.querySelector('#contatcs');
        const warningMessage = userInterface.mainWindow.querySelector('#warning')

        location.hash = id;
        let clientData = await server.getClient(location.hash.substring(1, location.hash.length))
            .then(async (responce) => {
                if(responce.ok){
                    return await responce.json();
                } else{
                    warningMessage.innerHTML = `Упс, в ссылке ошибка... Проверьте ее правильность`;
                    setTimeout(() => {
                        warningMessage.innerHTML = '';
                        userInterface.mainWindow.classList.remove('active');
                    }, 15000);
                    location.hash = '';
                    return  {
                        id: 'Error',
                        name: 'Error',
                        surname: 'Error',
                        lastName: 'Error',
                        contacts: []
                    };
                }
            })

        userInterface.mainWindow.querySelector('#clientId').innerHTML = `id: ${clientData.id}`;
        userInterface.mainWindow.querySelectorAll('input').forEach((el) => el.value = clientData[el.name]);

        userInterface.mainWindow.querySelector('form').addEventListener('submit', (event) => userInterface.confirmClientData(event, 'PATCH', id));

        for(let contactInfo of clientData.contacts){
            userInterface.createNewContact(contactInfo.type, contactInfo.value, contactsCreateList, contactAddBtn);
        }
        contactAddBtn.onclick = () => userInterface.createNewContact('Телефон', '', contactsCreateList, contactAddBtn);

        userInterface.mainWindow.querySelector('#clientDelete').onclick = () => {
            server.DELETE(id).then((response) => {
                if(response.status == 200 || response.status == 201){
                    server.getClientsList()
                        .then((arr) => {
                            userInterface.render(arr);
                        })
                        .then(() => {
                            userInterface.mainWindow.classList.remove('active');
                        });
                } else {
                    warningMessage.innerHTML = 'Упс, что-то пошло не так...';
                }
            })
        }
    },

    createNewClient: function(){
        userInterface.openMainWindow('newClient');

        const contactsCreateList = userInterface.mainWindow.querySelector('#contatcs');
        const contactAddBtn = userInterface.mainWindow.querySelector('#contactAddBtn');

        userInterface.mainWindow.querySelector('form').addEventListener('submit', (event) => userInterface.confirmClientData(event, 'POST'));

        contactAddBtn.onclick = () => userInterface.createNewContact('Телефон', '', contactsCreateList, contactAddBtn);
    },

    //client data
    confirmClientData: function (event, method, id){
        event.preventDefault();

        const clientData = Object.fromEntries(new FormData(event.target).entries());
        const warningMessage = userInterface.mainWindow.querySelector('#warning');

        let errors = 0;

        delete clientData.type;
        delete clientData.value;
        clientData.contacts = [];

        userInterface.mainWindow.querySelectorAll('input[data-required="1"]').forEach((el) => {
            el.oninput = event => {
                event.target.classList.remove('invalid')
                warningMessage.innerHTML = '';
            };
            if(el.value.trim() == '') {
                el.classList.add('invalid');
                errors++;
            }
        })

        for(const contactData of event.target.querySelector('#contatcs').children){
            const type = contactData.querySelector('select').value;
            const value = contactData.querySelector('input').value.trim();
            if(value.match(userInterface.valid[type]) !== null && value !== ''){
                clientData.contacts.push({
                    type: type,
                    value: value
                });
            } else {
                warningMessage.innerHTML = 'Пожалуйста, проверьте правильность заполнения контактов';
                userInterface.hideWarningMessage(userInterface.mainWindow);
                errors++;
            }
        }

        if(errors <= 0) {
            server[method](clientData, id).then(async (response) => {
                if(response.ok){
                    server.getClientsList()
                        .then((arr) => {
                            userInterface.render(arr);
                        })
                        .then(() => {
                            userInterface.mainWindow.classList.remove('active');
                            history.pushState("", document.title, window.location.pathname);
                        });
                } else{
                    warningMessage.innerHTML = 'Упс, что-то пошло не так...';
                    userInterface.hideWarningMessage(userInterface.mainWindow);
                }
            });
        }  else{
            warningMessage.innerHTML = 'Пожалуйста, заполните все необходимые поля или проверьте их заполнение';
            userInterface.hideWarningMessage(userInterface.mainWindow);
        }
    },
};

export default userInterface;