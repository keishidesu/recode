<template>
  <b-container>
    <b-row class="justify-content-center mt-2">
      <b-card v-for="(company, index) in companies" :key="company[index]" class="text-center bg-nf-white border-round mt-3" style="width:85%">
        <b-row>
          <b-col md="2" class="ml-4">
            <b-img rounded :src="`${company.companyProfilePhotoFilepath}`" width="100px" fluid />
          </b-col>
          <b-col class="text-left ml-1">
            <h5 class="font-weight-bold text-uppercase">{{company.companyName}}</h5>
            <div class="font-weight-bold font-italic">{{company.companyTagline}}</div>
            <div>{{company.companyDescription}}</div>
            <div class="mt-3">Email: {{company.companyEmail}}</div>
            <a class="mt-3">Website: {{company.companyWebsite}}</a><br>
            <NuxtLink :to='`/company/${company.companyUsername}`'>
              <b-button class="mt-2 nf-button-secondary">Learn more</b-button>
            </NuxtLink>
          </b-col>
        </b-row>
      </b-card>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      companies: ''
    }
  },
  async fetch() {
    const companies = await fetch('http://localhost:8000/companylist')
    const res = await companies.json()
    this.companies = res
    console.log(res)
  }
}
</script>

