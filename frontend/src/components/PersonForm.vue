<template>
    <div>
        <h3>Add New Person</h3>
        <table>
            <tr>
                <th><span>First Name: </span></th>
                <th><input type="text" v-model="personData.firstName"/></th>
            </tr>
            <tr>
                <th><span>Last Name: </span></th>
                <th><input type="text" v-model="personData.lastName"/></th>
            </tr>
            <tr>
                <th><span>Gender: </span></th>
                <th>
                    <input type="radio" v-model="personData.gender" value="male">Male
                    <input type="radio" v-model="personData.gender" value="female"> Female
                </th>
            </tr>
            <tr>
                <th><span>Age: </span></th>
                <th><input type="number" min="0" max="200" v-model="personData.age"/></th>
            </tr>
            <tr>
                <th></th>
                <th><button v-on:click="submitForm">Submit</button></th>
            </tr>
        </table>


    </div>
</template>
<script>
    export default {
        name: 'PersonForm',
        data: function () {
            return {
                personData: {
                    firstName: '',
                    lastName: '',
                    age: 0,
                    gender: ''
                }
            }
        },
        methods: {
            submitForm: function() {
                this.$emit('submit-person-form', this.personData);
            }
        }
    }
</script>
<style scoped>
    table {
        border: 1px solid #090909;
        border-bottom: 1px solid #ddd;
        border-collapse: collapse;
        width: 80%;
        text-transform: capitalize;
        margin: 10%;
    }

    th {
        padding-top: 12px;
        padding-bottom: 8px;
        padding-left: 8px;
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

</style>