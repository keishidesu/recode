<template>
  <b-container fluid>
    <div class="my-5">
      <p class="text-center" style="font-size: 2rem">{{body.title}}</p>
      <b-row>
        <b-col cols="3" class="float-right">
          <FilterSection />
        </b-col>
        <b-col class="text-center">
          <slot />
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script>
export default {
  props: ['body']
}
</script>

<style scoped>

</style>
