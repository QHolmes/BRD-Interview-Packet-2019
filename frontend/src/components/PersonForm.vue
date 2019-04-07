<template>
    <div class="formDiv">
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
                <th><button v-on:click="submitForm">Add Person</button></th>
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
        border-collapse: collapse;
        text-transform: capitalize;
        margin: 0 auto;
    }

    th {
        padding-top: 12px;
        padding-bottom: 8px;
        padding-left: 8px;
        text-align: left;
        color: white;
    }

    .formDiv {
        padding-top: 1px;
        background-color: #42b983;
        color: white;
    }

</style>