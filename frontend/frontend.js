const todoList = document.getElementById("todoitems");
const todoContainer = document.querySelector(".todoitems-container");

const getToken = async () => {
  const response = await fetch("/token", {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });

  const { token } = await response.json();
  return token;
};

const getAllListItems = async () => {
  const token = await getToken();

  const response = await fetch("/tasks", {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });

  let data = await response.json();

  console.log(data);

  for (let item of data) {
    createItem(item);
    checkCompletedStatus(item);
  }
};

getAllListItems();

const checkCompletedStatus = (item) => {
  let statusCheckbox = document.getElementById(`checkbox-${item.id}`);

  if (item.completed) {
    statusCheckbox.checked = true;
  }
};

const createItem = (item) => {
  let li = document.createElement("li");
  li.id = item.id;

  let titleSpan = document.createElement("span");
  titleSpan.setAttribute("id", `title-span-${item.id}`);
  titleSpan.textContent = item.title;

  let statusCheckbox = document.createElement("input");
  statusCheckbox.setAttribute("type", "checkbox");
  statusCheckbox.setAttribute("id", `checkbox-${item.id}`);

  let editButton = document.createElement("button");
  editButton.setAttribute("content", "test content");
  editButton.textContent = "Edit";
  editButton.setAttribute("id", `edit-btn-${item.id}`);

  let deleteButton = document.createElement("button");
  deleteButton.setAttribute("content", "test content");
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute("id", `delete-btn-${item.id}`);

  todoList.appendChild(li);
  li.append(titleSpan, statusCheckbox, editButton, deleteButton);

  addTaskEventListeners(li, item);
};

const addTaskEventListeners = (li, item) => {
  let statusCheckbox = li.querySelector(`#checkbox-${item.id}`);
  let editButton = li.querySelector(`#edit-btn-${item.id}`);
  let deleteButton = li.querySelector(`#delete-btn-${item.id}`);

  statusCheckbox.addEventListener("change", async (e) => {
    e.preventDefault();

    let itemId = e.target.parentNode.id;
    let checkboxId = e.target.id;

    await handleCheckboxChange(itemId, checkboxId);
  });

  editButton.addEventListener("click", async (e) => {
    e.preventDefault();

    let itemId = e.target.parentNode.id;
    let editButtonId = e.target.id;

    await onEditButtonClick(itemId, editButtonId);
  });

  deleteButton.addEventListener("click", async (e) => {
    e.preventDefault();

    let itemId = e.target.parentNode.id;
    let deleteButtonId = e.target.id;

    await onDeleteButtonClick(itemId, deleteButtonId);
  });
};

// Adding new task
const addNewTask = async () => {
  let newTaskTitle = document.getElementById("task-input").value;
  console.log(newTaskTitle);

  const response = await fetch("/task", {
    method: "POST",
    body: JSON.stringify({
      title: newTaskTitle,
    }),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });

  if (!response.ok) {
    const data = await response.json();
    const errorMsg = data.errors[0];
    throw new Error(errorMsg);
  }

  let data = await response.json();

  console.log(data);

  createItem(data);

  //check if an error msg el. with the id "error-msg" exists in the DOM, if it exists, use remove() method

  const errorMsg = document.getElementById("error-msg");
  if (errorMsg) {
    errorMsg.remove();
  }
};

// validation function to check if the 'title' field is empty
function validateTask(title, completed) {
  const errors = [];

  if (!title) {
    errors.push('Please fill in the task!');
  }
  return errors;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("task-input").value;
  const errors = validateTask(title);

  if (errors.length > 0) {
    const errorMsg = document.getElementById("error-msg");
    if (errorMsg) {
      errorMsg.innerText = errors[0];
    } else {
      const div = document.createElement("div");
      div.id = "error-msg";
      div.innerText = errors[0];
      form.parentNode.insertBefore(div, form.nextSibling);
    }
  } else {
    // try catch block around the addNewTask() func. call to catch any errors thrown
    try {
      await addNewTask();
      let taskInput = document.getElementById("task-input");
      taskInput.value = "";
    } catch (error) {
      const errorMsg = document.getElementById("error-msg");

      // check again for the error msg el., if it does, remove it, if not do nothing
      if (errorMsg) {
        errorMsg.innerText = error.message;
      } else {
        const div = document.createElement("div");
        div.id = "error-msg";
        div.innerText = error.message;
        form.parentNode.insertBefore(div, form.nextSibling);
      }
    }
  }
}
);

const onEditButtonClick = async (itemId) => {
  console.log("onEditButtonClick() called for item with id:", itemId);

  let task = document.getElementById(itemId);
  let titleElement = document.getElementById(`title-span-${itemId}`);
  let titleText = titleElement.innerText;

  let editInput = document.createElement("input");
  editInput.setAttribute("type", "text");
  editInput.setAttribute("id", `edit-input-${itemId}`);
  editInput.defaultValue = titleText;

  let editSubmitButton = document.createElement("button");
  editSubmitButton.setAttribute("content", "test content");
  editSubmitButton.textContent = "Confirm";
  editSubmitButton.setAttribute("id", `edit-submit-btn-${itemId}`);

  task.append(editInput, editSubmitButton);

  editSubmitButton.addEventListener("click", async (e) => {
    e.preventDefault();

    let editSubmitButtonId = e.target.id;

    await onSubmitButtonClick(itemId, editSubmitButtonId);
  });
};

const onSubmitButtonClick = async (itemId) => {
  console.log("onSubmitButtonClick() called for item with id:", itemId);

  let editInput = document.getElementById(`edit-input-${itemId}`);
  let editedTitle = editInput.value;
  let editSubmitButton = document.getElementById(`edit-submit-btn-${itemId}`);

  editSubmitButton.remove();
  editInput.remove();

  const response = await fetch(`/task/${itemId}/title`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({ title: editedTitle }),
  });

  let data = await response.json();
  console.log("data:", data);

  let titleElement = document.getElementById(`title-span-${itemId}`);
  console.log(titleElement);

  titleElement.textContent = data.title;

  console.log("response:", response);
};

const handleCheckboxChange = async (itemId, checkboxId) => {
  console.log("handleCheckboxChange() called for item with id:", itemId);

  let task = document.getElementById(itemId);
  let statusCheckbox = document.getElementById(checkboxId);

  let completed = statusCheckbox.checked;

  const response = await fetch(`/task/${itemId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({ completed: completed }),
  });

  console.log("response:", response);

  if (completed) {
    task.setAttribute("class", "completed");
  } else if (!completed) {
    task.removeAttribute("class", "completed");
  }
};

const onDeleteButtonClick = async (itemId) => {
  let task = document.getElementById(itemId);

  const response = await fetch(`/task/${itemId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });

  console.log("response:", response);

  task.remove();
};

const createDeleteMultipleButton = async () => {
  let deleteMultipleButton = document.createElement("button");
  deleteMultipleButton.setAttribute("content", "test content");
  deleteMultipleButton.textContent = "Delete completed tasks";
  deleteMultipleButton.setAttribute("id", `delete-mulitple-btn`);

  deleteMultipleButton.addEventListener("click", async (e) => {
    e.preventDefault();

    await deleteCompletedTasks();
  });

  todoContainer.appendChild(deleteMultipleButton);
};

createDeleteMultipleButton();

const deleteCompletedTasks = async () => {
  let completedTasks = document.querySelectorAll(".completed");

  const response = await fetch(`/tasks/completed`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });

  console.log("response:", response);

  completedTasks.forEach((task) => {
    task.remove();
  });
};
