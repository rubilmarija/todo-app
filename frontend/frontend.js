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

const createItem = async (item) => {
  let li = document.createElement("li");
  let statusCheckbox = document.createElement("input");
  statusCheckbox.setAttribute("type", "checkbox");
  statusCheckbox.setAttribute("id", `checkbox-${item.id}`);

  li.id = item.id;
  li.innerHTML = `${item.title}`;

  ul.appendChild(li);
  li.appendChild(statusCheckbox);

  statusCheckbox.addEventListener("change", async function (e) {
    e.preventDefault();

    const itemId = e.target.parentNode.id;
    const checkboxId = e.target.id;

    await editStatus(itemId, checkboxId);
  });
};

getAllListItems();

const editStatus = async (itemId, checkboxId) => {
  console.log("editStatus() called for item with id:", itemId);
  const statusCheckbox = document.getElementById(checkboxId);
  const url = `/task/${itemId}`;

  const completed = statusCheckbox.checked;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({ completed: completed }),
  });

  console.log("response:", response);
};

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  await addNewTask();
});

const addNewTask = async () => {
  const url = "/task";
  let newTaskTitle = document.getElementById("new-task").value;
  console.log(newTaskTitle);

  const response = await fetch(url, {
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