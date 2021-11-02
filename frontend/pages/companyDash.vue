<template>
  <div>
    <Nav :class="bgcolor" />
    <b-container class="py-5">
      <h2 class="font-weight-bold">Hello!</h2>
      <b-row>
        <b-col cols="9">
          <div class="my-4">
            <b-button v-b-modal.modal-postjob class="nf-button w-100">Post a Job</b-button>
            <b-modal id="modal-postjob" title="Post a Job" hide-footer>
              <PostJobModal />
            </b-modal>
            <h5 class="font-weight-bold mt-4">Your Posted Jobs</h5>
            <div v-if="itemsLoaded">
              <CompanyPostedJobList v-bind:joblistings="jobListings"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div class="my-4">
            <h5 class="font-weight-bold">Company Profile</h5>
            <CompanyProfile />
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bgcolor: 'bg-nf-primary',
      companyid: this.$store.state.session.companyid,
      jobListings: null,
      itemsLoaded: false
    }
  },
  methods: {
    async getAccount() {
      // Get current company job listings
      await this.$axios
      .get(`http://localhost:8000/company/joblisting/${this.$store.state.session.companyid}`, {
      })
      .then((res) => {
        // console.log('THINGS ARE HERE ');
        if (res.status == 200) {
          // console.log(JSON.stringify(res))
          let jobListings = res.data.jobListings;
          // console.log(JSON.stringify(jobListings))
          for (let i = 0; i < jobListings.length; i++) {
            let URL = jobListings[i].companyProfilePhotoPath;
            URL = URL.split('/')
            URL = URL[URL.length - 1]
            let newURL = 'http://localhost:8000/companyprofilephoto/' + URL;
            jobListings[i].companyProfilePhotoPath = newURL;
          }
          
          this.jobListings = jobListings
          // console.log(JSON.stringify(jobListings))

        } else {
          window.alert("Smth wrong");
        }
      })
      .catch((err) => {
        console.log(err)
      })
    },
    async getApplicants() {
      let jobListings = this.jobListings;
      for (let i = 0; i < jobListings.length; i++) {
        let jobListingID = jobListings[i].jobListingID
        let jobApplications = []
        // console.log(jobListingID)
        await this.$axios
          .get(`http://localhost:8000/company/jobapplications/${jobListingID}`)
          .then((res) => {
            // console.log(JSON.stringify(res))
            if (res.status == 200) {
              jobApplications = res.data.jobApplications
              this.jobListings[i].jobApplications = jobApplications
              // jobApplications.push(res.data.jobApplications)
              // console.log(JSON.stringify(jobListings[i].jobApplications))
              // jobListings[i].jobApplications = jobApplications
            }
          }).catch((err) => {
            console.log(err)
          })
        // console.log(JSON.stringify(jobApplications))
        // this.jobListings[i].jobApplications = jobApplications
        // jobListings[i].jobApplications = jobApplications
        // console.log(JSON.stringify(jobListings[i].jobApplications))
        }
        // this.jobListings = jobListings
        // console.log(JSON.stringify(this.jobListings));
        this.itemsLoaded = true;
      }
    },
  async beforeMount(){
    await this.getAccount()
    await this.getApplicants()
  },
}
</script>

<style>

</style>