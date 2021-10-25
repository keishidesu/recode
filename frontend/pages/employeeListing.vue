<template>
  <div>
    <Nav :class="bgcolor" />
    <PageHeader :header="header" :class="bgcolor" />
    <PageBody :body="body">
      <EmployeeList />
    </PageBody>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bgcolor: 'bg-nf-secondary',
      header: {
        title: 'Connect with developers',
        navs: [
          {item:'Find a Job | ', link: '#'},
          {item:'Find a Company | ', link: '#'},
          {item:'Connect with People', link: '#'},
        ]
      },
      body: {
        title: 'Explore Vetted Developers'
      }
    }
  }
}
</script>

