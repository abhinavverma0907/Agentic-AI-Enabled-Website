const taskInput = document.getElementById("task-input");
const addButton = document.getElementById("add-button");
const taskList = document.getElementById("task-list");
const messageBox = document.getElementById("message-box");

function showMessage(text, isError) {
    messageBox.innerText = text;
    messageBox.style.display = "block";

    if (isError === true) {
        messageBox.className = "error-msg";
    } else {
        messageBox.className = "success-msg";
    }

    setTimeout(function() {
        messageBox.style.display = "none";
    }, 3000);
}

function handleAddTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        showMessage("Please enter a task first!", true);
        return;
    }

    const listItem = document.createElement("li");

    const taskSpan = document.createElement("span");
    taskSpan.innerText = taskText;

    const editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.className = "edit-btn";
    
    editButton.onclick = function() {
        const newText = prompt("Edit your task:", taskSpan.innerText);
        
        if (newText !== null && newText.trim() !== "") {
            taskSpan.innerText = newText.trim();
            showMessage("Task updated successfully!", false);
        } else if (newText !== null) {
            showMessage("Task cannot be empty!", true);
        }
    };

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.className = "delete-btn";
    
    deleteButton.onclick = function() {
        listItem.remove();
        showMessage("Task deleted!", false);
    };

    const buttonContainer = document.createElement("div");
    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteButton);

    listItem.appendChild(taskSpan);
    listItem.appendChild(buttonContainer);

    taskList.appendChild(listItem);

    taskInput.value = "";

    showMessage("Task added successfully!", false); 
}

addButton.addEventListener("click", handleAddTask);