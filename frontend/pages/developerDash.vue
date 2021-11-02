<template>
  <div>
    <Nav :class="bgcolor" />
    <b-container class="py-5">
      <h2 class="font-weight-bold">Your Jobs History</h2>
      <b-row>
        <b-col cols="9">
          <div class="my-4">
            <h5 class="font-weight-bold">Your Applied Jobs</h5>
            <DevJobList v-bind:appliedJobs="developerApplications"/> 
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
    async getAppliedJobs() {
      let url = `http://localhost:8000/developer/applications/${this.$store.state.session.devid}`
      await this.$axios
      .get(url, {
      })
      .then((res) => {
        // let data = res.json()
        // console.log(data)
        if (res.status == 200) {
          let devApp = res.data.jobApplications;
          for (let i = 0; i < devApp.length; i++) {
            let URL = devApp[i].companyProfilePhotoPath;
            URL = URL.split('/')
            URL = URL[URL.length - 1]
            let newURL = 'http://localhost:8000/companyprofilephoto/' + URL;
            devApp[i].companyProfilePhotoPath = newURL;
          }
          this.developerApplications = devApp;
        } else {
          window.alert("Smth wrong");
        }
      })
      .catch((err) => {
        console.log(err)
      })
      console.log(JSON.stringify(this.developerApplications))
    },
  },
  async beforeMount(){
    await this.getAppliedJobs()
  },
}
</script>
<style>
</style>