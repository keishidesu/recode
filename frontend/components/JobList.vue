<template>
  <b-container>
    <b-row class="justify-content-center mt-2">
      <b-card v-for="(job, index) in jobs" :key="`job-${index}`" class="text-center bg-nf-white border-round mt-3" style="width:100%">
        <b-row>
          <b-col md="1" class="ml-4">
            <b-img rounded :src="require(`../assets/img/${job.companyImg}.png`)" width="70px" fluid />
          </b-col>
          <b-col md="5" class="text-left ml-1">
            <div>{{job.companyName}}</div>
            <div class="font-weight-bold">{{job.position}}</div>
          </b-col>
          <b-col class="text-left mt-3">{{job.tag}}</b-col>
          <b-col class="text-right mt-2">
            <b-button v-b-toggle="`collapse-job-${index}`" class="nf-button-secondary">More</b-button>
            <b-button v-b-modal.modal-applyjob class="nf-button-secondary">Apply Job</b-button>
            <b-modal id="modal-applyjob" title="Apply this Job" hide-footer>
              <ApplyJobModal />
            </b-modal>
          </b-col>
        </b-row>
        <b-row class="mx-3 text-left">
          <b-collapse :id="`collapse-job-${index}`" class="mt-4">
            <p class="font-weight-bold">Job Description</p>
            <p class="">
              {{job.desc}}
            </p>
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
      jobs: [
        { companyImg: 'google', companyName: 'Google', position: 'Software Engineer', tag: 'Dev, Android, BackEnd', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do   eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
        { companyImg: 'google', companyName: 'Google', position: 'Software Engineer', tag: 'Dev, Android, BackEnd', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do   eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' }
      ]
    }
  }
}
</script>

