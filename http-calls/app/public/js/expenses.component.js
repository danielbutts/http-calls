(function() {
  'use strict'

  angular.module('app')
  .component('expenses', {
    controller: controller,
    template: `
    <h1>Expenses</h1>

    <form ng-if="!$ctrl.isEdit" ng-submit="$ctrl.addExpense()">
      <p>
        Category: <input id="new-category" ng-model="$ctrl.newExpense.category">
      </p>
      <p>
        Amount: <input id="new-amount" ng-model="$ctrl.newExpense.amount">
      </p>
      <p>
        <button type="submit">Add Expense</button>
      </p>
    </form>

    <form ng-if="$ctrl.isEdit" ng-submit="$ctrl.updateExpense()">
      <input type="hidden" id="edit-id" ng-model="$ctrl.existingExpense.id">
      <p>
        Category: <input id="edit-category" ng-model="$ctrl.existingExpense.category">
      </p>
      <p>
        Amount: <input id="edit-amount" ng-model="$ctrl.existingExpense.amount">
      </p>
      <p>
        <button type="submit">Update Expense</button>
      </p>
    </form>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Category</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr ng-repeat="expense in $ctrl.existingExpenses">
          <td>{{expense.id}}</td>
          <td>{{expense.category}}</td>
          <td>{{expense.amount}}</td>
          <td>
            <a href="#" ng-click="$ctrl.editExpense($event, expense)">edit</a>
            <a href="#" ng-click="$ctrl.deleteExpense($event, expense)">delete</a>
          </td>
        </tr>
      </tbody>
    </table>
    `
  })

  controller.$inject = ['$http']
  function controller($http) {
    const vm = this

    vm.$onInit = function () {
      $http.get('/api/expenses').then(function (response) {
        vm.existingExpenses = response.data
      })
      vm.isEdit = false;
    }

    vm.deleteExpense = function (e, expense) {
      console.log('delete', expense.id);
      e.preventDefault()
      $http.delete(`/api/expenses/${expense.id}`).then(function (response) {
        console.log('delete', expense.id);
        vm.existingExpenses.splice(vm.existingExpenses.indexOf(expense), 1)
      })
    }

    vm.updateExpense = function () {
      console.log('update', vm.existingExpense);
      $http.patch(`/api/expenses/${vm.existingExpense.id}`, vm.existingExpense).then(function (response) {
        vm.existingExpenses.forEach((expense) => {
          if (expense.id === response.data.id) {
            vm.existingExpenses.splice(vm.existingExpenses.indexOf(expense), 1)
            console.log('match',response.data,expense);
            vm.existingExpenses.push(response.data)
          }
        })
        delete vm.existingExpense
        vm.isEdit = false
      })
    }

    vm.editExpense = function (e, expense) {
      console.log('edit', expense.id);
      e.preventDefault()
      vm.isEdit = true
      delete vm.newExpense
      vm.existingExpense = Object.assign({}, expense)
    }

    vm.addExpense = function () {
      console.log("here", vm.newExpense);
      $http.post(`/api/expenses`, vm.newExpense).then(function (response) {
        console.log('post', vm.existingExpenses, response.data);
        vm.existingExpenses.push(response.data)
        delete vm.newExpense
      })
    }

  }

}());
