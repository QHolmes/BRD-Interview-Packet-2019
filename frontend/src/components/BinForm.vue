<template>
    <div>
        <table>
            <tr>
                <th><span>Change number of bins </span></th>
                <th><input type="number" value="6" min="1" max="40"  v-model="numberOfBins"/></th>
                <th><button v-on:click="updateBins">Update</button></th>
            </tr>
        </table>
    </div>
</template>
<script>
    export default {
        name: 'BinForm',
        data() {
            return {
                numberOfBins: 0
            }
        },
        methods: {
            updateBins: function() {
                this.$bus.$emit('update-number-of-bins', this.numberOfBins);
            }
        }
    }
</script>
<style scoped>
    table {
        border-collapse: collapse;
        width: 100%;
        text-transform: capitalize;
        margin: 5% 0%;
    }

    th {
        padding: 13px 20px;
        text-align: left;
        background-color: #26c6da;
        color: white;
    }

</style>