const BASE_URL = 'http://localhost:8080/v1';

function getHeaders() {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function request(method, path, body) {
  const options = { method, headers: getHeaders() };
  if (body !== undefined) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);

  if (res.status === 204) return null;

  const text = await res.text();

  if (!res.ok) {
    let mensagem = `Erro ${res.status}`;

    try {
      const apiError = JSON.parse(text);
      if (apiError.message) mensagem = apiError.message;
    } catch {
      if (text) mensagem = text;
    }

    if (res.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return;
    }

    if (res.status === 403) {
      mensagem = 'Você não tem permissão para realizar esta ação.';
    }

    const err = new Error(mensagem);
    err.status = res.status;
    throw err;
  }

  return text ? JSON.parse(text) : null;
}

export const api = {
  auth: {
    login: (data) => request('POST', '/auth/login', data),
    register: (data) => request('POST', '/auth/register', data),
  },

  apiarios: {
    listar: (page = 0, size = 8) =>
      request('GET', `/apiaries?page=${page}&size=${size}`),
    criar: (data) => request('POST', '/apiaries', data),
    deletar: (id) => request('DELETE', `/apiaries/${id}`),
  },

  colmeias: {
    listar: (apiarioId, page = 0, size = 8) =>
      request('GET', `/apiaries/${apiarioId}/hives?page=${page}&size=${size}`),
    criar: (apiarioId, data) => request('POST', `/apiaries/${apiarioId}/hives`, data),
    deletar: (id) => request('DELETE', `/hives/${id}`),
  },

  inspecoes: {
    listar: (colmeiaId, page = 0, size = 8) =>
      request('GET', `/hives/${colmeiaId}/inspections?page=${page}&size=${size}`),
    criar: (colmeiaId, data) => request('POST', `/hives/${colmeiaId}/inspection`, data),
    deletar: (id) => request('DELETE', `/inspections/${id}`),
  },
};
