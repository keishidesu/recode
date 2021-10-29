<template>
  <b-card class="bg-nf-white mt-4 border-0 border-round px-4 py-2">
    <h3 class="font-weight-bold">Filters</h3>
    <div v-for="(filter, index) in filters" :key="`filter-${index}`" class="my-3">
      <h5 class="font-weight-bold">
        {{filter.name}}
      </h5>
      <h4 v-for="(tag, tagindex) in filter.tags" :key="`filter-${index}-tag-${tagindex}`" class="d-inline mt-2">
        <b-badge class="border-round-small bg-white text-dark ml-1 mt-1">{{tag}}</b-badge>
      </h4>
    </div>
  </b-card>
</template>

<script>
export default {
  data() {
    return {
      filters: [
        { 
          name: 'Technology',
          tags: [
            'Node JS', 'PHP', 'React JS', 'Kotlin'
          ]
        },
        { 
          name: 'Roles',
          tags: [
            'Frontend', 'Backend', 'Full Stack', 'Mobile'
          ]
        },
        { 
          name: 'Seniority',
          tags: [
            'Entry', 'Mid Level', 'Senior'
          ]
        }
      ]
    }
  }
}
</script>

<style>

</style>