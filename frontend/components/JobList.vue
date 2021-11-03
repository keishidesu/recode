<template>
  <b-container>
    <b-row class="justify-content-center mt-2">
      <b-card v-for="job in jobs" :key="`${job.jobListingId}`" class="text-center bg-nf-white border-round mt-3" style="width:100%">
        <b-row>
          <b-col md="1" class="ml-4">
            <b-img rounded :src="`${job.companyProfilePhotoFilepath}`" width="70px" fluid />
          </b-col>
          <b-col md="5" class="text-left ml-1">
            <div>{{job.companyName}}</div>
            <div class="font-weight-bold">{{job.jobListingTitle}}</div>
          </b-col>
          <b-col class="text-left mt-3 font-weight-bold">RM{{job.jobListingSalaryStart}} -RM{{job.jobListingSalaryEnd}}</b-col>
          <b-col class="text-right mt-2">
            <b-button v-b-toggle="`collapse-alljobs-${job.jobListingId}`" class="nf-button-secondary">More</b-button>
              <b-button v-b-modal="`modal-applyjob-${job.jobListingId}`" class="nf-button-secondary" v-if="devid">Apply Job</b-button>
              <b-modal :id="`modal-applyjob-${job.jobListingId}`" title="Apply for this Job" hide-footer>
                <div>
                  <b-form @submit="onSubmit($event, job.jobListingId)">
                    <b-form-group id="input-applyjob-devresponse" label-for="applyjob-1">
                      <b-form-textarea
                        id="applyjob-1"
                        rows="8"
                        v-model="devresponse"
                        placeholder="Enter application response"
                        required
                      ></b-form-textarea>
                    </b-form-group>

                    <div class="text-center">
                      <b-button type="submit" class="nf-button-secondary w-100">Apply Job</b-button>
                    </div>
                  </b-form>
                </div>
              </b-modal>
          </b-col>
        </b-row>
        <b-row class="mx-3 text-left">
          <b-collapse :id="`collapse-alljobs-${job.jobListingId}`" class="mt-4">
            <p class="font-weight-bold">Job Description</p>
            <div>{{ job.jobListingJobDescription }}</div>
          </b-collapse>
        </b-row>
      </b-card>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      jobs: '',
      devid: localStorage.getItem('devid'),
      devresponse: ''
    }
  },

  methods: {
    makeToast (title, message, variant) {
      this.$bvToast.toast(message, {
        title,
        variant,
        autoHideDelay: 2500,
        appendToast: true
      })
    },
    async applyJob() {

    },
    async fetchData() {
      const jobs = await fetch('http://localhost:8000/joblistings')
      const res = await jobs.json()
      let jobsDetails = res;
      // console.log(res)
      for (let i = 0; i < jobsDetails.length; i++) {
        // console.log(res[i].companyProfilePhotoFilepath)
        let URL = jobsDetails[i].companyProfilePhotoFilepath
        // console.log(URL)
        URL = URL.split('/')
        // console.log(URL)
        URL = URL[URL.length - 1]
        let newURL = 'http://localhost:8000/companyprofilephoto/' + URL
        jobsDetails[i].companyProfilePhotoFilepath = newURL
      }
      this.jobs = jobsDetails
      console.log(this.jobs)
    },
    async onSubmit(event, jobListingID) {
      event.preventDefault()
      let url = `http://localhost:8000/developer/application`
      await this.$axios
      .post(url, {
        developerID: this.devid,
        jobListingID: jobListingID,
        description: this.devresponse
      })
      .then((res) => {
        // let data = res.json()
        // console.log(data)
        if (res.status == 200) {
          console.log("Submitted");
          let message = res.data.message;
          this.makeToast('Job Applied Successfully', 'Submitted', 'success')
          
        } else {
          this.makeToast('Something is wrong!', err, 'warning')
        }
      })
      .catch((err) => {
        console.log(err)
      })
    }
  },
  async beforeMount() {
    await this.fetchData()
    console.log(this.devid)
  }
}
</script>
