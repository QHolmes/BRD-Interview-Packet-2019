
<script>
    import { Bar } from 'vue-chartjs'
    export default {
        name: 'PersonForm',
        data: function () {
            return {
                bins: {
                    total: 0
                }
            }
        },
        extends: Bar,
        props: {
            chartData: {
                type: Object,
                default: null
            },
            options: {
                type: Object,
                default: null
            },
        },
        mounted () {
            this.renderChart(this.chartData, this.options)
        },
        methods: {
            submitForm: function() {
                this.$emit('submit-person-form', this.personData);
            }
        },
        name: 'HistogramChart'
    }
</script>