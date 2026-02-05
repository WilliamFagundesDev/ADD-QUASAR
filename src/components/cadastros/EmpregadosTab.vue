<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'
import BaseCrud from 'components/BaseCrud.vue'

const config = {
  title: 'Empregados',
  endpoint: '/empregados',
  pk: 'NR_Matricula',
  defaultData: { NR_Matricula: null, NM_Pessoa: '', CD_Categoria: null, CD_Pessoa: '' },
  columns: [
    { name: 'NR_Matricula', label: 'Matrícula', field: 'NR_Matricula', align: 'left', sortable: true },
    { name: 'NM_Pessoa', label: 'Nome', field: 'NM_Pessoa', align: 'left', sortable: true },
    { name: 'CD_Categoria', label: 'Categoria', field: 'CD_Categoria', align: 'left', sortable: true },
    { name: 'CD_Pessoa', label: 'Código Pessoa', field: 'CD_Pessoa', align: 'left' },
    { name: 'actions', label: 'Ações', field: 'actions', align: 'center' }
  ]
}

const listaCategorias = ref([])

// Função auxiliar para encontrar o nome baseada no ID
const getNomeCategoria = (id) => {
  if (!id) return '-'
  const cat = listaCategorias.value.find(c => c.CD_Categoria === id)
  return cat ? cat.DS_Categoria : id // Retorna a descrição ou o próprio ID se não achar
}

onMounted(async () => {
  try {
    const { data } = await api.get('/categorias')
    listaCategorias.value = data
  } catch (e) {
    console.error('Erro ao carregar categorias', e)
  }
})
</script>

<template>
  <BaseCrud
    :title="config.title"
    :endpoint="config.endpoint"
    :pk="config.pk"
    :columns="config.columns"
    :defaultData="config.defaultData"
  >
    <template #form-fields="{ formData, isEditing }">
      <q-input 
        v-model.number="formData.NR_Matricula" 
        label="Número de Matrícula" 
        filled 
        type="number" 
        :disable="isEditing" 
        class="apple-input"
      />
      
      <q-input 
        v-model="formData.NM_Pessoa" 
        label="Nome Completo" 
        filled 
        class="apple-input" 
      />
      
      <q-input 
        v-model="formData.CD_Pessoa" 
        label="Código da Pessoa" 
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
        label="Categoria do Colaborador"
        filled
        class="apple-input"
      />
    </template>

    <template #body-cell-NR_Matricula="props">
      <q-td :props="props">
        <span class="text-weight-bold text-blue-9">#{{ props.value }}</span>
      </q-td>
    </template>

    <template #body-cell-CD_Categoria="props">
      <q-td :props="props">
        <q-badge color="grey-3" text-color="black" class="q-pa-sm">
            {{ getNomeCategoria(props.value) }}
        </q-badge>
      </q-td>
    </template>

  </BaseCrud>
</template>