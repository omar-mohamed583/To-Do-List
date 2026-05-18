const addTask = document.querySelector('.add-task'),
    tasksContainer = document.querySelector('.tasks-list'),
    taskInput = document.querySelector('.input-container input'),
    tasks = JSON.parse(localStorage.getItem('tasks')) ?? [],
    tasksCount = document.querySelector('.tasks span'),
    completedTasks = document.querySelector('.completed-tasks span'),
    noTasks = document.querySelector('.no-tasks');

if (tasks.length) noTasks.style.display = 'none';
updateTasksCounter();

// Display Tasks Onload

window.onload = displayTasks;

// Add Task
addTask.addEventListener('click', () => {
    requestAnimationFrame(() => {
        addTaskToContainer();
        if (tasks.length) noTasks.style.display = 'none';
    })
});

// State List Event Delegation
document.body.addEventListener('click', e => {
    const ele = e.target.classList.contains('current-state') ?
        e.target : e.target.parentElement.classList.contains('current-state') ?
        e.target.parentElement : null,
        activeList = document.querySelector('.state-list.active');

    // if The Target is state List Toggler => toggle its list
    if (ele) {
        ele.nextElementSibling.classList.toggle('active');
        listEventListener(ele.nextElementSibling);

        // close any open list if the current list is toggled
        if (activeList && ele.nextElementSibling !== activeList) activeList.classList.toggle('active');

    // delete button behavior
    } else if (e.target.classList.contains('delete')) {
        const taskEle = e.target.closest('li')
        removeTask(taskEle);

    // if clicked any where close the active list
    } else if (!e.target.classList.contains('state-list') && !e.target.closest('.state-list')) {
        const activeList = document.querySelector('.state-list.active');

        if (activeList) {
            activeList.classList.toggle('active');
        }
    }
});


// sticky header behavior
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    setTimeout(() => {
        requestAnimationFrame(() => {
            if ( window.scrollY > window.innerHeight / 3.5) {
                header.classList.add('shrink');
            } else {
                header.classList.remove('shrink');
            }
        });
    }, 250);
});

const ids = JSON.parse(localStorage.getItem('ids')) ?? [];

function idGenerator() {
    let id = '';

    for (let i = 0; i < 6; i++) {
        id += `${Math.trunc(Math.random() * 1000) + Math.trunc(Math.random() * 1000)}${i === 5 ? '' : '-'}`;
    }

    if (!ids.includes(id)) {
        ids.push(id);
        localStorage.setItem('ids',JSON.stringify(ids));
        return id;
    } else {
        id = '';

        for (let i = 0; i < 6; i++) {
            id += `${Math.trunc(Math.random() * 1000) + Math.trunc(Math.random() * 1000)}${i === 5 ? '' : '-'}`;
        }
    }

}

function addTaskToContainer() {
    if (taskInput.value.trim()) {

        // Check Exiting task
        if (tasks.find(task => task.name === taskInput.value.trim()) && tasks.find(task => task.day === (new Date().getDate()))) {
            showError('Can\'t Add An Existing Task Twice!');

        } else {

            
                    let randomNum = Math.random(),
                    borderClr = randomNum <= 0.25 ? '#009688' : randomNum <= 0.5 ? '#f44336' : randomNum <= 0.75 ? '#ff9800' : '#673ab7';
                    
                    if (borderClr === tasksContainer.lastElementChild?.style.borderLeftColor) {
                        randomNum = Math.random(),
                        borderClr = randomNum <= 0.25 ? '#009688' : randomNum <= 0.5 ? '#f44336' : randomNum <= 0.75 ? '#ff9800' : '#673ab7';
                    }
            
                    const id = idGenerator(),
                    name = taskInput.value.trim(),
                    date = new Date(),
                    day = date.getDate(),
                    month = date.getMonth() + 1,
                    year = date.getFullYear(),
                    state = `Not Started`,
                    taskElement = `
                    <li class="task" data-id="${id}" style="--brdr-clr:${borderClr}">
                        <div class="header">
                            <span class="name" title="${name}">${name}</span>
                            <button class="delete" data-id="${id}">Delete</button>
                        </div>
                
                        <div class="body">
                            <span class="put-date">${day} • ${month} • ${year}</span>
                
                            <div class="state">
                                <p class="current-state" style="anchor-name: --list-${id}" aria-label="Task Current State" data-value="Not Started"><span class="shape not-started"></span> <span class="state-text">${state}</span>
                                    <span class="select">
                                        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="#000000" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#000000" d="M13.098 8H6.902c-.751 0-1.172.754-.708 1.268L9.292 12.7c.36.399 1.055.399 1.416 0l3.098-3.433C14.27 8.754 13.849 8 13.098 8Z"></path></g>
                                        </svg>
                                    </span>
                                </p>
                
                                <ul class="state-list" style="position-anchor: --list-${id};">
                                    <li data-value="Not Started" disabled><span class="shape not-started"></span> Not Started</li>
                                    <li data-value="Pending"><span class="shape pending"></span> Pending</li>
                                    <li data-value="Finished"><span class="shape finished"></span> Finished</li>
                                </ul>
                            </div>
                        </div> 
                    </li>`;
                
                    tasks.unshift({
                        id,
                        name,
                        day,
                        month,
                        year,
                        state
                    });
            
                    localStorage.setItem('tasks',JSON.stringify(tasks));
            
                    if (!(document.startViewTransition)) {
                        tasksContainer.insertAdjacentHTML('afterbegin', taskElement);
                        updateTasksCounter();
                        taskInput.value = '';
                    }

                    document.startViewTransition(() => {
                        tasksContainer.insertAdjacentHTML('afterbegin', taskElement);
                        updateTasksCounter();
                        taskInput.value = '';
                    });
                }

    } else {
        showError('Please add a task name!');
    }
}

function updateTasksCounter() {
    requestAnimationFrame(() => {
        // Update Tasks Count
        tasksCount.textContent = tasks.length;
        
        // update Completed tasks
        let completedTasksCount = 0;
    
        tasks.forEach( task => {
            if (task.state === 'Finished') completedTasksCount++;
        });
        completedTasks.textContent = completedTasksCount;
    });
}

function showError(msg, ...args) {
    if (document.querySelector('.error')?.textContent === msg ) return;
    const err = document.createElement('div');
    err.classList.add('error');

    if (args.length) {
        const words = msg.split(' ');
        err.appendChild(document.createTextNode(words[0] + ' '));
        const errSpan = document.createElement('span');
        errSpan.appendChild(document.createTextNode(args[0]));
        err.appendChild(errSpan);
        err.appendChild(document.createTextNode(' ' + words.slice(1).join(' ')));
    } else {
        err.appendChild(document.createTextNode(msg));
    }

    requestAnimationFrame(() => {
        document.body.appendChild(err);
        setTimeout(() => {
            err.remove();
        }, 3500);
    });
}

function displayTasks() {
    if (tasks.length) {

        tasksContainer.innerHTML = tasks.map(task => {
            const { id, name, day, month, year, state } = task,
            randomNum = Math.random(),
            borderClr = randomNum <= 0.25 ? '#009688' : randomNum <= 0.5 ? '#f44336' : randomNum <= 0.75 ? '#ff9800' : '#673ab7';

            return `<li class="task" data-id="${id}" style="--brdr-clr:${borderClr}">
                <div class="header">
                    <span class="name" title="${name}">${name}</span>
                    <button class="delete" data-id="${id}">Delete</button>
                </div>
        
                <div class="body">
                    <span class="put-date">${day} • ${month} • ${year}</span>
        
                    <div class="state">
                        <p class="current-state" style="anchor-name: --list-${id}" aria-label="Task Current State" data-value="${state}"><span class="shape ${state.toLowerCase().length !== 1 ? state.toLowerCase().split(' ').join('-') : state.toLowerCase()}"></span> <span class="state-text">${state}</span>
                            <span class="select">
                                <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="#000000" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#000000" d="M13.098 8H6.902c-.751 0-1.172.754-.708 1.268L9.292 12.7c.36.399 1.055.399 1.416 0l3.098-3.433C14.27 8.754 13.849 8 13.098 8Z"></path></g>
                                </svg>
                            </span>
                        </p>
        
                        <ul class="state-list" style="position-anchor: --list-${id};">
                            <li data-value="Not Started" ${state === 'Not Started' ? 'disabled' : ''}><span class="shape not-started"></span> Not Started</li>
                            <li data-value="Pending" ${state === 'Pending' ? 'disabled' : ''}><span class="shape pending"></span> Pending</li>
                            <li data-value="Finished" ${state === 'Finished' ? 'disabled' : ''}><span class="shape finished"></span> Finished</li>
                        </ul>
                    </div>
                </div> 
            </li>`;

        }).join(' ');

        updateTasksCounter();
        updateTasksStyles();
    }
}

function removeTask(taskEle) {
    const {id} = taskEle.dataset,
    taskIndex = tasks.findIndex(task => task.id === id);

    requestAnimationFrame(() => {
        showError(`Task Was Deleted` , tasks[taskIndex].name);
        taskEle.remove();
        tasks.splice(taskIndex, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateTasksCounter();
        if (!tasks.length) noTasks.style.display = 'block';
    });
}

// Update Tasks styles Based On its State
function updateTasksStyles() {
    const tasksEleArr = Array.from(tasksContainer.children);

    tasksEleArr.forEach(task => {
        const { value: toggledValue } = task.querySelector('.current-state').dataset;
        const nameSpan = task.querySelector('.name');

        requestAnimationFrame(() => {
            if (toggledValue === 'Finished') {
                nameSpan.style.textDecoration = 'line-through';
                nameSpan.style.color = '#9e9e9e';
                nameSpan.style.textDecorationThickness = '2px';
            } else {
                nameSpan.style.textDecoration = '';
                nameSpan.style.color = '';
                nameSpan.style.textDecorationThickness = '';
            }
        })
    })
}

// update Task State 
function listEventListener(activeStateList) {
    activeStateList.addEventListener('click', e => {
        const currentStateBtn = activeStateList.previousElementSibling,
            toggledEle = e.target?.closest('li[data-value]'),
            currentTask = currentStateBtn.closest('.task');
        
        if (!toggledEle || toggledEle.hasAttribute('disabled')) return;
        
        const { value: toggledValue } = toggledEle.dataset;
        
        activeStateList.querySelector('[disabled]').removeAttribute('disabled');
        toggledEle.setAttribute('disabled','');

        currentStateBtn.dataset.value = toggledValue;
        currentStateBtn.querySelector('.state-text').textContent = toggledValue;

        currentStateBtn.querySelector('.shape').className = `shape ${toggledValue.toLowerCase().length !== 1 ? toggledValue.toLowerCase().split(' ').join('-') : toggledValue.toLowerCase()}`;
        activeStateList.classList.toggle('active');

        const {id} = currentTask.dataset,
        task = tasks.find(task => task.id === id);
        task.state = toggledValue;

        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateTasksCounter();
        updateTasksStyles();
    });

}