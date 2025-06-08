<script setup lang="ts">
  import {useTreeStore} from '../store'
  import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
  import { TreeDataModule } from 'ag-grid-enterprise';
  import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component
  import { ref, computed } from 'vue'
  import type TreeType from '../models/index.ts';

  const modules = [AllCommunityModule]
  const treeStore = useTreeStore()

  ModuleRegistry.registerModules([AllCommunityModule, TreeDataModule]);
  
  const colDefs = ref([
        {headerName: 'Наименование', field: "label" },
        
    ]);

  const colDefsEdit = ref([
        {headerName: 'Наименование', field: "label", editable: true, },
        {
          headerName: '',
          field: 'id',
          cellRenderer: AddButtonRenderer,
        },
        {
          headerName: '',
          field: 'id',
          cellRenderer: DeleteButtonRenderer,
        },
        
    ]);

  function DeleteButtonRenderer(params: any) {
  const button = document.createElement('button')
  button.innerText = '❌'
  button.className = 'ag-btn'
  button.addEventListener('click', () => treeStore.removeItem(params.value))
  return button
  }

  function AddButtonRenderer(params: any) {
    const button = document.createElement('button')
    button.innerText = '➕'
    button.className = 'ag-btn'
    button.addEventListener('click', () => treeStore.addItem(params.value))
    return button
  }


function buildTreeData(data: TreeType[]) {
  const getPath = (id: string | number): string[] => {
    const item = data.find(i => String(i.id) === String(id));
    if (!item) return [];
    if (!item.parent) return [item.label];
    return [...getPath(item.parent), item.label];
  }

  return data.map(item => ({
    ...item,
    path: getPath(item.id)
  }));
}



const rowData = computed(() => 
  buildTreeData(treeStore.treeObject).map(item => ({
    ...item,
    id: Number(item.id)
  }))
)

const changeMode = () => {
  treeStore.status === 'Редактирование' ? treeStore.status = 'Просмотр' : treeStore.status = 'Редактирование'
}

</script>

<template>
  <button @click="changeMode">Режим: {{ treeStore.status }}</button>
  <div class="ag-theme-alpine" style="height: 600px; width: 100%; border: 1px solid #ccc">
      <AgGridVue
        :rowData="rowData"
        :columnDefs="treeStore.status === 'Редактирование' ? colDefsEdit : colDefs"
        :modules="modules"
        class="ag-theme-alpine"
        :treeData="true"
        :getDataPath="(data) => data.path"
        :autoGroupColumnDef="{headerName: 'Категория', field: 'label' }"
        rowSelection="single"
        style="width: 100%; height: 600px;"
        theme="legacy"
      />
  </div>
  
</template>

<style scoped>

</style>
