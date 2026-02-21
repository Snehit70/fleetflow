<template>
  <div class="table-container">
    <table class="table">
      <thead class="table-header">
        <tr>
          <th v-for="i in columns" :key="i" class="table-header-cell">
            <div class="skeleton skeleton-shimmer h-4 w-24 rounded" />
          </th>
        </tr>
      </thead>
      <tbody class="table-body">
        <tr v-for="row in rows" :key="row" class="table-row">
          <td v-for="col in columns" :key="col" class="table-cell">
            <div 
              class="skeleton skeleton-shimmer h-4 rounded" 
              :style="{ width: getRandomWidth() }"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
interface Props {
  rows?: number
  columns?: number
}

const props = withDefaults(defineProps<Props>(), {
  rows: 5,
  columns: 6
})

function getRandomWidth() {
  const widths = ['60%', '70%', '80%', '90%', '100%']
  return widths[Math.floor(Math.random() * widths.length)]
}
</script>
