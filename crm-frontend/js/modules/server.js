import userInterface from './userInterface.js';

const server = {
    //get
    getClientsList: async function(){
        return await fetch('http://localhost:3000/api/clients', {
            method: 'GET',
        })
        .then((response) => {
            userInterface.tableBody.innerHTML = `<div class="loading__box"><div class="loading"></div></div>`;
            if(response.ok) {
                return response.json()
            }
            else return new Error(`sth wrong: ${response.status}`);
        });
    },

    getClient: function(id){
        return fetch(`http://localhost:3000/api/clients/${id}`, {
            method: 'GET'
        })
    },

    DELETE: async function(id){
        return fetch(`http://localhost:3000/api/clients/${id}`, {
            method: 'DELETE'
        })
    },

    search: async function(str){
        const arr = await fetch(`http://localhost:3000/api/clients?search=${str}`)
        .then(response => {
            if(response.ok){
                userInterface.tableBody.innerHTML = ``;
                return response.json();
            } else(
                new Error(`sth wrong: ${response.status}`)
            )
        });

        userInterface.render(arr);
    },

    PATCH: function(obj, id){
        return fetch(`http://localhost:3000/api/clients/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(obj)
        });
    },

    POST: function (obj){
        return fetch('http://localhost:3000/api/clients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(obj)
        });
    }
};

export default server;