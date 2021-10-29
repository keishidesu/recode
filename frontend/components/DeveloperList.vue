<template>
  <b-container>
    <b-row cols="1" cols-lg="4" class="mt-2">
      <b-col v-for="(employee, index) in employees" :key="employee[index]">
        <b-card no-body class="text-center border-0 mt-3 rounded">
          <b-img src="../assets/img/user.jpg" class="w-75 mx-auto mb-2 rounded" fluid />
          <p><b>{{employee.name}}</b>
            <br>
            {{employee.position}}
          </p>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      employees: [
        { name: 'Kotaro', position: 'BackEnd Manager'},
        { name: 'Kotaro', position: 'BackEnd Manager'},
        { name: 'Kotaro', position: 'BackEnd Manager'},
        { name: 'Kotaro', position: 'BackEnd Manager'},
        { name: 'Kotaro', position: 'BackEnd Manager'},
        { name: 'Kotaro', position: 'BackEnd Manager'},
        { name: 'Kotaro', position: 'BackEnd Manager'},
        { name: 'Kotaro', position: 'BackEnd Manager'}
      ]
    }
  }
}
</script>

