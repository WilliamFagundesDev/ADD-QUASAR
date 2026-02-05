<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <q-page class="apple-bg flex flex-center column">
    <div class="text-center q-pa-md animated fadeIn">
      
      <div class="q-mb-lg relative-position inline-block">
        <q-icon name="construction" size="100px" class="text-grey-4" />
        <q-icon name="warning" size="40px" color="orange-5" class="absolute-bottom-right" style="right: -10px" />
      </div>
      
      <h1 class="text-h3 text-weight-bolder apple-text q-mb-sm q-mt-none">
        Em Obras
      </h1>
      
      <p class="text-subtitle1 text-grey-7 q-mb-xl" style="max-width: 450px; margin-left: auto; margin-right: auto;">
        Estamos construindo algo incrível aqui.<br>
        Esta funcionalidade estará disponível na próxima atualização do sistema SARAH.
      </p>

      <q-btn 
        label="Voltar para o Início" 
        icon="arrow_back"
        no-caps
        unelevated 
        class="apple-btn-primary q-px-xl q-py-sm shadow-1"
        @click="router.push('/')"
      />
      
    </div>
  </q-page>
</template>

<style scoped lang="scss">
/* Reutilizando suas variáveis de estilo */
.apple-bg {
  background-color: #F5F5F7;
}

.apple-text {
  color: #1D1D1F;
  letter-spacing: -1px;
}

/* Botão estilo iOS */
.apple-btn-primary {
  background: #0071E3 !important;
  color: white;
  border-radius: 99px; /* Mais arredondado para ações principais */
  font-weight: 500;
  font-size: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background: #0077ED !important;
    box-shadow: 0 4px 12px rgba(0, 113, 227, 0.3);
  }

  &:active {
    transform: scale(0.96);
  }
}

/* Animação suave de entrada */
.animated {
  animation-duration: 0.8s;
  animation-fill-mode: both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>