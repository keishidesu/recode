<template>
  <div>
    <b-form @submit="onSubmit">
      <b-form-group id="input-postjob-title" label-for="postjobinput-1">
        <b-form-input
          id="postjobinput-1"
          v-model="form.jobtitle"
          placeholder="Job Title"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-postjob-salarystart" label-for="postjobinput-2">
        <b-form-input
          id="postjobinput-2"
          v-model="form.salarystart"
          placeholder="Salary Start"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-postjob-salaryend" label-for="postjobinput-3">
        <b-form-input
          id="postjobinput-3"
          v-model="form.salaryend"
          placeholder="Salary End"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-postjob-desc" label-for="postjobinput-4">
        <b-form-textarea
          id="postjobinput-4"
          v-model="form.jobdesc"
          placeholder="Job Description"
          rows="7"
          max-rows="10"
          required
        ></b-form-textarea>
      </b-form-group>

      <b-form-group id="input-postjob-jobexpirydate" label-for="postjobinput-5">
        <b-form-datepicker id="jobexpirydate-datepicker" v-model="jobexpirydate" class="mb-2" />
        <p>Job Date of Expiry: '{{ jobexpirydate }}'</p>
      </b-form-group>

      <div class="text-center">
        <b-button type="submit" class="nf-button-secondary w-100">Post a Job</b-button>
      </div>
    </b-form>
    <!-- <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ form }}</pre>
    </b-card> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      jobexpirydate:'',
      form: {
        jobtitle: '',
        salaryend: '',
        salaryend: '',
        jobdesc: '',
      }
    }
  },
  methods: {
    onSubmit(event) {
      event.preventDefault()
      alert(JSON.stringify(this.form))
    }
  }
}
</script>

<style>

</style>