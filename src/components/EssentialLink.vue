<template>
  <!-- Adicionamos a propriedade 'exact' para que o link só fique ativo (azul) 
       quando a rota for exatamente igual ao link definido. -->
  <q-item
    clickable
    v-ripple
    exact
    :tag="isExternal ? 'a' : 'div'"
    :to="isExternal ? undefined : props.link"
    :href="isExternal ? props.link : undefined"
    :target="isExternal ? props.target : undefined"
  >
    <q-item-section v-if="props.icon" avatar>
      <q-icon :name="props.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ props.title }}</q-item-label>
      <q-item-label caption>{{ props.caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    default: '',
  },
  link: {
    type: String,
    default: '#',
  },
  icon: {
    type: String,
    default: '',
  },
  target: {
    type: String,
    default: '_self',
  },
})

// Verifica se o link começa com http para decidir se é externo
const isExternal = computed(() => {
  return typeof props.link === 'string' && props.link.startsWith('http')
})
</script>