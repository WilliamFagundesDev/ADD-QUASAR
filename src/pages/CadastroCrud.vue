<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// --- ESTADO GLOBAL ---
const tab = ref('programas') // Aba ativa
const loading = ref(false)
const dialogOpen = ref(false)
const isEditing = ref(false)
const filter = ref('')
const rows = ref([])

// Dados Auxiliares (Para Selects/Lookups)
const listaCategorias = ref([])
const listaProgramas = ref([])

// Objeto de formulário dinâmico
const formData = ref({})

// --- CONFIGURAÇÃO DAS ENTIDADES ---
const entityConfig = {
  programas: {
    title: 'Programas',
    endpoint: '/programas',
    pk: 'CD_Programa',
    columns: [
      { name: 'CD_Programa', label: 'Código', field: 'CD_Programa', align: 'left', sortable: true },
      { name: 'DS_Programa', label: 'Descrição', field: 'DS_Programa', align: 'left', sortable: true },
      { name: 'actions', label: 'Ações', field: 'actions', align: 'center' }
    ],
    defaultData: { DS_Programa: '' }
  },
  categorias: {
    title: 'Categorias',
    endpoint: '/categorias',
    pk: 'CD_Categoria',
    columns: [
      { name: 'CD_Categoria', label: 'Código', field: 'CD_Categoria', align: 'left', sortable: true },
      { name: 'DS_Categoria', label: 'Descrição', field: 'DS_Categoria', align: 'left', sortable: true },
      { name: 'actions', label: 'Ações', field: 'actions', align: 'center' }
    ],
    defaultData: { DS_Categoria: '' }
  },
    empregados: {
    title: 'Empregados',
    endpoint: '/empregados',
    pk: 'NR_Matricula',
    columns: [
      { name: 'NR_Matricula', label: 'Matrícula', field: 'NR_Matricula', align: 'left', sortable: true },
      { name: 'NM_Pessoa', label: 'Nome', field: 'NM_Pessoa', align: 'left', sortable: true },
      { name: 'CD_Categoria', label: 'Cat.', field: 'CD_Categoria', align: 'left' },
      { name: 'CD_Pessoa', label: 'Código Pessoa', field: 'CD_Pessoa', align: 'left' },
      { name: 'actions', label: 'Ações', field: 'actions', align: 'center' }
    ],
    defaultData: { NR_Matricula: null, NM_Pessoa: '', CD_Categoria: null, CD_Pessoa: '' }
  },
  metas: {
    title: 'Metas das Categorias',
    endpoint: '/metas-categorias',
    pk: 'CD_MetaCategoria',
    columns: [
      { name: 'CD_MetaCategoria', label: 'ID', field: 'CD_MetaCategoria', align: 'left' },
      { name: 'Ano', label: 'Ano', field: 'Ano', align: 'left' },
      { name: 'CD_Meta', label: 'Meta', field: 'CD_Meta', align: 'left' },
      { name: 'CD_Categoria', label: 'Cat.', field: 'CD_Categoria', align: 'left' },
      { name: 'actions', label: 'Ações', field: 'actions', align: 'center' }
    ],
    defaultData: { CD_Meta: null, CD_Categoria: null, Ano: new Date().getFullYear(), ValorAbsoluto: 0 }
  }
}

const currentConfig = computed(() => entityConfig[tab.value])

// --- MÉTODOS DE API ---

const fetchData = async () => {
  try {
    loading.value = true
    const response = await api.get(currentConfig.value.endpoint)
    rows.value = response.data
  } catch (error) {
    notifyError('Erro ao carregar dados' + error)
  } finally {
    loading.value = false
  }
}

// Busca dados para os selects (Categorias e Programas)
const fetchAuxData = async () => {
  try {
    const [catRes, progRes] = await Promise.all([
      api.get('/categorias'),
      api.get('/programas')
    ])
    listaCategorias.value = catRes.data
    listaProgramas.value = progRes.data
  } catch (e) { console.error('Erro ao carregar auxiliares'+ e)}
}

const saveEntry = async () => {
  try {
    const config = currentConfig.value
    if (isEditing.value) {
      const id = formData.value[config.pk]
      await api.put(`${config.endpoint}/${id}`, formData.value)
      notifySuccess('Registro atualizado!')
    } else {
      const payload = { ...formData.value }
      // ADICIONE 'empregados' AQUI:
      // Isso faz o banco gerar o "numero sozinho" para a matrícula
      if (['programas', 'categorias'].includes(tab.value)) {
        delete payload[config.pk]
      }
      await api.post(config.endpoint, payload)
      notifySuccess('Registro criado!')
    }
    dialogOpen.value = false
    fetchData()
  } catch (error) {
    notifyError('Erro ao salvar: ' + error)
  }
}

const deleteEntry = (id) => {
  $q.dialog({
    title: 'Confirmar Exclusão',
    message: 'Deseja realmente remover este registro?',
    cancel: true,
    persistent: true,
    ok: { color: 'negative', label: 'Excluir', flat: true }
  }).onOk(async () => {
    try {
      await api.delete(`${currentConfig.value.endpoint}/${id}`)
      notifySuccess('Excluído com sucesso!')
      fetchData()
    } catch (error) {
      notifyError('Erro ao excluir (Pode haver dependências)' + error)
    }
  })
}

// --- UTILITÁRIOS ---

const openForm = (item = null) => {
  isEditing.value = !!item
  formData.value = item ? { ...item } : { ...currentConfig.value.defaultData }
  dialogOpen.value = true
}

const notifySuccess = (msg) => $q.notify({ type: 'positive', message: msg, position: 'top-right' })
const notifyError = (msg) => $q.notify({ type: 'negative', message: msg, position: 'top-right' })

// Observar mudança de aba
watch(tab, () => {
  filter.value = ''
  fetchData()
})

onMounted(() => {
  fetchData()
  fetchAuxData()
})
</script>

<template>
  <q-page class="apple-bg q-pa-lg">
    <div class="max-width-container mx-auto">
      
      <!-- Cabeçalho macOS Style -->
      <div class="row items-center justify-between q-mb-xl">
        <div>
          <h1 class="text-h4 text-weight-bolder apple-text q-ma-none">Gestão ADD</h1>
          <p class="text-subtitle1 text-grey-7 q-mt-xs">Administração completa do banco de dados SARAH</p>
        </div>
        <q-btn 
          @click="openForm()"
          label="Adicionar Novo" 
          icon="add" 
          unelevated 
          class="apple-btn-primary"
        />
      </div>

      <!-- Sistema de Abas Apple -->
      <div class="apple-card q-mb-lg">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="left"
          narrow-indicator
        >
          <q-tab name="programas" label="Programas" />
          <q-tab name="categorias" label="Categorias" />
          <q-tab name="empregados" label="Empregados" />
          <q-tab name="metas" label="Metas" />
        </q-tabs>
      </div>

      <!-- Tabela Principal -->
      <div class="apple-card shadow-apple overflow-hidden">
        <q-table
          :rows="rows"
          :columns="currentConfig.columns"
          :loading="loading"
          :filter="filter"
          row-key="pk"
          flat
          class="apple-table"
        >
          <!-- Barra de Busca -->
          <template v-slot:top-right>
            <q-input 
              v-model="filter" 
              placeholder="Buscar..." 
              borderless 
              dense 
              class="apple-search-bar"
            >
              <template v-slot:append>
                <q-icon name="search" size="xs" />
              </template>
            </q-input>
          </template>

          <!-- Slot de Ações -->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="text-center">
              <q-btn 
                flat round size="sm" 
                icon="edit" 
                color="blue-7" 
                @click="openForm(props.row)"
                class="q-mr-xs"
              />
              <q-btn 
                flat round size="sm" 
                icon="delete" 
                color="red-5" 
                @click="deleteEntry(props.row[currentConfig.pk])"
              />
            </q-td>
          </template>

          <!-- Customização de colunas específicas (ex: Matrícula) -->
          <template v-slot:body-cell-NR_Matricula="props">
            <q-td :props="props">
              <span class="text-weight-bold text-blue-9">#{{ props.value }}</span>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>

    <!-- Modal de Formulário (Dialog) -->
    <q-dialog v-model="dialogOpen" persistent>
      <q-card class="apple-dialog-card">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold apple-text">
            {{ isEditing ? 'Editar' : 'Novo' }} {{ currentConfig.title }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-lg">
          <div class="column q-gutter-md">
            
            <!-- FORMULÁRIO DINÂMICO BASEADO NA ABA -->

            <!-- Campos para Programas / Categorias -->
            <template v-if="tab === 'programas'">
              <q-input v-model="formData.DS_Programa" label="Descrição do Programa" filled class="apple-input" />
            </template>

            <template v-if="tab === 'categorias'">
              <q-input v-model="formData.DS_Categoria" label="Descrição da Categoria" filled class="apple-input" />
            </template>

            <!-- Campos para Empregados -->
            <template v-if="tab === 'empregados'">
            <q-input 
              v-model.number="formData.NR_Matricula" 
              label="Número de Matrícula" 
              filled 
              type="number" 
              :disable="isEditing" 
              class="apple-input"
            />
            
            <q-input v-model="formData.CD_Pessoa" label="Código da Pessoa" filled class="apple-input" />
            
            <q-input v-model="formData.NM_Pessoa" label="Nome Completo" filled class="apple-input" />
            
            <q-select
              v-model="formData.CD_Categoria"
              :options="listaCategorias"
              option-label="DS_Categoria"
              option-value="CD_Categoria"
              emit-value
              map-options
              label="Categoria do Colaborador"
              filled
              class="apple-input"
            />
          </template>

            <!-- Campos para Metas -->
            <template v-if="tab === 'metas'">
              <q-input v-model.number="formData.Ano" label="Ano Fiscal" filled type="number" class="apple-input" />
              <q-select
                v-model="formData.CD_Meta"
                :options="listaProgramas"
                option-label="DS_Programa"
                option-value="CD_Programa"
                emit-value
                map-options
                label="Programa (Meta)"
                filled
                class="apple-input"
              />
              <q-select
                v-model="formData.CD_Categoria"
                :options="listaCategorias"
                option-label="DS_Categoria"
                option-value="CD_Categoria"
                emit-value
                map-options
                label="Categoria Vinculada"
                filled
                class="apple-input"
              />
              <q-input v-model.number="formData.ValorAbsoluto" label="Valor Absoluto" filled type="number" class="apple-input" />
            </template>

          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn 
            label="Salvar Alterações" 
            color="primary" 
            unelevated 
            class="apple-btn-primary q-px-lg"
            @click="saveEntry"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<style lang="scss">
.apple-bg {
  background-color: #F5F5F7;
  min-height: 100vh;
}

.max-width-container {
  max-width: 1100px;
}

.apple-text {
  color: #1D1D1F;
  letter-spacing: -0.5px;
}

/* Card macOS */
.apple-card {
  background: white;
  border-radius: 18px;
  border: 1px solid rgba(0,0,0,0.05);
}

.shadow-apple {
  box-shadow: 0 4px 24px rgba(0,0,0,0.04);
}

/* Botão Primário Apple */
.apple-btn-primary {
  background: #0071E3 !important;
  color: white;
  border-radius: 12px;
  text-transform: none;
  font-weight: 600;
  padding: 8px 20px;
}

/* Tabela Apple */
.apple-table {
  .q-table__top { border-bottom: 1px solid #F5F5F7; }
  th { font-weight: 700; color: #86868B; text-transform: uppercase; font-size: 11px; }
  td { color: #1D1D1F; padding: 16px; }
}

.apple-search-bar {
  background: #F5F5F7;
  border-radius: 10px;
  padding: 0 12px;
  width: 250px;
}

/* Dialog & Inputs */
.apple-dialog-card {
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
}

.apple-input {
  .q-field__control {
    border-radius: 12px !important;
    background: #F5F5F7 !important;
    &:before { border: none !important; }
  }
}

.mx-auto { margin-left: auto; margin-right: auto; }
</style>