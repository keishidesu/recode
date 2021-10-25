<template>
  <div>
    <Nav :class="bgcolor" />
    <PageHeader :header="header" :class="bgcolor" />
    <PageBody :body="body">
      <JobList />
    </PageBody>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bgcolor: 'bg-nf-primary',
      header: {
        title: 'Find your dream job today',
        navs: [
          {item:'Find a Job | ', link: '#'},
          {item:'Find a Company | ', link: '#'},
          {item:'Connect with People', link: '#'},
        ]
      },
      body: {
        title: 'Explore Remote Jobs'
      }
    }
  }
}
</script>

