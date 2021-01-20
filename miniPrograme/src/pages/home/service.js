import httpInstance from "../../utils/http";

export function LoginGetToken(data) {
  return httpInstance.post('/app/login', data)
}

export function getTaskList(data) {
  return httpInstance.get('/task/list', data)
}
