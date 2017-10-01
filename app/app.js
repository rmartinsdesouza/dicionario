
var app = angular.module('myApp', ['ngRoute']);
app.factory("services", ['$http', function($http) {
  var serviceBase = 'http://bedrock/api/'
    var obj = {};
    obj.getPessoas = function(){
        // return $http.get(serviceBase + 'pessoas');
        // return $http.get('http://bedrock/api/pessoa');
        return $http.get(serviceBase + 'pessoa');
    }
    obj.getPessoa = function(pessoaID){
        // return $http.get(serviceBase + 'pessoa?id=' + pessoaID);
        return $http.get(serviceBase + 'pessoa/' + pessoaID);
    }

    obj.insertPessoa = function (pessoa) {
    return $http.post(serviceBase + 'insertPessoa', pessoa).then(function (results) {
        return results;
    });
	};

	obj.updatePessoa = function (id,pessoa) {
	    return $http.post(serviceBase + 'updatePessoa', {id:id, pessoa:pessoa}).then(function (status) {
	        return status.data;
	    });
	};

	obj.deleteCustomer = function (id) {
	    return $http.delete(serviceBase + 'deleteCustomer?id=' + id).then(function (status) {
	        return status.data;
	    });
	};

    return obj;   
}]);

app.controller('listCtrl', function ($scope, services) {
    services.getPessoas().then(function(data){
        $scope.pessoas = data.data;

        console.log($scope.pessoas);
    });
});

app.controller('editCtrl', function ($scope, $rootScope, $location, $routeParams, services, pessoa) {
    var pessoaID = ($routeParams.pessoaID) ? parseInt($routeParams.pessoaID) : 0;
    $rootScope.title = (pessoaID > 0) ? 'EditarPessoa' : 'Add Pessoa';
    $scope.buttonText = (pessoaID > 0) ? 'EditarPessoa' : 'Add New Pessoa';
      var original = pessoa.data;
      original._id = pessoaID;
      $scope.pessoa = angular.copy(original);
      $scope.pessoa._id = pessoaID;

      $scope.isClean = function() {
        return angular.equals(original, $scope.pessoa);
      }

      $scope.deletePessoa = function(pessoa) {
        $location.path('/');
        if(confirm("Are you sure to delete customer number: "+$scope.pessoa._id)==true)
        services.deletePessoa(pessoa.ID);
      };

      $scope.savePessoa = function(pessoa) {
        $location.path('/');
        if (customerID <= 0) {
            services.insertPessoa(pessoa);
        }
        else {
            services.updatePessoa(pessoaID, pessoa);
            //debug
            console.log(services.updatePessoa(pessoaID, pessoa));
        }
    };
});

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        title: 'Pessoas',
        templateUrl: 'partials/pessoas.html',
        controller: 'listCtrl'
      })
      // .when('/editar-pessoa/:pessoaID', {
      .when('/editar-pessoa/:pessoaID', {  
        title: 'EditarPessoa',
        templateUrl: 'partials/editar-pessoa.html',
        controller: 'editCtrl',
        resolve: {
          pessoa: function(services, $route){
            var pessoaID = $route.current.params.pessoaID;
            return services.getPessoa(pessoaID);
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
}]);
app.run(['$location', '$rootScope', function($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);