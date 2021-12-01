'use strict';

let input = document.querySelector('input'),
    btn = document.querySelector('button'),
    todoList = document.querySelector('.todo-list'),
    today = document.querySelector('#today'),
    completedEl = document.querySelector('#completed');

let todos = [];

if (localStorage.getItem('todo')) {
    todos = JSON.parse(localStorage.getItem('todo'));
    recreateAllTodos();
}

let dateNow = new Date();
const day = dateNow.getDate();
const month = dateNow.getMonth() + 1;
const year = dateNow.getFullYear();
today.innerHTML = `Today: ${day}/${month}/${year}`;


btn.addEventListener('click', (event) => {
    event.preventDefault();

    let newTodo = {
        text: input.value,
        completed: false,
        important: false,
    };

    if (input.value !== '') {
        todos.push(newTodo);
        recreateAllTodos();
        input.value = '';
        localStorage.setItem('todo', JSON.stringify(todos));
    }
    
});

function recreateAllTodos() {
    let completedTodosCount = 0;
    todoList.innerHTML = '';

    let itemParentElId = 1;

    // порядок todoitems в общем списке
    function compareTodos(todoA, todoB) {
        if (todoA.completed !== todoB.completed) {
            return todoA.completed && !todoB.completed ? 1 : -1;
        }
  
        if (todoA.id === todoB.id) {
           return 0;
        }
  
        return todoA.id > todoB.id ? 1 : -1;
    }

    todos.sort(compareTodos).forEach((item, i) => {
        const itemParentEl = document.createElement('li');
        const itemCheckboxEl = document.createElement('input');
        const itemLabelEl  = document.createElement('label');
        const itemTrashEl = document.createElement('div');

        if (item.completed) {
            ++completedTodosCount;
        }
        
        itemParentEl.id = itemParentElId++;
        itemCheckboxEl.type = "checkbox";
        itemCheckboxEl.id = `checkbox_${i}`;

        itemLabelEl.innerHTML = item.text;
        itemLabelEl.setAttribute("for", itemCheckboxEl.id);
        itemLabelEl.classList.add('todo-task');

        itemTrashEl.classList.add('trash');

        itemParentEl.appendChild(itemCheckboxEl);
        itemParentEl.appendChild(itemLabelEl);
        itemParentEl.appendChild(itemTrashEl);
        todoList.appendChild(itemParentEl);

        // проверка на checked

        itemCheckboxEl.checked = !!item.completed;
        itemCheckboxEl.addEventListener('click', () => {
            item.completed = itemCheckboxEl.checked;
            localStorage.setItem('todo', JSON.stringify(todos));
            recreateAllTodos();
        });

        // добавление важности элементу

        if (item.important) {
            itemLabelEl.classList.remove('todo-task');
            itemLabelEl.classList.add('important');
        } else {
            itemLabelEl.classList.remove('important');
            itemLabelEl.classList.add('todo-task');
        }

        itemParentEl.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            item.important = !item.important;
            localStorage.setItem('todo', JSON.stringify(todos));
            recreateAllTodos();
        });

        // удаление элемента

        itemTrashEl.addEventListener('click', (e) => {
            e.preventDefault();
            todos.splice(i, 1);
            localStorage.setItem('todo', JSON.stringify(todos));
            recreateAllTodos();
        });
    });

    completedEl.innerHTML = `Completed: ${completedTodosCount}/${todos.length}`;
}