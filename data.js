/**
 * Data model.
 */

var uuid = require('./lib/uuid');

var users = {};
var todos = {};

var nextId = 1;

function getUserIdByUsername(username) {
    for (var id in users) {
        if (users[id].username == username) {
            return id;
        }
    }
}

function getUserIdBySessionId(sessionId) {
    for (var id in users) {
        if (users[id].sessionId == sessionId) {
            return id;
        }
    }
}

module.exports = {
    users: {
        add: function (object) {
            var id = uuid.v1();
            users[id] = object;
        },

        login: function (object) {
            var user = users[getUserIdByUsername(object.username)];
            if (typeof user == "undefined") return;

            // check password
            if (user.password !== object.password) return;

            // create session
            user.sessionId = uuid.v1();
            return user.sessionId;
        },

        logout: function (sessionId) {
            // destroy session
            users[getUserIdBySessionId(sessionId)].sessionId = null;
        },

        remove: function (id) {
            delete users[id];
        }
    },

    todos: {
        list: function () {
            console.log('- list');
            var values = [];
            for (var id in todos) {
                values.push(todos[id]);
            }
            return values;
        },

        get: function (id) {
            console.log('- get', id);
            return todos[id];
        },

        create: function (object) {
            console.log('- create', object);
            var id = nextId++;
            object.id = id;
            todos[id] = object;
            return todos[id];
        },

        update: function (object) {
            console.log('- update', object);
            if (!(object.id in todos)) throw "invalid id";
            todos[object.id] = object;
            return todos[object.id];
        },

        delete: function (object) {
            console.log('- delete', object);
            if (object.id != -1 && !(object.id in todos)) throw "invalid id";

            if (object.id == -1) {
                for (var id in todos) {
                    if (todos[id].completed) {
                        delete todos[id];
                    }
                }
            }
            else {
                delete todos[object.id];
            }
            return this.list();
        }
    }
};