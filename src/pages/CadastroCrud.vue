<template>
  <q-page class="bg-[#F5F5F7] q-pa-xl font-sans text-[#1D1D1F]">
    <div class="max-w-7xl mx-auto">
      
      <!-- Cabeçalho Principal (Estilo Apple Dashboard) -->
      <div class="row items-end q-mb-xl">
        <div class="col">
          <div class="text-overline text-[#86868B] q-mb-xs tracking-widest font-bold">GESTÃO DE DADOS</div>
          <h1 class="text-h3 font-bold text-[#1D1D1F] tracking-tight q-ma-none leading-none">
            {{ tabelaSelecionada }}
          </h1>
        </div>
        
        <div class="col-auto row q-gutter-sm items-center">
          <!-- Seletor de Tabela com Estilo Limpo -->
          <q-select 
            v-model="tabelaSelecionada" 
            :options="tabelas"
            outlined
            dense
            rounded
            bg-color="white"
            class="apple-select shadow-sm"
            style="min-width: 240px"
            @update:model-value="buscarDados"
          >
            <template v-slot:prepend>
              <q-icon name="folder" color="primary" size="20px" />
            </template>
          </q-select>

          <!-- Botão de Ação Principal -->
          <q-btn 
            unelevated 
            rounded 
            color="primary" 
            icon="add" 
            label="Novo Registro" 
            class="q-px-lg apple-btn-main shadow-lg"
            @click="abrirModalCriar"
          />
        </div>
      </div>

      <!-- Container de Dados (Card Estilo macOS) -->
      <div class="apple-card shadow-xl bg-white/80 rounded-[28px] overflow-hidden border border-[#D2D2D7]/30 backdrop-blur-md">
        
        <!-- Toolbar da Tabela -->
        <div class="q-pa-lg row items-center border-b border-[#F5F5F7]">
          <q-input 
            v-model="filtro" 
            placeholder="Pesquisar registros..." 
            outlined 
            dense 
            rounded
            bg-color="#F5F5F7"
            class="col-md-5 col-12 apple-search-bar"
          >
            <template v-slot:prepend>
              <q-icon name="search" size="18px" color="grey-6" />
            </template>
          </q-input>
          
          <q-space />
          
          <q-btn flat round icon="ios_share" color="grey-7" class="q-mr-sm">
            <q-tooltip>Exportar Relatório</q-tooltip>
          </q-btn>
          <q-btn flat round icon="sync" :loading="carregando" color="primary" @click="buscarDados">
            <q-tooltip>Sincronizar Banco</q-tooltip>
          </q-btn>
        </div>

        <!-- Tabela de Dados Refinada -->
        <q-table
          :rows="registros"
          :columns="colunasFormatadas"
          :loading="carregando"
          :filter="filtro"
          flat
          row-key="id"
          class="apple-table-style"
          :pagination="{ rowsPerPage: 10 }"
        >
          <!-- Cabeçalho Customizado -->
          <template v-slot:header="props">
            <q-tr :props="props" class="bg-[#F5F5F7]/40 text-[#86868B]">
              <q-th v-for="col in props.cols" :key="col.name" :props="props" class="font-bold text-[11px] tracking-widest uppercase">
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

          <!-- Células de Ação -->
          <template v-slot:body-cell-acoes="props">
            <q-td :props="props" class="text-right">
              <div class="row justify-end q-gutter-xs">
                <q-btn 
                  flat 
                  round 
                  color="blue-7" 
                  icon="edit" 
                  size="sm" 
                  class="action-btn"
                  @click="editarItem(props.row)"
                />
                <q-btn 
                  flat 
                  round 
                  color="red-7" 
                  icon="delete_outline" 
                  size="sm" 
                  class="action-btn"
                  @click="deletarItem(props.row[pkAtual])"
                />
              </div>
            </q-td>
          </template>

          <!-- Estado de Carregamento -->
          <template v-slot:loading>
            <q-inner-loading showing color="primary" />
          </template>

          <!-- Estado Sem Dados -->
          <template v-slot:no-data>
            <div class="full-width row flex-center q-pa-xl text-[#86868B] q-gutter-md">
              <q-icon size="3em" name="auto_awesome" color="grey-4" />
              <div class="text-center">
                <div class="text-weight-bold">Base de dados limpa.</div>
                <div class="text-caption">Nenhum registro encontrado em {{ tabelaSelecionada }}.</div>
              </div>
            </div>
          </template>
        </q-table>
      </div>
    </div>

    <!-- Modal de Edição (Estilo Apple Sheet) -->
    <q-dialog v-model="exibirModal" backdrop-filter="blur(20px) brightness(0.9)">
      <q-card class="apple-modal-card rounded-[32px] q-pa-xl shadow-2xl overflow-hidden" style="width: 550px; max-width: 95vw;">
        
        <q-card-section class="row items-center q-pb-xl q-pt-none">
          <div>
            <div class="text-h4 font-bold text-[#1D1D1F] tracking-tight">
              {{ editando ? 'Editar Registro' : 'Novo Registro' }}
            </div>
            <div class="text-subtitle2 text-[#86868B]">Preencha os dados da tabela {{ tabelaSelecionada }}</div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="grey-5" />
        </q-card-section>

        <q-card-section class="q-pa-none">
          <q-form @submit="salvar" class="q-gutter-y-lg">
            
            <div class="row q-col-gutter-lg">
              <div v-for="coluna in colunasForm" :key="coluna" class="col-12">
                <div class="row items-center q-mb-xs">
                  <span class="text-[13px] font-bold text-[#1D1D1F] q-ml-sm uppercase tracking-wide">{{ coluna }}</span>
                  <q-icon v-if="coluna === pkAtual" name="lock" size="14px" color="grey-4" class="q-ml-xs" />
                </div>
                <q-input 
                  v-model="form[coluna]"
                  outlined
                  dense
                  rounded
                  bg-color="#F5F5F7"
                  :placeholder="'Digitar ' + coluna + '...'"
                  :disabled="coluna === pkAtual"
                  class="apple-input-field"
                  :rules="[val => (val !== null && val !== '') || 'Obrigatório']"
                  hide-bottom-space
                />
              </div>
            </div>

            <!-- Rodapé do Modal com Botões -->
            <div class="row justify-end q-gutter-md q-mt-xl">
              <q-btn 
                label="Cancelar" 
                flat 
                rounded 
                color="grey-9" 
                v-close-popup 
                class="q-px-lg text-bold"
              />
              <q-btn 
                :label="editando ? 'Salvar Alterações' : 'Criar Registro'" 
                color="primary" 
                unelevated 
                rounded 
                type="submit" 
                class="q-px-xl text-bold apple-btn-main shadow-md"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const API_URL = 'http://localhost:3000/api';

// Configuração de PKs por tabela
const configTabelas = {
  'Categorias': 'CD_Categoria',
  'Empregados': 'CD_Empregado',
  'Programas': 'CD_Programa',
  'Metas': 'CD_Meta',
  'EmpregadosProgramas': 'CD_EmpregadoPrograma',
  'MetasCategorias': 'CD_MetaCategoria',
  'MetasEmpregados': 'CD_MetaEmpregado',
  'MetasProgramas': 'CD_MetaPrograma',
  'ResultadosMetasCategorias': 'CD_ResultadoCat',
  'ResultadosMetasEmpregados': 'CD_ResultadoEmp',
  'ResultadosMetasProgramas': 'CD_ResultadoProg'
};

// Estrutura de colunas para quando o banco está zerado (Fallback UX)
const colunasPadrao = {
  'Categorias': ['CD_Categoria', 'Nome', 'Descricao'],
  'Empregados': ['CD_Empregado', 'Nome', 'Cargo', 'Salario', 'DataAdmissao'],
  'Programas': ['CD_Programa', 'Nome', 'Descricao', 'DataInicio', 'DataFim'],
  'Metas': ['CD_Meta', 'Descricao', 'ValorAlvo', 'Prazo'],
  'EmpregadosProgramas': ['CD_EmpregadoPrograma', 'CD_Empregado', 'CD_Programa'],
  'MetasCategorias': ['CD_MetaCategoria', 'CD_Meta', 'CD_Categoria'],
  'MetasEmpregados': ['CD_MetaEmpregado', 'CD_Meta', 'CD_Empregado', 'ValorAlcancado'],
  'MetasProgramas': ['CD_MetaPrograma', 'CD_Meta', 'CD_Programa'],
  'ResultadosMetasCategorias': ['CD_ResultadoCat', 'CD_MetaCategoria', 'Valor', 'DataReferencia'],
  'ResultadosMetasEmpregados': ['CD_ResultadoEmp', 'CD_MetaEmpregado', 'Valor', 'DataReferencia'],
  'ResultadosMetasProgramas': ['CD_ResultadoProg', 'CD_MetaPrograma', 'Valor', 'DataReferencia']
};

const tabelas = Object.keys(configTabelas);
const tabelaSelecionada = ref(tabelas[1]); // Padrão: Empregados
const registros = ref([]);
const carregando = ref(false);
const filtro = ref('');
const exibirModal = ref(false);
const editando = ref(false);
const form = ref({});

const pkAtual = computed(() => configTabelas[tabelaSelecionada.value]);

// Formatação inteligente das colunas da tabela
const colunasFormatadas = computed(() => {
  const colsSource = registros.value.length > 0 
    ? Object.keys(registros.value[0]) 
    : colunasPadrao[tabelaSelecionada.value];

  if (!colsSource) return [];

  const cols = colsSource.map(k => ({
    name: k, 
    label: k, 
    field: k, 
    align: 'left', 
    sortable: true,
    classes: k === pkAtual.value ? 'text-weight-bolder text-primary' : 'text-[#424245]'
  }));
  cols.push({ name: 'acoes', label: '', align: 'right' });
  return cols;
});

// Definição dos campos que aparecem no formulário
const colunasForm = computed(() => {
  const colsSource = registros.value.length > 0 
    ? Object.keys(registros.value[0]) 
    : colunasPadrao[tabelaSelecionada.value];

  if (!colsSource) return [];
  
  // Em criação (POST), removemos a PK pois o banco gera (IDENTITY)
  return editando.value ? colsSource : colsSource.filter(c => c !== pkAtual.value);
});

// Requisição de busca de dados
const buscarDados = async () => {
  carregando.value = true;
  try {
    const res = await axios.get(`${API_URL}/GET/${tabelaSelecionada.value}`);
    registros.value = Array.isArray(res.data) ? res.data : [res.data];
  } catch (err) {
    registros.value = [];
    if (err.response?.status !== 404) {
      $q.notify({ 
        icon: 'error', 
        color: 'negative', 
        message: err, 
        position: 'top-right' 
      });
    }
  } finally {
    carregando.value = false;
  }
};

const abrirModalCriar = () => {
  editando.value = false;
  form.value = {};
  colunasForm.value.forEach(col => form.value[col] = '');
  exibirModal.value = true;
};

const editarItem = (item) => {
  editando.value = true;
  form.value = { ...item };
  exibirModal.value = true;
};

const salvar = async () => {
  try {
    const acao = editando.value ? 'PUT' : 'POST';
    const id = editando.value ? `/${form.value[pkAtual.value]}` : '';
    await axios.post(`${API_URL}/${acao}/${tabelaSelecionada.value}${id}`, form.value);
    
    $q.notify({ 
      icon: 'verified', 
      color: 'positive', 
      message: `${editando.value ? 'Registro atualizado' : 'Novo registro criado'} com sucesso!`, 
      position: 'top-right',
      classes: 'apple-notif'
    });
    
    exibirModal.value = false;
    buscarDados();
  } catch (err) {
    $q.notify({ type: 'negative', message: err});
  }
};

const deletarItem = (id) => {
  $q.dialog({
    title: 'Confirmar Remoção',
    message: 'Este registro será apagado permanentemente. Deseja prosseguir?',
    ok: { label: 'Eliminar', color: 'red-7', rounded: true, unelevated: true, class: 'q-px-lg' },
    cancel: { label: 'Manter', flat: true, color: 'grey-9', class: 'q-px-lg' },
    class: 'apple-confirm-dialog rounded-[28px]'
  }).onOk(async () => {
    try {
      await axios.post(`${API_URL}/DELETE/${tabelaSelecionada.value}/${id}`);
      $q.notify({ icon: 'delete_sweep', color: 'dark', message: 'Registro removido da base.' });
      buscarDados();
    } catch (err) {
      $q.notify({ type: 'negative', message: err });
    }
  });
};

onMounted(buscarDados);
</script>

<style>
/* --- Linguagem Visual Apple --- */

.font-sans {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* Botões Apple */
.apple-btn-main {
  background: #007AFF !important;
  font-weight: 700;
  letter-spacing: -0.01em;
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.apple-btn-main:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}

/* Campos de Input e Select */
.apple-select .q-field__control,
.apple-search-bar .q-field__control,
.apple-input-field .q-field__control {
  border: none !important;
  transition: background 0.3s ease;
}
.apple-input-field .q-field__control:focus-within {
  background: #E8E8ED !important;
}

/* Estilo da Tabela macOS */
.apple-table-style .q-table__card {
  background: transparent !important;
}
.apple-table-style th {
  padding: 18px 16px !important;
  border-bottom: 1px solid #F5F5F7 !important;
}
.apple-table-style td {
  padding: 18px 16px !important;
  border-bottom: 1px solid #F5F5F7 !important;
  font-size: 14px;
}
.apple-table-style tr:hover {
  background: rgba(0, 122, 255, 0.04) !important;
}

/* Botões de Ação na Tabela */
.action-btn {
  transition: all 0.2s ease;
  background: transparent;
}
.action-btn:hover {
  background: rgba(0, 0, 0, 0.04);
}

/* Modais e Efeitos Blur */
.apple-modal-card {
  background: rgba(255, 255, 255, 0.92) !important;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.apple-notif {
  border-radius: 18px !important;
  backdrop-filter: blur(10px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.12) !important;
}

/* Scrollbar Customizada */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #D2D2D7;
  border-radius: 10px;
}
</style>