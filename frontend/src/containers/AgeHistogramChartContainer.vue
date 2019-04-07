<template>
    <HistogramChart v-if="loaded" :chartData="chartData" :options="options" v-on:bin-change="changeBin"></HistogramChart>
</template>
<script>
    import HistogramChart from '../components/HistogramChart';
    export default{
        name: 'AgeHistogramChartContainer',
        created: function () {
            this.$bus.$on('update-number-of-bins', this.changeBin)
        },
        beforeDestroy: function () {
            this.$bus.$off('update-number-of-bins', this.changeBin)
        },
        components: {
            HistogramChart
        },
        data() {
            return {
                loaded: false,
                chartData: null,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        xAxes: [{
                            barPercentage: 1.2,
                            gridLines: {
                                offsetGridLines: true
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    }
                }
            }
        },
        mounted() {
            let scope = this;
            this.loaded = false;
            fetch('http://localhost:3000/countAge').then(res => {
                return res.json()
            }).then(data => {
                scope.loaded = true;
                scope.chartData = data;
            }).catch(err => {
                console.log(err);
            });
        },
        methods: {
            changeBin: function(numberOfBins){
                if(!isNaN(numberOfBins)) {
                    //validate that form is filled
                    let scope = this;
                    this.loaded = false;
                    fetch('http://localhost:3000/countAge?count=' + numberOfBins).then(res => {
                        return res.json()
                    }).then(data => {
                        scope.loaded = true;
                        scope.chartData = data;
                    }).catch(err => {
                        console.log(err);
                    });
                }
            }
        }
    }
</script>