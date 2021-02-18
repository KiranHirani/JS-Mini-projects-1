/*
Todo gets added or removed to UI and LocalStorage
Filter Todos added and mark them as complete 
*/

//UI vars 
//input field 
const toDo = document.getElementById('todo');
//check button 
const submit = document.getElementById('submit');
//filter button
const filter = document.getElementById('filter');
//Collection 
const collection = document.querySelector('.collection');

loadEventListeners();


function loadEventListeners() {

    //Get tasks
    document.addEventListener('DOMContentLoaded', getTasks);

    //Add task
    submit.addEventListener('click', addTodo);

    //Remove Task 
    collection.addEventListener('click', removeTask);

    //Mark Complete
    collection.addEventListener('click', markComplete);

    //FilterTasks
    filter.addEventListener('click', filterTasks);
}

function getTasks() {
    let tasks = getTasksFromLS();
    tasks.forEach(function (task) {
        createElement(task);
    })
}

function getTasksFromLS() {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    return tasks;
}

function addTodo(event) {
    if (toDo.value === '') {
        showError();
        setTimeout(clearError, 3000);
    }
    else {
        //Add item to UI
        createElement(todo.value);

        //Add an element to LS  
        saveToLS(toDo.value);

        toDo.value = ''
    }
    event.preventDefault();
}

function markComplete(event) {
    if (event.target.className.includes('complete')) {
        if (event.target.className.includes('bg-info')) {
            event.target.classList.remove('bg-info');
            event.target.classList.add('bg-success');
        } else {
            event.target.classList.remove('bg-success');
            event.target.classList.add('bg-info');
        }
    }
}

function saveToLS(task) {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTask(event) {
    const el = event.target.parentElement;
    if (event.target.className === "fa fa-trash") {
        el.parentElement.remove();
        removeTaskFromLS(el.parentElement.textContent);
    }
}

function removeTaskFromLS(task) {
    const tasks = getTasksFromLS();
    tasks.forEach(function (t, index) {
        if (t === task) {
            tasks.splice(index, 1);
        }
    })
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function filterTasks() {
    let filter, searchedValue;
    let f = document.querySelector('.filterTasks');
    if (f === null) {
        //Create filter element
        filter = document.createElement('input');
        filter.className = "filterTasks form-control no-border"
        filter.style.background = "transparent";
        filter.style.border = "none";
        filter.style.borderBottom = "1px solid #000000"

        filter.setAttribute('type', "text");
        filter.setAttribute('placeholder', 'Filter ToDos...');

        document.getElementById('error').appendChild(filter);

       //Filter tasks 
        document.querySelector('.filterTasks').addEventListener('keyup', function (event) {
            searchedValue = event.target.value.toLowerCase();
            document.querySelectorAll('.complete').forEach(function (t) {

                let task = t.textContent.toLowerCase();
                if (task.indexOf(searchedValue)!==-1) {
                    t.style.display = "block"
                } else {
                    t.style.display = "none"
                }
            })
        })

    } 
    else {
        document.querySelector('.filterTasks').remove();
    }
}

//Show Error
function showError() {
    console.log('show error');
    const div = document.createElement('div');
    div.className = "alert alert-warning text-center";
    div.appendChild(document.createTextNode("Please enter something"));
    document.getElementById('error').appendChild(div);
}

function clearError() {
    document.querySelector('.alert-warning').remove();
}


function createElement(value) {
    //Add an element to UI 
    const newTask = document.createElement('div');
    //Add class
    newTask.className = "card mt-2 bg-info text-white font-weight-bold border-secondary complete";
    //Add Styling
    newTask.style.padding = "10px"
    // newTask.style.display="flex"
    // newTask.style.flexDirection="row"
    newTask.style.marginRight = "100px";
    newTask.style.cursor = "pointer"
    newTask.style.marginLeft = "100px";
    newTask.style.letterSpacing = "1.5px"

    //Create Link Element 
    const link = document.createElement('a');
    link.className = "delete-item";
    link.style.position = "absolute";
    link.style.right = "10px"
    link.innerHTML = '<i class="fa fa-trash"></i>'

    newTask.appendChild(document.createTextNode(value));
    newTask.appendChild(link);
    document.querySelector('.collection').appendChild(newTask);
}