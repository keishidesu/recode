<template>
  <div>
    <Nav :class="bgcolor" />
    <b-container class="py-5">
      <h2 class="font-weight-bold">Hello Admin!</h2>

      <div class="my-4">
        <h5 class="font-weight-bold">Company Requests</h5>
        <CompanyRequest />
      </div>
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