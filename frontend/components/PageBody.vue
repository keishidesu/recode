<template>
  <b-container fluid>
    <div class="my-5">
      <p class="text-center" style="font-size: 2rem">{{body.title}}</p>
      <slot />
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
