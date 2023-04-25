const ul = document.getElementById("todoitems");
const div = document.querySelector(".todoitems-container");

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

  const data = await response.json();

  console.log(data);

  for (let item of data) {
    createItem(item);
  }
};

getAllListItems();

const createItem = async (item) => {
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

  ul.appendChild(li);
  li.appendChild(titleSpan);
  li.appendChild(statusCheckbox);
  li.appendChild(editButton);
  li.appendChild(deleteButton);

  statusCheckbox.addEventListener("change", async function (e) {
    e.preventDefault();

    const itemId = e.target.parentNode.id;
    const checkboxId = e.target.id;

    await editStatus(itemId, checkboxId);
  });

  editButton.addEventListener("click", async function (e) {
    e.preventDefault();

    const itemId = e.target.parentNode.id;
    const editButtonId = e.target.id;

    await openEditTitle(itemId, editButtonId);
  });

  deleteButton.addEventListener("click", async function (e) {
    e.preventDefault();

    const itemId = e.target.parentNode.id;
    const deleteButtonId = e.target.id;

    await deleteTask(itemId, deleteButtonId);
  });
};

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

  let data = await response.json();

  console.log(data);

  createItem(data);
};

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  await addNewTask();

  const taskInput = document.getElementById("task-input");

  taskInput.value = "";
});

const openEditTitle = async (itemId) => {
  console.log("openEditTitle() called for item with id:", itemId);

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

  editSubmitButton.addEventListener("click", async function (e) {
    e.preventDefault();

    const editSubmitButtonId = e.target.id;

    await submitEditedTitle(itemId, editSubmitButtonId);
  });
};

const submitEditedTitle = async (itemId) => {
  console.log("submitEditedTitle() called for item with id:", itemId);

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

  const titleElement = document.getElementById(`title-span-${itemId}`);
  console.log(titleElement);

  titleElement.textContent = data.title;

  console.log("response:", response);
};

const editStatus = async (itemId, checkboxId) => {
  console.log("editStatus() called for item with id:", itemId);

  const task = document.getElementById(itemId);
  const statusCheckbox = document.getElementById(checkboxId);

  const completed = statusCheckbox.checked;

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

const deleteTask = async (itemId) => {
  const task = document.getElementById(itemId);

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

  deleteMultipleButton.addEventListener("click", async function (e) {
    e.preventDefault();

    await deleteCompletedTasks();
  });

  div.appendChild(deleteMultipleButton);
};

createDeleteMultipleButton();

const deleteCompletedTasks = async () => {
  const completedTasks = document.querySelectorAll(".completed");

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
