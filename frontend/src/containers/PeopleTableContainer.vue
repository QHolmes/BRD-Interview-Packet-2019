<template>
    <Table :rows="rows" v-on:refresh-table="getPeople"></Table>
</template>
<script>
    import Table from '../components/Table';

    export default {
        name: 'PeopleTableContainer',
        created: function () {
            this.$bus.$on('search-table', this.searchTable)
        },
        beforeDestroy: function () {
            this.$bus.$off('search-table', this.searchTable)
        },
        components: {
           Table
        },
        data() {
            return {
               rows: []
            }
        },
        mounted() {
            this.getPeople()
        },
        methods: {
            getPeople: function() {

                let scope = this;
                fetch('http://localhost:3000/getPeople').then(res => {
                    return res.json()
                }).then(data => {
                    scope.rows = data;
                }).catch(err => {
                    console.log(err);
                });
            },

            searchTable: function(str){
                let scope = this;
                fetch('http://localhost:3000/getPeople?search="' + str + '"').then(res => {
                    return res.json()
                }).then(data => {
                    scope.rows = data;
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    }
</script>