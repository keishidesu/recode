<template>
  <div>
    <Nav :class="bgcolor" />
    <b-container class="py-5">
      <h2 class="font-weight-bold">Your Jobs History</h2>
      <b-row>
        <b-col cols="9">
          <div class="my-4">
            <h5 class="font-weight-bold">Your Applied Jobs</h5>
            <UserJobList />
          </div>
          <div class="my-4 pt-5">
            <h5 class="font-weight-bold">Your Completed Jobs</h5>
            <UserCompletedJobList />
          </div>
        </b-col>
        <b-col>
          <div class="my-4">
            <h5 class="font-weight-bold">Your Profile</h5>
            <UserProfile />
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