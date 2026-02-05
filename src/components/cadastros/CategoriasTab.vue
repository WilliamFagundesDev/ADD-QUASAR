<script setup>
import BaseCrud from 'components/BaseCrud.vue'

const config = {
  title: 'Categorias',
  endpoint: '/categorias',
  pk: 'CD_Categoria',
  // IMPORTANTE: Isso garante que o ID não seja enviado na criação (POST),
  // permitindo que o banco de dados gere o número sequencial (auto-increment).
  removePkOnCreate: true,
  
  defaultData: { CD_Categoria: null, DS_Categoria: '' },
  
  columns: [
    { name: 'CD_Categoria', label: 'Código', field: 'CD_Categoria', align: 'left', sortable: true, style: 'width: 120px' },
    { name: 'DS_Categoria', label: 'Descrição', field: 'DS_Categoria', align: 'left', sortable: true },
    { name: 'actions', label: 'Ações', field: 'actions', align: 'center', style: 'width: 130px' }
  ]
}
</script>

<template>
  <BaseCrud
    :title="config.title"
    :endpoint="config.endpoint"
    :pk="config.pk"
    :columns="config.columns"
    :defaultData="config.defaultData"
    :removePkOnCreate="config.removePkOnCreate"
  >
    <template #form-fields="{ formData, isEditing }">
      
      <q-input 
        v-if="isEditing"
        v-model="formData.CD_Categoria" 
        label="Código" 
        filled 
        disable
        class="apple-input"
      />
      
      <q-input 
        v-model="formData.DS_Categoria" 
        label="Descrição da Categoria" 
        filled 
        :rules="[val => !!val || 'A descrição é obrigatória']"
        lazy-rules
        class="apple-input" 
      />

    </template>

    <template #body-cell-CD_Categoria="props">
      <q-td :props="props">
        <q-badge color="grey-3" text-color="black" class="text-weight-bold">
           {{ props.value }}
        </q-badge>
      </q-td>
    </template>

  </BaseCrud>
</template>