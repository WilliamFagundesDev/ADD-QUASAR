<script setup>
import { ref } from 'vue'

// Importe os componentes separados (Crie os arquivos para cada um!)
import ProgramasTab from 'components/cadastros/ProgramasTab.vue' 
import CategoriasTab from 'components/cadastros/CategoriasTab.vue'
import EmpregadosTab from 'components/cadastros/EmpregadosTab.vue'
import MetasTab from 'components/cadastros/MetasTab.vue'

const tab = ref('programas')
</script>

<template>
  <q-page class="apple-bg q-pa-lg">
    <div class="max-width-container mx-auto">
      
      <div class="q-mb-xl">
        <h1 class="text-h4 text-weight-bolder apple-text q-ma-none">Gestão ADD</h1>
        <p class="text-subtitle1 text-grey-7 q-mt-xs">Administração completa do banco de dados SARAH</p>
      </div>

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

      <q-tab-panels v-model="tab" animated class="bg-transparent">
        
        <q-tab-panel name="programas" class="q-pa-none">
          <ProgramasTab />
        </q-tab-panel>

        <q-tab-panel name="categorias" class="q-pa-none">
          <CategoriasTab />
        </q-tab-panel>

        <q-tab-panel name="empregados" class="q-pa-none">
          <EmpregadosTab />
        </q-tab-panel>

        <q-tab-panel name="metas" class="q-pa-none">
          <MetasTab />
        </q-tab-panel>

      </q-tab-panels>

    </div>
  </q-page>
</template>

<style lang="scss">
.apple-bg { background-color: #F5F5F7; min-height: 100vh; }
.max-width-container { max-width: 1100px; }
.mx-auto { margin-left: auto; margin-right: auto; }
.apple-text { color: #1D1D1F; letter-spacing: -0.5px; }
</style>