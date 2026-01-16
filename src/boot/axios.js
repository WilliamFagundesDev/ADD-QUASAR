import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Criamos uma instância do axios com a URL da sua API Node
const api = axios.create({ baseURL: 'http://localhost:3000' })

export default boot(({ app }) => {
  // Torna o axios disponível dentro dos componentes via this.$axios ou this.$api
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }