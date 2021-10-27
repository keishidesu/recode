<template>
  <b-card class="bg-nf-white mt-4 border-0 border-round px-4 py-2">
    <h3 class="font-weight-bold">Filters</h3>
    <div v-for="(filter, index) in filters" :key="filter[index]" class="my-3">
      <h5 class="font-weight-bold">
        {{filter.name}}
      </h5>
      <h4 v-for="(tag, index) in filter.tags" :key="filter-tag[index]" class="mt-2">
        <b-badge class="border-round-small bg-white text-dark">{{tag}}</b-badge>
      </h4>
    </div>
  </b-card>
</template>

<script>
export default {
  data() {
    return {
      filters:[
        { name: 'Technology',
          tags: [
            { item: 'Node JS' },
            { item: 'PHP' },
            { item: 'React JS' },
            { item: 'Kotlin' }
          ]
        },
        { name: 'Roles',
          tags: [
            { item: 'Frontend' },
            { item: 'Backend' },
            { item: 'Full Stack' },
            { item: 'Mobile' }
          ]
        },
        { name: 'Seniority',
          tags: [
            { item: 'Entry' },
            { item: 'Mid Level' },
            { item: 'Senior' }
          ]
        }
      ]
    }
  }
}
