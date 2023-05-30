$(document).ready(function () {
    // Call the showdata function when the document is ready
    showdata();
});

function addTask() {
    // Get the task name from the input field
    taskName = $('#taskName').val();
    $('#taskName').val('');

    if (taskName) {
        // Generate an ID for the task
        id = localStorage.length;
        id = id + 1;

        // Set the initial task status to false (not checked)
        taskStatus = false;

        // Create a task object
        let myobj = {
            id: id,
            taskname: taskName,
            time: 0,
            interval: null,
            status: taskStatus
        }

        // Serialize the task object to JSON
        myObj_serialized = JSON.stringify(myobj);

        // Store the serialized task object in local storage using the ID as the key
        localStorage.setItem(id, myObj_serialized);

        // Call the showdata function to update the task list
        showdata();
    }
}

function getData(id) {
    // Retrieve the task object from local storage by ID and deserialize it
    myobj_deserialized = JSON.parse(localStorage.getItem(id));
    return myobj_deserialized;
}

function showdata() {
    data = "";
    for (let index = 1; index <= localStorage.length; index++) {
        // Retrieve each task object and generate HTML to display the task
        row = getData(index);
        data += `<li onclick=timer(${row.id},true) >
                <a >${row.taskname} 
                <span class="time ${row.status?'time_color_green':'time_color_red'}" id="time${row.id}" >${row.time}s</span> 
                </a>
                <span class="icon" onclick="deleteTask(${row.id})" >
                <i class="fas fa-trash"></i></span>  </li>`;
    }
    // Update the todo list with the generated HTML
    document.getElementById("todolist").innerHTML = data;

    // Update the pending tasks count
    document.getElementById("pendingTasks").innerHTML = localStorage.length;
}

function deleteTask(id) {
    // Remove the task from local storage and reload the page
    localStorage.removeItem(id);
    location.reload(true);
}

function cleardata() {
    console.log("btn-click");
    // Clear all tasks from local storage and reload the page
    localStorage.clear();
    location.reload(true);
}

function check(id) {
    let ele = document.getElementById(`time${id}`);
    myobj = getData(id);

    if (myobj.status) {
        // If the task is checked, update the status to false and apply the appropriate CSS class
        myobj = { ...myobj, status: false }
        ele.classList.remove("time_color_green")
        ele.classList.add("time_color_red")
    } else {
        // If the task is unchecked, update the status to true and apply the appropriate CSS class
        ele.classList.add("time_color_green")
        ele.classList.remove("time_color_red")
        myobj = { ...myobj, status: true }
    }

    // Serialize the updated task object and store it in local storage
    myObj_serialized = JSON.stringify(myobj);
    localStorage.setItem(myobj.id, myObj_serialized);
}

function timer(id, ischeck) {
    if (ischeck) {
        // If the timer is triggered by checking/unchecking the task, call the check function
        check(id);
    }

    let myobj = getData(id);

    if (myobj.status) {
        // If the task is checked, start the timer interval
        interval = setInterval((id) => {
            let ele = document.getElementById(`time${id}`);
            let myobj1 = getData(id);

            // Increment the task time and update the display
            let ttt = ++myobj1.time;
            myobj1 = { ...myobj1, time: ttt }
            ele.innerHTML = myobj1.time + 's';

            // Serialize the updated task object and store it in local storage
            myObj_serialized = JSON.stringify(myobj1);
            localStorage.setItem(myobj1.id, myObj_serialized);
        }, 1000, id);

        // Update the task object with the interval and store it in local storage
        myobj = { ...myobj, interval: interval }
        myObj_serialized = JSON.stringify(myobj);
        localStorage.setItem(myobj.id, myObj_serialized);
    } else {
        // If the task is unchecked, clear the timer interval
        clearInterval(myobj.interval);
    }
}

function init() {
    // Initialize the timers for all tasks
    for (let index = 1; index <= localStorage.length; index++) {
        timer(index);
    }
}

// Call the init function to start the timers
init();
