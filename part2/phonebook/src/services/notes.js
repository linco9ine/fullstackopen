import axios from 'axios';
const baseUrl = "/api/persons";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then(res => res.data);
}

const create = (data) => {
  const request = axios.post(baseUrl, data);
  return request.then(res => res.data);
}

const deletePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
}

const update = (id, data) => {
  const request = axios.put(`${baseUrl}/${id}`, data);
  return request.then(res => res.data);
}

export default { getAll, create, deletePerson, update };
