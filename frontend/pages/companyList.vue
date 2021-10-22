<template>
  <div>
    <Nav :class="bgcolor" />
    <PageHeader :header="header" :class="bgcolor" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      bgcolor: 'bg-nf-secondary',
      header: {
        title: 'Find your next company',
        navs: [
          {item:'Find a Job | ', link: '#'},
          {item:'Find a Company | ', link: '#'},
          {item:'Connect with People', link: '#'},
        ]
      }
    }
  }
}
</script>

