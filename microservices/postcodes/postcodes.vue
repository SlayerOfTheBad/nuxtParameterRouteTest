<template>
  <div>
    <h2>The first Module</h2>
    <p>{{ $route.meta }}</p>
    <NuxtChild />
  </div>
</template>

<script>
export default {
  name: 'Module1',
};
</script>

<style scoped>

</style>
