<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title> Análise de Desenvolvimento Sarah </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered content-class="bg-grey-1">
      <div class="column full-height no-wrap">
        
        <div class="col-auto">
          <q-list>
            <q-item-label header> Menu Lateral </q-item-label>
            <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
          </q-list>
        </div>

        <div class="col"></div>

        <div class="col-auto q-pa-lg text-center">
          <q-img
            src="~assets/LogoSARAH_Laranja.png" 
            style="max-width: 120px"
          />
          <div class="text-caption q-mt-sm text-grey-7">Versão 0.0.1</div>
        </div>

      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped>
/* Define que o container ocupe exatamente a altura da tela, sem transbordar */
.full-height {
  height: 100%;
  overflow: hidden; /* Garante que não apareçam barras de rolagem */
}
</style>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Início',
    caption: 'Volte para Home!',
    icon: 'home', 
    link: '/', 
  },
  {
    title: 'Cadastro',
    caption: 'Cadastre as informações aqui!',
    icon: 'add', 
    link: '/cadastro', 
  },
  {
    title: 'Informática',
    caption: 'Abertura de chamados (Informática)',
    icon: 'support_agent',
    link: 'https://riointranet.sarah.br/Helpdesk',
    target: '_blank', // Para abrir em uma nova Aba
  },
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>