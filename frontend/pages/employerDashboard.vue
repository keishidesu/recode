<template>
  <div>
    <Nav :class="bgcolor" />
    <b-container class="py-5">
      <h2 class="font-weight-bold">Hello!</h2>
      <b-row>
        <b-col cols="9">
          <div class="my-4">
            <h5 class="font-weight-bold">Your Posted Jobs</h5>
            <EmployerPostedJobList />
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