<template>
  <div>
    <Nav :class="bgcolor" />
    <b-container class="py-5">
      <h2 class="font-weight-bold">Your Jobs History</h2>
      <b-row>
        <b-col cols="9">
          <div class="my-4">
            <h5 class="font-weight-bold">Your Applied Jobs</h5>
            <DevJobList />
          </div>
          <div class="my-4 pt-5">
            <h5 class="font-weight-bold">Your Completed Jobs</h5>
            <DevCompletedJobList />
          </div>
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
      bgcolor: 'bg-nf-primary',
      developer: ''
    }
  },
  methods: {
    async getAccount() {
      console.log('asdad')
      await this.$axios
      .get('http://localhost:8000/developer/applications/897fed76-8407-421f-adb3-89f7fc97e638')
      .then((res) => {
        console.log(JSON.stringify(res))
        if (res.status == 200) {
          this.developer = res.data
        } else {
          window.alert("Smth wrong");
        }
      })
      .catch((err) => {
        console.log(err)
      })
    }
  },
  beforeMount(){
    this.getAccount()
  },
}
</script>

<style>

</style>