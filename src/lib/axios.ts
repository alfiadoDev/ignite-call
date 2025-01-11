import axios from 'axios'

export const api = axios.create({
  baseURL: '/api', // colocamos assim pk o front e back estao juntos e axios vai entender
})
