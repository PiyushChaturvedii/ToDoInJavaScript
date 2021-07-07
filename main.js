// select elements in DOM
const form = document.querySelector('#taskForm');
const inputTask = document.querySelector('#inputTask');
const tasklist = document.querySelector('#tasklist');
const filters = document.querySelectorAll(".nav-item");
const alertDiv = document.querySelector("#message");


// empty task list

let todotask = [];

const alertMessage = function (message, className) {
    alertDiv.innerHTML = message;
    alertDiv.classList.add(className, "show");
    alertDiv.classList.remove("hide");
    setTimeout(() => {
        alertDiv.classList.add("hide");
        alertDiv.classList.remove("show");
    }, 2000);
}

// filter task
const getTaskFilter = function (type) {
    let filterTask = [];
    switch (type) {
        case "pending":
            filterTask = todotask.filter(task => !task.isDone);
            break;
        case "done":
            filterTask = todotask.filter(task => task.isDone);
            break;
        default:
            filterTask = todotask;
            break;
    }
    getList(filterTask);
}

// delete task
const removeTask = function (task) {
    const removeIndex = todotask.indexOf(task)
    todotask.splice(removeIndex, 1);
}
// update item
const updateTask = function (currentTaskIndex, value) {
    const newTask = todotask[currentTaskIndex];
    newTask.name = value;
    todotask.splice(currentTaskIndex, 1, newTask);
    setLocalStorage(todotask);
};

// handle events on actionsbutton
const handleTask = function (taskData) {
    const tasks = document.querySelectorAll(".list-group-item")
    tasks.forEach((task) => {
        if (task.querySelector(".title").getAttribute("data-time") == taskData.addedAt) {
            //done
            task.querySelector("[data-done]").addEventListener("click", function (e) {
                e.preventDefault();
                const taskIndex = todotask.indexOf(taskData);
                const currentTask = todotask[taskIndex];
                const currentClass = currentTask.isDone
                    ? "bi-check-circle-fill"
                    : "bi-check-circle";
                currentTask.isDone = currentTask.isDone ? false : true;
                todotask.splice(taskIndex, 1, currentTask);
                setLocalStorage(todotask);
                const iconClass = currentTask.isDone
                    ? "bi-check-circle-fill"
                    : "bi-check-circle";
                this.firstElementChild.classList.replace(currentClass, iconClass);
                const filterValue = document.querySelector("#tabValue").value;
                getTaskFilter(filterValue); 
            });
            //edit
            task.querySelector("[data-edit]").addEventListener("click", function (e) {
                e.preventDefault();
                inputTask.value = taskData.name;
                document.querySelector('#objIndex').value = todotask.indexOf(taskData)


            });

            //delete
            task.querySelector("[data-delete").addEventListener("click", function (e) {
                e.preventDefault();
                if (confirm("Are you sure to remove this task?")) {
                    tasklist.removeChild(task);
                    removeTask(task);
                    setLocalStorage(todotask);
                    alertMessage("Task has been deleted", "alert-success");
                    return todotask.filter((task)=> task != taskData)
               }

            });
        };
    });
};

const getList = function (todotask) {
    tasklist.innerHTML = "";
    if (todotask.length > 0) {
        todotask.forEach((task) => {
            const iconClass = task.isDone
                ? "bi-check-circle-fill"
                : "bi-check-circle"
            tasklist.insertAdjacentHTML("beforeend", `<li
              class="
                list-group-item
                d-flex
                justify-content-between
                align-items-center
              "
            >
              <span class ="title" data-time="${task.addedAt}">${task.name}</span>
              <span>
                <a data-done><i class="bi ${iconClass} green"></i></a>
                <a data-edit><i class="bi bi-pencil-square blue"></i></a>
                <a data-delete><i class="bi bi-x-circle red"></i></a>
              </span>
            </li>`);
            handleTask(task);
        });
    } else {
        tasklist.insertAdjacentHTML("beforeend",
        `<li class="list-group-item d-flex justify-content-between align-items-center">
              <span>No record found.</span>
              
            </li>`);
    }
}

// get localStorage from the page
const getLocalStorage = function () {
    const todoStorage = localStorage.getItem("todotask");
    if (todoStorage === "undefined" || todoStorage === null) {
        todotask = [];
    } else {
        todotask = JSON.parse(todoStorage);
    }
    console.log('items', todotask);
    getList(todotask);
}

// set in localStorage
const setLocalStorage = function (todotask) {
    localStorage.setItem("todotask", JSON.stringify(todotask));
};

document.addEventListener("DOMContentLoaded", () => {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const taskName = inputTask.value.trim();
        if (taskName.length === 0) {
            alertMessage("Please enter task.", "alert-danger");
        } else {

            const currentTaskIndex = document.querySelector('#objIndex').value;
            if (currentTaskIndex) {
                //update
                updateTask(currentTaskIndex, taskName);
                document.querySelector('#objIndex').value = "";
                alertMessage("Task has been updated.", "alert-success");

            } else {
                const taskObj = {
                    name: taskName,
                    isDone: false,
                    addedAt: new Date().getTime()
                };

                todotask.push(taskObj);
                setLocalStorage(todotask);
                alertMessage("New task has been added.", "alert-success");

            }
            getList(todotask);
        }
        inputTask.value = "";
    });

    // filter tabs
    filters.forEach((tab) => {
        tab.addEventListener("click", function (e) {
            e.preventDefault();
            const tabType = this.getAttribute("data-type");
            document.querySelectorAll(".nav-link").forEach((nav) => {
                nav.classList.remove("active");
            });
            this.firstElementChild.classList.add("active");
            getTaskFilter(tabType);
            document.querySelector('#tabValue').value = tabType;
        });
    });
    // load items
    getLocalStorage();
});