<template>
  <div>
    <b-form @submit="onSubmit">
      <b-form-group id="input-applyjob-devresponse" label-for="applyjob-1">
        <b-form-textarea
          id="applyjob-1"
          rows="8"
          v-model="form.devresponse"
          placeholder="Enter application response"
          required
        ></b-form-textarea>
      </b-form-group>

      <div class="text-center">
        <b-button type="submit" class="nf-button-secondary w-100">Apply Job</b-button>
      </div>
    </b-form>
    <!-- <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ form }}</pre>
    </b-card> -->
  </div>
</template>

<script>
export default {
  props: ['developerID', 'jobListingID'],
  data() {
    return {
      form: {
        devresponse: '',
      }
    }
  },
  methods: {
    onSubmit(event) {
      event.preventDefault()
      // POST here
      $('#<id of modal>').modal('hide');
      alert(JSON.stringify(this.form))
    }
  }
}
</script>

<style>

</style>