import httpInstance from "../../utils/http";

export function addNewUsers(data) {
  return httpInstance.post('/users/add', data)
}

export function getTaskList(data) {
  return httpInstance.get('/task/list', data)
}

export function getUsersByPhone(data) {
  return httpInstance.post('/users/getUserByPhone', data)
}

export function updateUsersInfo(data) {
  return httpInstance.post('/users/updateInfo', data)
}


export function addNewTask(data) {
  return httpInstance.post('/task/add', data)
}