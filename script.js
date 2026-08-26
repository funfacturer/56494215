// ======================================================
// 1. ELEMENTE AUS DEM DOM HOLEN
// ======================================================

const todoForm = document.getElementById('add-todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// ======================================================
// 2. DATENSTRUKTUR & LADEN AUS DEM LOCAL STORAGE
// ======================================================

let todos = JSON.parse(localStorage.getItem('todos')) || [];

// ======================================================
// 3. FUNKTIONEN
// ======================================================

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos () {
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const todoItem = document.createElement('li');
        todoItem.classList.add('todo-item');
        if(todo.done) {
            todoItem.classList.add('done');
        }
        todoItem.dataset.id = todo.id;
        todoItem.innerHTML = `
            <span>${todo.text}</span>
            <div class="todo-actions">
                <button class="complete-btn"><i class="fas fa-check-circle"></i></button>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            </div>
        `;
        todoList.appendChild(todoItem);
    })
}

// ======================================================
// 4. EVENT LISTENERS
// ======================================================

document.addEventListener('DOMContentLoaded', renderTodos);
todoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const todoText = todoInput.value.trim();
    if(todoText) {
        const newTodo = {
            id: Date.now(),
            text: todoText,
            done: false
        };
        todos.push(newTodo);
        saveTodos();
        renderTodos();
        todoInput.value='';
    }
});

// ======================================================
// 5. ABHAKEN & LÖSCHEN VON TO-DOS (EVENT DELEGATION)
// ======================================================

todoList.addEventListener('click', function(e) {
    const clickedElement = e.target;
    const todoItem = clickedElement.closest('.todo-item');
    if(!todoItem) return;
    const todoId = Number(todoItem.dataset.id);
    if(clickedElement.closest('.delete-btn')) {
        todos = todos.filter(todo => todo.id !== todoId);
        saveTodos();
        renderTodos();
    }
    if(clickedElement.closest('.complete-btn')) {
        const toggledTodo = todos.find(todo => todo.id === todoId);
        toggledTodo.done = !toggledTodo.done;
        saveTodos();
        renderTodos();
    }
});

// ======================================================
// 6. FILTERN DER TO-DOS
// ======================================================

const filterContainer = document.querySelector('.filter-container');
let currentFilter = 'all';
filterContainer.addEventListener('click', function(e) {
    const clickedElement = e.target;
    if(clickedElement.classList.contains('filter-btn')) {
        currentFilter = clickedElement.dataset.filter;
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        clickedElement.classList.add('active');
        renderTodos();
    }
});

// ======================================================
// 7. RENDER-FUNKTION FÜR FILTER ANPASSEN
// ======================================================

function renderTodos() {
    todoList.innerHTML = '';
    let filteredTodos;
    if (currentFilter === 'open') {
        filteredTodos = todos.filter(todo => !todo.done);
    } else if (currentFilter === 'done') {
        filteredTodos = todos.filter(todo => todo.done);
    } else {
        filteredTodos = todos;
    }
    filteredTodos.forEach(todo => {
        const todoItem = document.createElement('li');
        todoItem.classList.add('todo-item');
        if(todo.done) {
            todoItem.classList.add('done');
        }
        todoItem.dataset.id = todo.id;
        todoItem.innerHTML = `
            <span>${todo.text}</span>
            <div class="todo-actions">
                <button class="complete-btn"><i class="fas fa-check-circle"></i></button>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            </div>
        `;
        todoList.appendChild(todoItem);
    });
}