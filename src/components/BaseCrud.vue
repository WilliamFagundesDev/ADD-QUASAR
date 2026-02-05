<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const pagination = ref({
  rowsPerPage: 10 // Define o padrão para 15
})

// Props para tornar o componente dinâmico
const props = defineProps({
  title: { type: String, required: true },
  endpoint: { type: String, required: true },
  pk: { type: String, required: true },
  columns: { type: Array, required: true },
  defaultData: { type: Object, required: true },
  // Opção para remover o ID do payload ao criar (útil para auto-incremento, como em Programas/Categorias)
  removePkOnCreate: { type: Boolean, default: false }
})

const loading = ref(false)
const dialogOpen = ref(false)
const isEditing = ref(false)
const filter = ref('')
const rows = ref([])
const formData = ref({})

// --- MÉTODOS ---

const fetchData = async () => {
  try {
    loading.value = true
    const response = await api.get(props.endpoint)
    rows.value = response.data
  } catch (error) {
    notifyError('Erro ao carregar dados: ' + error)
  } finally {
    loading.value = false
  }
}

const saveEntry = async () => {
  try {
    if (isEditing.value) {
      const id = formData.value[props.pk]
      await api.put(`${props.endpoint}/${id}`, formData.value)
      notifySuccess('Registro atualizado!')
    } else {
      const payload = { ...formData.value }
      if (props.removePkOnCreate) {
        delete payload[props.pk]
      }
      await api.post(props.endpoint, payload)
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
      await api.delete(`${props.endpoint}/${id}`)
      notifySuccess('Excluído com sucesso!')
      fetchData()
    } catch (error) {
      notifyError('Erro ao excluir: ' + error)
    }
  })
}

const openForm = (item = null) => {
  isEditing.value = !!item
  // Clona o item ou usa o padrão para evitar alterar a tabela em tempo real antes de salvar
  formData.value = item ? JSON.parse(JSON.stringify(item)) : { ...props.defaultData }
  dialogOpen.value = true
}

const notifySuccess = (msg) => $q.notify({ type: 'positive', message: msg, position: 'top-right' })
const notifyError = (msg) => $q.notify({ type: 'negative', message: msg, position: 'top-right' })

// Expor método refresh para o pai se necessário
defineExpose({ fetchData })

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="apple-card shadow-apple overflow-hidden">
    <div class="row items-center justify-between q-pa-md border-bottom-apple">
        <span class="text-h6 text-weight-bold apple-text">{{ title }}</span>
        <div class="row q-gutter-sm">
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
            <q-btn 
                @click="openForm()"
                label="Adicionar" 
                icon="add" 
                unelevated 
                class="apple-btn-primary"
                size="sm"
            />
        </div>
    </div>

    <q-table
      :rows="rows"
      :columns="columns"
      :loading="loading"
      :filter="filter"
      :row-key="pk"
      
      v-model:pagination="pagination"  flat
      class="apple-table"
    >
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
            @click="deleteEntry(props.row[pk])"
          />
        </q-td>
      </template>
      
      <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </q-table>

    <q-dialog v-model="dialogOpen" persistent>
      <q-card class="apple-dialog-card">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold apple-text">
            {{ isEditing ? 'Editar' : 'Novo' }} {{ title }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-lg">
          <div class="column q-gutter-md">
            <slot name="form-fields" :formData="formData" :isEditing="isEditing"></slot>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn 
            label="Salvar" 
            color="primary" 
            unelevated 
            class="apple-btn-primary q-px-lg"
            @click="saveEntry"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style lang="scss">
/* Estilos extraídos do seu arquivo original */
.apple-card { background: white; border-radius: 18px; border: 1px solid rgba(0,0,0,0.05); }
.shadow-apple { box-shadow: 0 4px 24px rgba(0,0,0,0.04); }
.apple-btn-primary { background: #0071E3 !important; color: white; border-radius: 12px; text-transform: none; font-weight: 600; padding: 8px 20px; }
.apple-table { .q-table__top { border-bottom: 1px solid #F5F5F7; } th { font-weight: 700; color: #86868B; text-transform: uppercase; font-size: 11px; } td { color: #1D1D1F; padding: 16px; } }
.apple-search-bar { background: #F5F5F7; border-radius: 10px; padding: 0 12px; width: 200px; }
.apple-dialog-card { border-radius: 24px; width: 100%; max-width: 500px; }
.apple-input { .q-field__control { border-radius: 12px !important; background: #F5F5F7 !important; &:before { border: none !important; } } }
.border-bottom-apple { border-bottom: 1px solid #f0f0f0; }
</style>