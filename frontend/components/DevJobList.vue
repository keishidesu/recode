<template>
  <b-container>
    <b-row class="justify-content-center mt-2">
      <b-card v-for="(job, index) in appliedJobs" :key="job[index]" class="text-center bg-nf-white border-round mt-3" style="width:100%">
        <b-row>
          <b-col md="1" class="ml-4">
            <b-img rounded :src="job.companyProfilePhotoPath" width="70px" fluid />
          </b-col>
          <b-col md="4" class="text-left ml-1">
            <div>{{job.companyName}}</div>
            <div class="font-weight-bold">{{job.jobListingTitle}}</div>
          </b-col>
          <b-col class="text-left mt-3">{{job.tag}}</b-col>
          <b-col class="text-right mt-2">
            <b-button v-b-toggle="`collapse-applied-job-${index}`" class="nf-button-secondary">View Info</b-button>
          </b-col>
        </b-row>
        <b-row class="mx-3 text-left">
          <b-collapse :id="`collapse-applied-job-${index}`" class="mt-4">
            <p class="font-weight-bold">Job Description</p>
            <p>
              {{ job.jobListingDescription }}
            </p>
            <p class="font-weight-bold">Your application response:</p>
            <p>
              {{job.jobApplicationStatus}}
            </p>
          </b-collapse>
        </b-row>
      </b-card>
    </b-row>
  </b-container>
</template>

<script>
export default {
  props: ['appliedJobs'],
  data() {
    return {
    }
  }
}
</script>

