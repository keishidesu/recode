<template>
  <div>
    <Nav :class="bgcolor" />
    <PageHeader :header="header" :class="bgcolor" />
    <PageBody :body="body">
      <b-container class="text-center">
        <b-img :src="`${company.companyProfilePhotoFilepath}`" class="w-75 mx-auto mb-2 rounded" fluid />
        <h3 class="mb-4">{{ company.companyName }}</h3>
         <h4 class="mb-4 font-italic">{{ company.companyTagline }}</h4>
        <p>
          {{ company.companyDescription }}
        </p>
        <p>Email: <a :href="`mailto:${company.companyEmail}`">{{ company.companyEmail }}</a></p>
        <p>Website: <a :href="company.companyWebsite">{{ company.companyWebsite }}</a></p>
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
        title: 'Explore Companies',
      },
      body: {
        title: ''
      }
    }
  },
  async asyncData({ params, $axios }) {
    const company = await $axios.$get(`http://localhost:8000/companyprofile/${params.slug}`)
    return { company }
  },
  async beforeMount() {
    let company = this.company
    console.log(company)
    let URL = company.companyProfilePhotoFilepath;
    URL = URL.split('/')
    URL = URL[URL.length - 1]
    let newURL = 'http://localhost:8000/companyprofilephoto/' + URL;
    company.companyProfilePhotoFilepath = newURL;
    this.company = company;
  }
}
</script>