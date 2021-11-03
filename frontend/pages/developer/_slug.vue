<template>
  <div>
    <Nav :class="bgcolor" />
    <PageHeader :header="header" :class="bgcolor" />
    <PageBody :body="body">
      <b-container class="text-center">
        <b-img :src="`${developer.developerProfilePhotoFilepath}`" class="w-75 mx-auto mb-2 rounded" fluid />
        <h3 class="mb-4">{{ developer.developerFirstName }} {{ developer.developerLastName }}</h3>
         <h4 class="mb-4">{{ developer.developerProfessionalTitle }} located at {{ developer.country }} </h4>
        <p>
          {{ developer.developerDescription }}
        </p>
        <p>Resume: <a :href="developer.developerResumeFilepath" target="_blank">File in PDF</a></p>
        <p>Email: <a :href="`mailto:${developer.developerEmail}`">{{ developer.developerEmail }}</a></p>
        <p>Website: <a :href="developer.developerWebsite">{{ developer.developerWebsite }}</a></p>
        <p>Contact Number: <a :href="`tel:+${developer.developerContact}`">{{ developer.developerContact }}</a></p>
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
  },
  async beforeMount() {
    let developer = this.developer
    let URL = developer.developerProfilePhotoFilepath;
    URL = URL.split('/')
    URL = URL[URL.length - 1]
    let newURL = 'http://localhost:8000/developerprofilephoto/' + URL;
    developer.developerProfilePhotoFilepath = newURL;

    URL = developer.developerResumeFilepath;
    URL = URL.split('/')
    URL = URL[URL.length - 1]
    newURL = 'http://localhost:8000/developerresume/' + URL;
    developer.developerResumeFilepath = newURL;
    this.developer = developer
    console.log(this.developer)
  }
}
</script>