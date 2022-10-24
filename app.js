// local storage function
window.addEventListener("load", () => {
  tasks = JSON.parse(localStorage.getItem("tasks")) || []; //made tasks a global variable so it can be used outside the function
  const nameInput = document.querySelector("#name");
  const newTaskForm = document.querySelector("#new-task-form");

  const username = localStorage.getItem("username") || "";

  nameInput.value = username;

  nameInput.addEventListener("change", (e) => {
    // (e) is shorthand for event
    localStorage.setItem("username", e.target.value);
  });

  newTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const task = {
      content: e.target.elements.content.value,
      category: e.target.elements.category.value,
      done: false,
      createdAt: new Date().getTime(),
    };

    tasks.push(task);
    // local files can only save primitive data types like string, number, and boolean, so the
    // json has to be converted to a string so that the local file will be able to use it
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // I have to make it so that the form resets when the task is added (un-ticks radio and clears text)
    e.target.reset();

    DisplayTasks(); // any time a change is made DisplayTasks() will be put at the end so that it is updated
  });

  DisplayTasks();
});

// Creating a function to display the information saved in the localdata json
function DisplayTasks() {
  const taskList = document.querySelector("#task-list");
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");

    // establishing variables for the elements used
    const label = document.createElement("label");
    const input = document.createElement("input");
    const span = document.createElement("span");
    const content = document.createElement("div");
    const actions = document.createElement("div");
    const edit = document.createElement("button");
    const deleteButton = document.createElement("button");

    input.type = "checkbox";
    input.checked = task.done;
    span.classList.add("bubble"); //adding bubble class to the input
    if (task.category == "personal") {
      span.classList.add("personal");
    } else {
      span.classList.add("business");
    }
    content.classList.add("task-content");
    actions.classList.add("actions");
    edit.classList.add("edit");
    deleteButton.classList.add("delete");

    content.innerHTML = `<input type="text" value="${task.content}" readonly>`;
    edit.innerHTML = "Edit";
    deleteButton.innerHTML = "Delete";

    label.appendChild(input);
    label.appendChild(span);
    actions.appendChild(edit);
    actions.appendChild(deleteButton);
    taskItem.appendChild(label);
    taskItem.appendChild(content);
    taskItem.appendChild(actions);

    taskList.appendChild(taskItem);

    if (task.done) {
      taskItem.classList.add("done");
    }

    input.addEventListener("change", (e) => {
      task.done = e.target.checked;
      localStorage.setItem("tasks", JSON.stringify(tasks));

      if (task.done) {
        taskItem.classList.add("done");
      } else {
        taskItem.classList.remove("done");
      }

      DisplayTasks();
    });
    //this allows us to take the previously existing task content and toggle the ability to edit it
    edit.addEventListener("click", (e) => {
      const input = content.querySelector("input");
      input.removeAttribute("readonly");
      input.focus();
      input.addEventListener("blur", (e) => {
        input.setAttribute("readonly", true);
        task.content = e.target.value;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        DisplayTasks();
      });
    });
    // this allows the ability to delete list items
    deleteButton.addEventListener("click", (e) => {
      tasks = tasks.filter((t) => t != task);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      DisplayTasks();
    });
  });
}
