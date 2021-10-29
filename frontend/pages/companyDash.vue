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
            <CompanyPostedJobList />
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
      bgcolor: 'bg-nf-primary'
    }
  }
}
</script>

<style>

</style>