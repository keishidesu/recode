<template>
  <div>
    <Nav :class="bgcolor" />
    <PageHeader :header="header" :class="bgcolor" />
    <PageBody :body="body">
      <b-container class="text-center">
        <!-- Profile pic here -->
        <h3 class="mb-4">{{ company.companyName }}</h3>
         <h4 class="mb-4 font-italic">{{ company.companyTagline }}</h4>
        <p>
          {{ company.companyDescription }}
        </p>
        <p>Email: {{ company.companyEmail }}</p>
        <p>Website: {{ company.companyWebsite }}</p>
        <!-- Jobs posted here -->
      </b-container>
    </PageBody>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bgcolor: 'bg-nf-secondary',
      header: {
        title: 'Explore Comapnies',
      },
      body: {
        title: ''
      }
    }
  },
  async asyncData({ params, $axios }) {
    const company = await $axios.$get(`http://localhost:8000/companyprofile/${params.slug}`)
    return { company }
  }
}
</script>