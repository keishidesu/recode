<template>
    <b-row class="mt-2">
      <b-card class="bg-nf-white border-round mt-3" style="width:85%">
        <b-row>
          <b-col md="2" class="ml-4">
            <b-img rounded :src="request.companyProfilePhotoPath" width="100px" fluid />
          </b-col>
          <b-col class="text-left ml-1">
            <div class="font-weight-bold">{{request.companyName}}</div>
            <div class="font-weight-bold">{{request.companyEmail}}</div>
            <h4 v-if="request.companyRegistrationStatus != 'PENDING'" class="mt-3">{{request.companyRegistrationStatus}} by {{request.companyRegistrationReviewerAdminUsername}}</h4>
            <h4 v-else class="mt-3">{{request.companyRegistrationStatus}}</h4>
            <b-row v-if="request.companyRegistrationStatus == 'PENDING'" class="mt-3 ml-auto">
              <b-button v-b-toggle="`collapse-${request.companyRegistrationID}`" class="nf-button-red mr-2" >Reject</b-button>
              <b-button class="nf-button-secondary" @click="approveCompany()">Approve</b-button>
            </b-row>
            <b-row class="mt-2">
              <b-collapse :id="`collapse-${request.companyRegistrationID}`">
                <b-card style="width:700px">
                  <b-form @submit="rejectCompany">
                    <b-form-group>
                      <input v-model="rejectionReason" type="text" class="border-round-small form-control" placeholder="Enter Rejection Reason" >
                    </b-form-group>
                    <b-button type="submit" class="nf-button-red">
                      Reject
                    </b-button>
                  </b-form>
                </b-card>
              </b-collapse>
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
      rejectionReason: ''
    }
  },

  props: ['request'],

  methods: {
    async approveCompany() {
      await this.$axios
      .put('http://localhost:8000/admin/companyregistration',{
        companyRegistrationID: this.request.companyRegistrationID,
        status: 'APPROVE',
        rejectionReason: 'none' 
      })
      .then((res) => {
        if (res.status == 200) {
          this.makeToast('Success!', 'Approval updated', 'success')
          window.location.reload()
        }
      })
      .catch((err) => {
        this.makeToast('Error!', err, 'danger')
      })
    },

    async rejectCompany() {
      await this.$axios
      .put('http://localhost:8000/admin/companyregistration',{
        companyRegistrationID: this.request.companyRegistrationID,
        status: 'REJECTED',
        rejectionReason: this.rejectionReason
      })
      .then((res) => {
        if (res.status == 200) {
          this.makeToast('Success!', 'Rejection updated', 'success')
          window.location.reload()
        }
      })
      .catch((err) => {
        this.makeToast('Error!', err, 'danger')
      })
    },

    makeToast (title, message, variant) {
      this.$bvToast.toast(message, {
        title,
        variant,
        autoHideDelay: 2500,
        appendToast: true
      })
    }
  }
}
</script>

