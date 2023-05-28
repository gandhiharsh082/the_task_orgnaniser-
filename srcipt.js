$(document).ready(function () {
    // function call when page is load and show list
    showdata();
});
// add task to localStorage
function addTask() {
    taskName = $('#taskName').val();
    if (taskName) {
        id = localStorage.length;
        id = id + 1;
        taskStatus = false;
        // make Object to store in localstorage
        let myobj = {
            id: id,
            taskname: taskName,
            time: 0,
            interval: null,
            status: taskStatus
        }
        // convert Object  to string  because localstorage can't store object 
        myObj_serialized = JSON.stringify(myobj);
        localStorage.setItem(id, myObj_serialized);
        // show funcation call to update list  
        showdata();
    }
}
// data retrieve from localStorage by id  
function getData(id) {
    // convert string to object
    myobj_deserialized = JSON.parse(localStorage.getItem(id));
    return myobj_deserialized;
}
// function to fetch list
function showdata() {
    data = "";
    for (let index = 1; index <= localStorage.length; index++) {
        row = getData(index);
        data += `<li onclick=timer(${row.id},true) >
                <a >${row.taskname} 
                <span class="time ${row.status?'time_color_green':'time_color_red'}" id="time${row.id}" >${row.time}s</span> 
                </a>
                <span class="icon" onclick="deleteTask(${row.id})" >
                <i class="fas fa-trash"></i></span>  </li>`;
    }
    document.getElementById("todolist").innerHTML = data;
    document.getElementById("pendingTasks").innerHTML = localStorage.length;
}

// delete row 
function deleteTask(id) {
    localStorage.removeItem(id);
    location.reload(true)
}
// clear all storage
function cleardata() {
    console.log("btn-click");
    localStorage.clear();
    location.reload(true)
}
// it check the task is paused or not 
function check(id) {
    let ele = document.getElementById(`time${id}`);
    myobj = getData(id);
    if (myobj.status) {

        myobj = { ...myobj, status: false }
        ele.classList.remove("time_color_green")
        ele.classList.add("time_color_red")
    } else {
        ele.classList.add("time_color_green")
        ele.classList.remove("time_color_red")
        myobj = { ...myobj, status: true }
    }
    myObj_serialized = JSON.stringify(myobj);
    localStorage.setItem(myobj.id, myObj_serialized);
}

// this funcation add timer in task
function timer(id, ischeck) {
    if (ischeck) {
        check(id)
    }
    let myobj = getData(id);
    if (myobj.status) {
        interval = setInterval((id) => {
            let ele = document.getElementById(`time${id}`);
            let myobj1 = getData(id);
            let ttt = ++myobj1.time;
            myobj1 = { ...myobj1, time: ttt }
            ele.innerHTML = myobj1.time+'s';
            myObj_serialized = JSON.stringify(myobj1);
            localStorage.setItem(myobj1.id, myObj_serialized);
        }, 1000, id);
        myobj = { ...myobj, interval: interval }
        myObj_serialized = JSON.stringify(myobj);
        localStorage.setItem(myobj.id, myObj_serialized);
    } else {
        // status is false  timer is stop 
        clearInterval(myobj.interval);
    }
}
// timer resume time when page is refrash 
function init() {
    for (let index = 1; index <= localStorage.length; index++) {
        timer(index);
    }
}
init();