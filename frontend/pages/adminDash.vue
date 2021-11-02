<template>
  <div>
    <Nav :class="bgcolor" />
    <b-container class="py-5">
      <h2 class="font-weight-bold">Hello Admin!</h2>

      <div class="my-4">
        <h5 class="font-weight-bold">Company Requests</h5>
        <CompanyRequest
          v-for="request in adminCompanyRequests"
          :key="request.companyRegistrationID"
          :request="request" 
        />
      </div>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      adminCompanyRequests: '',
      bgcolor: 'bg-nf-primary',
      adminid: this.$store.state.session.adminid,
    }
  },
  methods: {
    async getAccount() {
      await this.$axios
      .get('http://localhost:8000/admin/companyregistrations', {
      })
      .then((res) => {
        if (res.status == 200) {
          this.adminCompanyRequests = res.data.companyRegistrations
          console.log(res.data.companyRegistrations)
        } else {
          window.alert("Smth wrong");
        }
      })
      .catch((err) => {
        console.log(err)
      })
    }
  },
  beforeMount(){
    this.getAccount()
  },
}
</script>

<style>

</style>