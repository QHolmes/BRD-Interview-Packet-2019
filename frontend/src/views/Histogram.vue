<template>
  <div class="home">
    <h1> Histogram Chart</h1>
    <div class="histogram">
      <BinForm></BinForm>
      <AgeHistogramChartContainer></AgeHistogramChartContainer>
    </div>
  </div>
</template>

<script>
  import AgeHistogramChartContainer from "../containers/AgeHistogramChartContainer";
  import BinForm from "../components/BinForm";
export default {

  data: function () {
    return {}
  },
  components: {
    BinForm,
    AgeHistogramChartContainer
  },
  name: 'Histogram'
}
</script>

<style scoped>
.histogram {
  display: inline-block
}
</style>

