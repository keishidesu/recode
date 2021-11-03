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
      adminid: localStorage.getItem('adminid'),
    }
  },
  methods: {
    async getAccount() {
      await this.$axios
      .get('http://localhost:8000/admin/companyregistrations', {
      })
      .then((res) => {
        if (res.status == 200) {
          console.log(res.data.companyRegistrations)
          let compReg = res.data.companyRegistrations;
          for (let i = 0; i < compReg.length; i++) {
            let URL = compReg[i].companyProfilePhotoPath;
            URL = URL.split('/')
            URL = URL[URL.length - 1]
            let newURL = 'http://localhost:8000/companyprofilephoto/' + URL;
            compReg[i].companyProfilePhotoPath = newURL;
          }
          this.adminCompanyRequests = compReg;
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
    if (!localStorage.getItem('adminid')) {
       this.$router.push('/adminLogin')
    }
    this.getAccount()
  },
}
</script>

<style>

</style>