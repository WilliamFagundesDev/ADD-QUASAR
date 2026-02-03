import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Criamos uma instância do axios apontando para sua API Node
const api = axios.create({ baseURL: 'http://localhost:3000' })

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }