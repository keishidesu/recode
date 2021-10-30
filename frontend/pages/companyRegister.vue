<template>
  <div>
    <Nav2 :class="bgcolor" />
    <div class="container">
      <div class="row text-center justify-content-md-center mt-5">
        <div class="col-md-6">
          <v-row align="center">
            <h2 class="font-weight-bold mt-5">
              Let your company be known
            </h2>
            <b-card class="mt-4 border-0 border-round">
              <b-form @submit="onSubmit">
                <b-form-group id="input-dev-fname" label-for="dinput-1">
                  <b-form-input
                    class="border-round-small"
                    id="dinput-1"
                    v-model="form.companyname"
                    placeholder="Company name"
                    required
                  >
                  </b-form-input>
                </b-form-group>

                <b-form-group id="input-dev-uname" label-for="dinput-3">
                  <b-form-input
                    class="border-round-small"
                    id="dinput-3"
                    v-model="form.username"
                    placeholder="User name"
                    required
                  >
                  </b-form-input>
                </b-form-group>

                <b-form-group id="input-dev-nmb" label-for="dinput-4">
                  <b-form-input
                    class="border-round-small"
                    id="dinput-4"
                    v-model="form.nmb"
                    placeholder="Contact number"
                    required
                  >
                  </b-form-input>
                </b-form-group>

                <b-form-group id="input-dev-email" label-for="dinput-5">
                  <b-form-input
                    class="border-round-small"
                    id="dinput-5"
                    v-model="form.email"
                    placeholder="Email address"
                    required
                  >
                  </b-form-input>
                </b-form-group>

                <b-form-group id="input-dev-pass" label-for="dinput-6">
                  <b-form-input
                    class="border-round-small"
                    id="dinput-6"
                    v-model="form.password"
                    placeholder="Password"
                    required
                  >
                  </b-form-input>
                </b-form-group>
                <div class="text-center">
                  <b-button type="submit" class="nf-button-copy w-100"
                    >Submit</b-button
                  >
                </div>
              </b-form>
            </b-card>
          </v-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bgcolor: "bg-nf-primary",

      form: {
        companyname: "",
        username: "",
        nmb: "",
        email: "",
        Password: ""
      }
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      alert(JSON.stringify(this.form));
    }
  }
};
</script>

<style scoped></style>
