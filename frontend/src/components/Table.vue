<template>
    <div>
        <h3>Table</h3>
        <br>
        <button v-on:click="clickedRefresh">Refresh Table</button>
        <table class="peopleTable">
            <thead>
                <tr>
                    <th> Last Name </th>
                    <th> First Name </th>
                    <th> Gender </th>
                    <th> Age </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in rows">
                    <td> {{row["last_name"]}} </td>
                    <td> {{row["first_name"]}}</td>
                    <td> {{row["gender"]}} </td>
                    <td> {{row["age"]}} </td>
                </tr>
            </tbody>
        </table>

    </div>
</template>
<script>
    export default {
        props: {
            rows: {
                type: Array,
                default: null
            },
        },
        data: function () {
            return {}
        },
        methods: {
            clickedRefresh() {
                this.$emit('refresh-table');
            }
        },
        name: 'Table',
    }
</script>
<style scoped>
    .peopleTable {
        border: 1px solid #090909;
        border-bottom: 1px solid #ddd;
        border-collapse: collapse;
        width: 80%;
        text-transform: capitalize;
        margin: 10px;
    }

    th {
        padding-top: 12px;
        padding-bottom: 12px;
        padding-left: 5px;
        text-align: left;
        background-color: #42b983;
        color: white;
    }

    tr:nth-child(even){
        background-color: #f2f2f2;
    }
    tr:hover {
        background-color: #ddd;
    }
    td {
        padding: 10px 15px;
        text-align: left;
    }

</style>
