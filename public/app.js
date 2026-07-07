const loginForm = document.querySelector('#login-form');
const dashboard = document.querySelector('#dashboard');
const formError = document.querySelector('#form-error');
const userName = document.querySelector('#user-name');
const userRole = document.querySelector('#user-role');
const taskList = document.querySelector('#task-list');
const logoutButton = document.querySelector('#logout-button');
const connectionStatus = document.querySelector('#connection-status');

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    },
    ...options
  });

  const hasBody = response.headers.get('content-length') !== '0';
  const data = hasBody ? await response.json().catch(() => ({})) : {};

  if (!response.ok) {
    throw new Error(data.error ?? 'Request failed');
  }

  return data;
}

function showLogin(errorMessage = '') {
  loginForm.classList.remove('hidden');
  dashboard.classList.add('hidden');
  connectionStatus.textContent = 'Offline';
  formError.textContent = errorMessage;
}

async function showDashboard(user) {
  loginForm.classList.add('hidden');
  dashboard.classList.remove('hidden');
  connectionStatus.textContent = 'Online';
  userName.textContent = user.name;
  userRole.textContent = user.role;

  const { tasks } = await requestJson('/api/tasks');
  taskList.replaceChildren(
    ...tasks.map((task) => {
      const item = document.createElement('li');
      item.innerHTML = `<span>${task.label}</span><strong>${task.status}</strong>`;
      return item;
    })
  );
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  formError.textContent = '';

  const formData = new FormData(loginForm);
  const credentials = {
    username: formData.get('username'),
    password: formData.get('password')
  };

  try {
    const { user } = await requestJson('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    await showDashboard(user);
    loginForm.reset();
  } catch (error) {
    showLogin(error.message);
  }
});

logoutButton.addEventListener('click', async () => {
  await fetch('/api/logout', {
    method: 'POST',
    credentials: 'same-origin'
  });
  showLogin();
});

requestJson('/api/me')
  .then(({ user }) => showDashboard(user))
  .catch(() => showLogin());
