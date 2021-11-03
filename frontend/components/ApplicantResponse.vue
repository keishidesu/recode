<template>
  <b-card class="bg-white border-0 border-round shadow-sm">
    <b-card v-for="(applicant, index) in applicantsDetails" :key="applicant[index]" class="text-center bg-nf-white border-round mt-3" style="width:100%">
      <div>
        <b-row>
          <b-col cols="8">
            <h5 class="font-weight-bold"><a v-bind:href="`http://localhost:3000/developer/${applicant.developerUsername}`">{{ applicant.developerFirstName }} {{ applicant.developerLastName }}</a></h5>
          </b-col>
          <b-col cols="4" class="text-center" v-if="applicant.jobApplicationStatus.includes('PENDING')">
            <b-button class="nf-button-red" @click="updateApplication(applicant.applicationID, applicant.companyID, 0)">Reject</b-button>
            <b-button class="nf-button-secondary"  @click="updateApplication(applicant.applicationID, applicant.companyID, 1)">Approve</b-button>
          </b-col>
          <b-col cols="4" class="text-center" v-if="applicant.jobApplicationStatus.includes('APPROVED')">
            <div>{{ applicant.jobApplicationStatus }}</div>
          </b-col>
        </b-row>
        <div class="text-left">
          <p>{{ applicant.developerEmail }}</p>
          <p class="font-weight-bold">Response: </p>
          <p>
            {{ applicant.jobApplicationDescription }}
          </p>
        </div>
      </div>
    </b-card>
  </b-card>
</template>

<script>
export default {
  props: ['applicantsDetails'],
  methods: {
    async updateApplication(applicationID, companyID, status) {
      let state;
      if (status == 1) {
        state = "APPROVED"
      } else {
        state = "REJECTED"
      }

      await this.$axios
      .put(`http://localhost:8000/company/jobapplication`, {
        applicationID: applicationID,
        companyID: companyID,
        status: state
      })
      .then((res) => {
        console.log(JSON.stringify(res))
        if (res.status == 200) {
          window.alert(state + " job application");
          console.log(res);
          // this.developerApplications = res.jobApplications
        } else {
          window.alert("Smth wrong");
        }
      })
      .catch((err) => {
        console.log(err)
      })
    }
  },
  async beforeMount() {
    console.log(this.applicantsDetails);
  }
}
</script>

<style>

</style>