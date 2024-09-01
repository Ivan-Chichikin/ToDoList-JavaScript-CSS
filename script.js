document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('task-input');
  const addBtn = document.getElementById('add-btn');
  const taskList = document.getElementById('task-list').querySelector('tbody');
  const showMoreBtn = document.getElementById('show-more');
  const editPopup = document.getElementById('edit-popup');
  const editTaskInput = document.getElementById('edit-task-input');
  const applyChangesBtn = document.getElementById('apply-changes');
  const deleteTaskBtn = document.getElementById('delete-task');
  const statusButtonsContainer = document.querySelector('.status-buttons');
  const openColumn = document.getElementById('open-column');
  const inProgressColumn = document.getElementById('in-progress-column');
  const closedColumn = document.getElementById('closed-column');
  const taskCounters = {
      open: document.getElementById('open-count'),
      inProgress: document.getElementById('in-progress-count'),
      closed: document.getElementById('closed-count'),
  };

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let currentTask = null;

  addBtn.addEventListener('click', addTask);

  function addTask() {
      const taskText = taskInput.value.trim();
      if (taskText) {
          const newTask = {
              id: Date.now(),
              text: taskText,
              status: 'Открыто', 
          };
          tasks.push(newTask);
          taskInput.value = '';
          saveTasks();
          renderTasks();
          updateCounters();
      }
  }

  function renderTasks() {
      taskList.innerHTML = '';
      openColumn.innerHTML = '';
      inProgressColumn.innerHTML = '';
      closedColumn.innerHTML = '';

      tasks.forEach((task, index) => {
          if (index >= 5 && !showMoreBtn.classList.contains('expanded')) return;

          const row = document.createElement('tr');
          row.innerHTML = `<td>${task.text}</td><td><button class="status-btn">${task.status}</button></td>`;
          row.querySelector('.status-btn').addEventListener('click', () => openPopup(task));
          taskList.appendChild(row);

          const taskCard = document.createElement('div');
          taskCard.textContent = task.text;

          if (task.status === 'Открыто') {
              openColumn.appendChild(taskCard);
          } else if (task.status === 'В работе') {
              inProgressColumn.appendChild(taskCard);
          } else if (task.status === 'Закрыто') {
              closedColumn.appendChild(taskCard);
          }
      });
      showMoreBtn.style.display = tasks.length > 5 ? 'block' : 'none';
  }

  showMoreBtn.addEventListener('click', () => {
      showMoreBtn.classList.toggle('expanded');
      showMoreBtn.textContent = showMoreBtn.classList.contains('expanded') ? 'Скрыть' : 'Показать больше'; // "Hide" and "Show more" in Russian
      renderTasks();
      if (!showMoreBtn.classList.contains('expanded')) {
          window.scrollTo({ top: taskList.offsetTop, behavior: 'smooth' });
      }
  });

  function openPopup(task) {
      currentTask = task;
      editTaskInput.value = task.text;
      editPopup.style.display = 'flex';
      statusButtonsContainer.innerHTML = '';

      let statuses = [];
      switch (task.status) {
          case 'Открыто': 
              statuses = ['В работе', 'Закрыто']; 
              break;
          case 'В работе': 
              statuses = ['Отложено', 'Закрыто']; 
              break;
          case 'Отложено': 
              statuses = ['Открыто']; 
              break;
          case 'Закрыто': 
              statuses = ['Открыть']; 
              break;
      }

      statuses.forEach(status => {
          const btn = document.createElement('button');
          btn.textContent = status;
          btn.addEventListener('click', () => changeStatus(status));
          statusButtonsContainer.appendChild(btn);
      });
  }

  applyChangesBtn.addEventListener('click', () => {
      currentTask.text = editTaskInput.value;
      closePopup();
      saveTasks();
      renderTasks();
  });

  function changeStatus(newStatus) {
      if (newStatus === 'Открыть') {
          currentTask.status = 'Открыто';
      } else if (newStatus === 'Отложено') {
          currentTask.status = 'Открыто';
      } else {
          currentTask.status = newStatus;
      }
      updateCounters();
      closePopup();
      saveTasks();
      renderTasks();
  }

  deleteTaskBtn.addEventListener('click', () => {
      tasks = tasks.filter(task => task !== currentTask);
      updateCounters();
      closePopup();
      saveTasks();
      renderTasks();
  });

  function closePopup() {
      editPopup.style.display = 'none';
      currentTask = null;
  }

  document.querySelector('.close-popup').addEventListener('click', closePopup);

  editPopup.addEventListener('click', (e) => {
      if (e.target === editPopup) {
          closePopup();
      }
  });

  function updateCounters() {
      const openTasks = tasks.filter(task => task.status === 'Открыто').length;
      const inProgressTasks = tasks.filter(task => task.status === 'В работе').length;
      const closedTasks = tasks.filter(task => task.status === 'Закрыто').length;

      taskCounters.open.textContent = openTasks;
      taskCounters.inProgress.textContent = inProgressTasks;
      taskCounters.closed.textContent = closedTasks;
  }

  function saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Первоначальный рендеринг для отображения исходного состояния
  renderTasks();
  updateCounters();
});
