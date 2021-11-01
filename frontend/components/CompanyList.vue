<template>
  <b-container>
    <b-row class="justify-content-center mt-2">
      <b-card v-for="(company, index) in companies" :key="company[index]" class="text-center bg-nf-white border-round mt-3" style="width:85%">
        <b-row>
          <b-col md="2" class="ml-4">
            <b-img rounded :src="require(`../assets/img/${company.companyImg}.png`)" width="100px" fluid />
          </b-col>
          <b-col class="text-left ml-1">
            <div class="font-weight-bold">{{company.companyName}}</div>
            <div>{{company.desc}}</div>
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
      companies: [
        { companyImg: 'google', companyName: 'Google', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do   eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
        { companyImg: 'google', companyName: 'Google', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do   eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' }
      ]
    }
  },
  methods: {
      async getCompanies() {
        console.log(123);
        // const companies = await this.$axios.$get('http://localhost:8000/companylist')
        const companies = await fetch('http://localhost:8000/companylist')
        const res = companies.json()
        this.companies = res
        console.log(res)
        return res;
      }
  },
  created() {
    const res = this.getCompanies();
    console.log(res);
  }
}
</script>

