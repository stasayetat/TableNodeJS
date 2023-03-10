async function GetUsers() {
    const response = await fetch("/api/users", {
        method: "GET",
        headers: {"Accept": "application/json"}
    });
    if(response.ok === true) {
        const users = await response.json();
        let rows = document.querySelector("tbody");
        users.forEach(user => {
            rows.append(row(user));
        });
    }
}

async function GetUser(id) {
    console.log("Start GetUser");
    const response = await fetch("/api/users/" + id, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    });
    if(response.ok === true) {
        const user = await response.json();
        const form = document.forms["usersForm"];
        form.elements["id"].value = user.id;
        form.elements["name"].value = user.name;
        form.elements["age"].value = user.age;
    }
}

async function CreateUser(userName, userAge) {
    const response = await fetch("/api/users", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: userName,
            age: userAge
        })
    });
    if(response.ok === true) {
        const user = await response.json();
        reset();
        document.querySelector("tbody").append(row(user));
    }
}

async function EditUser(userId, userName, userAge) {
    console.log("Start Edit");
    const response = await fetch("/api/users", {
        method: "PUT",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            id: userId,
            name: userName,
            age: parseInt(userAge, 10)
        })
    });
    if(response.ok === true) {
        const user = await response.json();
        reset();
        document.querySelector("tr[data-rowid='" + user.id + "']").replaceWith(row(user));
    }
}

async function DeleteUser(id) {
    const response = await fetch("/api/users/" + id, {
        method: "DELETE",
        headers: {"Accept": "application/json"}
    });
    if(response.ok === true) {
        const user = await response.json();
        document.querySelector("tr[data-rowid='" + user.id + "']").remove();
    }
}

function reset() {
    const form = document.forms['usersForm'];
    form.reset();
    form.elements['id'].value = 0;
}

function row(user) {
    const tr = document.createElement('tr');
    tr.setAttribute('data-rowid', user.id);
    const idTd = document.createElement('td');
    idTd.append(user.id)
    tr.append(idTd);

    const nameTd = document.createElement('td');
    nameTd.append(user.name)
    tr.append(nameTd);

    const ageTd = document.createElement('td');
    ageTd.append(user.age)
    tr.append(ageTd);

    const linksTd = document.createElement('td');
    const editLink = document.createElement('a');
    editLink.setAttribute('data-id', user.id);
    editLink.setAttribute('style', 'cursor:pointer;padding:15px;');
    editLink.append('Edit');
    editLink.addEventListener('click', function (evt) {
        evt.preventDefault();
        GetUser(user.id);
    });
    linksTd.append(editLink);
    const removeLink = document.createElement('a');
    removeLink.setAttribute('data-id', user.id);
    removeLink.setAttribute('style', 'cursor:pointer;padding:15px;');
    removeLink.append("Delete");
    removeLink.addEventListener('click', function (evt) {
        evt.preventDefault();
        DeleteUser(user.id);
    });
    linksTd.append(removeLink);
    tr.appendChild(linksTd);
    return tr;
}

document.getElementById('reset').addEventListener('click', function (evt) {
   evt.preventDefault();
   reset();
});
document.forms['usersForm'].addEventListener('submit', function (evt) {
    evt.preventDefault();
    const form = document.forms['usersForm'];
    const id = form.elements['id'].value;
    const name = form.elements['name'].value;
    const age = form.elements['age'].value;
    if(id == 0) {
        console.log("Creating...");
        CreateUser(name, age);
    } else {
        console.log("Editing...");
        EditUser(id, name, age);
    }
});
GetUsers();