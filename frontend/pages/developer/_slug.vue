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
        <p>Email: {{ developer.developerLastName }}</p>
        <p>Website: {{ developer.developerWebsite }}</p>
        <!-- get pdf here -->
      </b-container>
    </PageBody>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
    const developer = await $axios.$get(`http://localhost:8000/developer/${params.slug}`)
    return { developer }
  }
}
</script>