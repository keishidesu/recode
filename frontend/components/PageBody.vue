<<template>
  <div class="text-center my-5">
    <p style="font-size: 2rem">{{body.title}}</p>
    <slot />
  </div>
</template>

<script>
export default {
  props: ['body']
}
</script>

<style scoped>

</style>
