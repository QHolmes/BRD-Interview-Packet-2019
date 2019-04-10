<template>
    <Table :rows="rows" v-on:refresh-table="refreshTable"></Table>
</template>
<script>
    import Table from '../components/Table';

    export default {
        name: 'PeopleTableContainer',
        created: function () {
            this.$bus.$on('search-table', this.searchTable)
			this.$bus.$on('last-col-toggle', this.lastColToggle)
			this.$bus.$on('first-col-toggle', this.firstColToggle)
			this.$bus.$on('gender-col-toggle', this.genderColToggle)
			this.$bus.$on('age-col-toggle', this.ageColToggle)
        },
        beforeDestroy: function () {
            this.$bus.$off('search-table', this.searchTable)
			this.$bus.$off('last-col-toggle', this.lastColToggle)
			this.$bus.$off('first-col-toggle', this.firstColToggle)
			this.$bus.$off('gender-col-toggle', this.genderColToggle)
			this.$bus.$off('age-col-toggle', this.ageColToggle)
        },
        components: {
           props: ['columns'],
           Table
        },
        data() {
            return {
               columns: {
                   last: 1,
                   first: 0,
                   gender: 0,
                   age: 0,
                   search: "",
                   order: []
               },
                rows: []
            }
        },
        mounted() {
            this.getPeople()
        },
        methods: {
			refreshTable: function() {
				//Rest data
				this.rows = [];
				this.columns = {
                    last: 1,
                    first: 0,
                    gender: 0,
                    age: 0,
                    search: "",
                    order: []
                };
                //GET table data
                this.getPeople();
			},
            getPeople: function() {
				//base request
				let request = "http://localhost:3000/getPeople"
				
				//Add search and prep for sort if need be
				if(this.columns.search !== "" && this.columns.search != null){
					request += "?search='" + this.columns.search + "'"
					if(this.columns.order.length > 0)
						request += "&"
				}else if (this.columns.order.length > 0){
					request += "?"
				}
				
				//If we have any sort prams, add them to the request
				if(this.columns.order.length > 0){
					request += "sort="
					for(let i = 0; i < this.columns.order.length - 1; i++){
						request += this.columns.order[i] + ",";
					}
					request += this.columns.order[this.columns.order.length - 1]
				}

				//Request prams are set, send request and update table
                let scope = this;
                fetch(request).then(res => {
                    return res.json()
                }).then(data => {
                    scope.rows = data;
                }).catch(err => {
                    console.log(err);
                });
            },

            searchTable: function(str){
                this.columns.search = str;
				//GET table data
                this.getPeople();
            },
			
			lastColToggle: function() {
                this.columns.first = 0;
                this.columns.gender = 0;
                this.columns.age = 0;

                this.columns.order = this.columns.order.filter(function (value, index, arr) {
                    return !value.includes("last_name:");
                });

                if (this.columns.last === 0) {

                    this.columns.order.unshift("last_name:ASC")
                    this.columns.last = 1;
                } else if (this.columns.last === 1) {

                    this.columns.order.unshift("last_name:DESC")
                    this.columns.last = 0;
                } else {
                    this.columns.lastText = this.columns;
                }

                //GET table data
                this.getPeople();
            },

            firstColToggle: function(){
                this.columns.last = 0;
                this.columns.gender = 0;
                this.columns.age = 0;

                this.columns.order = this.columns.order.filter(function(value, index, arr){
                return !value.includes("first_name:");
				});

                if(this.columns.first === 0) {
                    this.columns.order.unshift("first_name:ASC")
                    this.columns.first = 1;
                }else if (this.columns.first === 1) {
                    this.columns.order.unshift("first_name:DESC")
                    this.columns.first = 0;
                }else {
                    this.columns.firstText = this.columns;
                }

				//GET table data
                this.getPeople();
			},
			
			genderColToggle: function(){
                this.columns.last = 0;
                this.columns.first = 0;
                this.columns.age = 0;

                this.columns.order = this.columns.order.filter(function(value, index, arr){
                return !value.includes("gender:");
				});

                if(this.columns.gender === 0) {
                    this.columns.order.unshift("gender:ASC")
                    this.columns.gender = 1;
                }else if (this.columns.gender === 1) {
                    this.columns.order.unshift("gender:DESC")
                    this.columns.gender = 0;
                }else {
                    this.columns.genderText = this.columns;
                }

				//GET table data
                this.getPeople();
			},
			
			ageColToggle: function(){
                this.columns.last = 0;
                this.columns.first = 0;
                this.columns.gender = 0;

                this.columns.order = this.columns.order.filter(function(value, index, arr){
                    return !value.includes("age:");
				});

                if(this.columns.age === 0) {
                    this.columns.order.unshift("age:ASC")
                    this.columns.age = 1;
                }else if (this.columns.age === 1) {
                    this.columns.order.unshift("age:DESC")
                    this.columns.age = 0;
                }else {
                    this.columns.ageText = this.columns;
                }

				//GET table data
                this.getPeople();
			}
        }
    }
</script>