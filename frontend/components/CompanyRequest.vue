<template>
    <b-row class="mt-2">
      <b-card v-for="(company, index) in reqcompanies" :key="company[index]" class="bg-nf-white border-round mt-3" style="width:85%">
        <b-row>
          <b-col md="2" class="ml-4">
            <b-img rounded :src="require(`../assets/img/${company.companyImg}.png`)" width="100px" fluid />
          </b-col>
          <b-col class="text-left ml-1">
            <div class="font-weight-bold">{{company.companyName}}</div>
            <div>{{company.desc}}</div>
            <b-row class="mt-3 ml-auto">
              <b-button class="nf-button-red mr-2">Reject</b-button>
              <b-button class="nf-button-secondary">Approve</b-button>
            </b-row>
          </b-col>
        </b-row>
      </b-card>
    </b-row>
</template>

<script>
export default {
  data() {
    return {
      reqcompanies: [
        { companyImg: 'google', companyName: 'Google', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do   eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
        { companyImg: 'google', companyName: 'Google', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do   eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' }
      ]
    }
  }
}
</script>

