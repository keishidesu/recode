<template>
  <div>
    <Nav :class="bgcolor" />
    <b-container class="py-5">
      <h2 class="font-weight-bold">Your Jobs History</h2>
      <b-row>
        <b-col cols="9">
          <div class="my-4">
            <h5 class="font-weight-bold">Your Applied Jobs</h5>
            <DevJobList />                
          </div>
          <!-- <div class="my-4 pt-5">
            <h5 class="font-weight-bold">Your Completed Jobs</h5>
            <DevCompletedJobList />
          </div> -->
        </b-col>
        <!-- <b-col>
          <div class="my-4">
            <h5 class="font-weight-bold">Your Profile</h5>
            <DeveloperProfile />
          </div>
        </b-col> -->
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      developerApplications: '',
      bgcolor: 'bg-nf-primary',
      devid: this.$store.state.session.devid,
    }
  },
  methods: {
    async getAccount() {
      await this.$axios
      .get(`http://localhost:8000/developer/applications/${this.$store.state.session.devid}`, {
      })
      .then((res) => {
        let data = res.json()
        // console.log(data)
        console.log(JSON.stringify(res))
        if (res.status == 200) {
          this.developerApplications = res.jobApplications
        } else {
          window.alert("Smth wrong");
        }
      })
      .catch((err) => {
        console.log(err)
      })
    },
  },
  async beforeMount(){
    await this.getAccount()
  },
}
</script>

<style>

</style>