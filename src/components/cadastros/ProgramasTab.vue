<script setup>
import BaseCrud from 'components/BaseCrud.vue'

const config = {
  title: 'Programas',
  endpoint: '/programas',
  pk: 'CD_Programa',
  // Remove o ID na criação para o banco gerar o sequencial (Identity)
  removePkOnCreate: true,
  
  defaultData: { CD_Programa: null, DS_Programa: '' },
  
  columns: [
    { name: 'CD_Programa', label: 'Código', field: 'CD_Programa', align: 'left', sortable: true, style: 'width: 120px' },
    { name: 'DS_Programa', label: 'Descrição do Programa', field: 'DS_Programa', align: 'left', sortable: true },
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
        v-model="formData.CD_Programa" 
        label="Código" 
        filled 
        disable
        class="apple-input"
      />
      
      <q-input 
        v-model="formData.DS_Programa" 
        label="Descrição do Programa" 
        filled 
        :rules="[val => !!val || 'A descrição é obrigatória']"
        lazy-rules
        class="apple-input" 
      />

    </template>

    <template #body-cell-CD_Programa="props">
      <q-td :props="props">
        <q-badge color="purple-1" text-color="purple-10" class="text-weight-bold q-pa-xs">
           {{ props.value }}
        </q-badge>
      </q-td>
    </template>

  </BaseCrud>
</template>