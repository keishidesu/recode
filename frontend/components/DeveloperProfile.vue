<template>
  <b-card class="mt-4 bg-nf-white border-0 border-round">
    <b-form @submit="onSubmit">
      <b-form-group id="input-dev-fname" label="Your First Name:" label-for="dinput-1">
        <b-form-input
          id="dinput-1"
          v-model="form.firstname"
          placeholder="Enter firstname"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-dev-lname" label="Your Last Name:" label-for="dinput-2">
      <b-form-input
          id="dinput-2"
          v-model="form.firstname"
          placeholder="Enter lastname"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-dev-username" label="Your Username:" label-for="dinput-3">
        <b-form-input
          id="dinput-3"
          v-model="form.username"
          placeholder="Enter username"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-dev-email" label="Email address:" label-for="dinput-4">
        <b-form-input
          id="dinput-4"
          v-model="form.email"
          type="email"
          placeholder="Enter email"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-dev-proftitle" label="Your Professional Title:" label-for="dinput-5">
        <b-form-input
          id="dinput-5"
          v-model="form.proftitle"
          placeholder="Enter title"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-dev-website" label="Your website" label-for="dinput-6">
        <b-form-input
          id="input-6"
          v-model="form.website"
          placeholder="Enter website link"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-dev-desc" label="Your description" label-for="dinput-7">
        <b-form-textarea
          rows="8"
          id="input-7"
          v-model="form.description"
          placeholder="Enter description"
        ></b-form-textarea>
      </b-form-group>

      <b-form-group id="input-dev-country" label="Your country" label-for="dinput-8">
        <b-form-input
          id="input-7"
          v-model="form.country"
          placeholder="Enter country"
        ></b-form-input>
      </b-form-group>

      <b-form-file
        v-model="file1"
        :state="Boolean(file1)"
        placeholder="Choose resume file"
        drop-placeholder="Drop file here..."
        class="mb-3"
      ></b-form-file>

      <div class="text-center">
        <b-button type="submit" class="nf-button-secondary w-100">Edit</b-button>
      </div>
    </b-form>

    <!-- <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ form }}</pre>
    </b-card> -->
  </b-card>
</template>

<script>
export default {
    data() {
      return {
        form: {
          email: '',
          name: '',
          occupation: '',
          description: ''
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