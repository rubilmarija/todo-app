const ul = document.getElementById("todoitems");

const getAllListItems = async () => {
  const response = await fetch("/tasks", {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
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
  li.innerHTML = `${item.title}`;

  let statusCheckbox = document.createElement("input");
  statusCheckbox.setAttribute("type", "checkbox");
  statusCheckbox.setAttribute("id", `checkbox-${item.id}`);

  let deleteButton = document.createElement("button");
  deleteButton.setAttribute("content", "test content");
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute("id", `delete-btn-${item.id}`);

  ul.appendChild(li);
  li.appendChild(statusCheckbox);
  li.appendChild(deleteButton);

  statusCheckbox.addEventListener("change", async function (e) {
    e.preventDefault();

    const itemId = e.target.parentNode.id;
    const checkboxId = e.target.id;

    await editStatus(itemId, checkboxId);
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

const editStatus = async (itemId, checkboxId) => {
  console.log("editStatus() called for item with id:", itemId);

  const statusCheckbox = document.getElementById(checkboxId);

  const completed = statusCheckbox.checked;

  const response = await fetch(`/task/${itemId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({ completed: completed }),
  });

  console.log("response:", response);
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
