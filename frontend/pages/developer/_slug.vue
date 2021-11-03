<template>
  <div>
    <Nav :class="bgcolor" />
    <PageHeader :header="header" :class="bgcolor" />
    <PageBody :body="body">
      <b-container class="text-center">
        <!-- Profile pic here -->
        <h3 class="mb-4">{{ developer.developerFirstName }} {{ developer.developerLastName }}</h3>
         <h4 class="mb-4">{{ developer.developerProfessionalTitle }}</h4>
        <p>
          {{ developer.developerDescription }}
        </p>
        <p>Email: {{ developer.developerEmail }}</p>
        <p>Website: {{ developer.developerWebsite }}</p>
      </b-container>
    </PageBody>
  </div>
</template>

<script>
export default {
  data() {
    return {
      developer: '',
      bgcolor: 'bg-nf-primary',
      header: {
        title: 'Explore Developers',
      },
      body: {
        title: ''
      }
    }
  },
  async asyncData({ params, $axios }) {
    const developer = await $axios.$get(`http://localhost:8000/developerprofile/${params.slug}`)
    
    return { developer }
  }
}
</script>