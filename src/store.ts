import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type TreeType from './models/index.ts';



export const useTreeStore = defineStore('tree', () => {
  const treeObject = ref<TreeType[]>([
    { id: 1, parent: null, label: 'Айтем 1' },
    { id: '2', parent: 1, label: 'Айтем 2' },
    { id: 3, parent: 1, label: 'Айтем 3' },
    { id: 4, parent: 2, label: 'Айтем 4' },
    { id: 5, parent: 2, label: 'Айтем 5' },
    { id: 6, parent: 2, label: 'Айтем 6' },
    { id: 7, parent: 4, label: 'Айтем 7' },
    { id: 8, parent: 4, label: 'Айтем 8' },
  ])
  const status = ref<string>('Редактирование')

  function removeItem(id: string | number) {
    console.log(id)
    const idsToRemove = new Set<string | number>()

    function collectChildrenIds(parentId: string | number) {
      idsToRemove.add(parentId)
      treeObject.value.forEach(item => {
        if (item.parent === parentId) {
          collectChildrenIds(item.id)
        }
      })
    }

    collectChildrenIds(id)

    treeObject.value = treeObject.value.filter(item => !idsToRemove.has(item.id))
  }

  function addItem(parentId: string | number) {
    // Добавляем новый элемент с новым ID и parent = parentId
    const maxId = treeObject.value.reduce((max, item) => {
      const numericId = Number(item.id)
      return numericId > max ? numericId : max
    }, 0)

    const newItem: TreeType = {
      id: maxId + 1,
      parent: parentId,
      label: `Новый элемент ${maxId + 1}`
    }

    treeObject.value.push(newItem)
  }


    return {
    treeObject,
    status,
    removeItem,
    addItem
  }
 
  

  
});

    
