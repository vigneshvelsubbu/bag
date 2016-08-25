
//Creation of ShoppingCart application 
var cartApp = angular.module('shoppingcartApp',[]);

//router
cartApp.config(function ($routeProvider) {

    $routeProvider.
        when('/bag', {
            controller: 'BagController',
            templateUrl: 'shop.html'
        })
        .otherwise(
        {redirectTo: "/bag"}
    );
});
cartApp.controller('BagController', function ListController($scope,$http) {

    $scope.cartItems=[];
    $scope.wishlist=[];

    $scope.selectedItem = {};

    $scope.init = function () {
        $http.get("api/cart.json")
            .then(function(response) {
                $scope.cartItems = response.data.productsInCart;
            });
    };
    $scope.openModal = function (id) {

            angular.forEach($scope.cartItems ,function (item,index) {
                if(item.p_id === id){
                    $scope.selectedItem =angular.copy(item) ;
                }
            });
            window.location="#openModal";

    }

    $scope.moveToWishlist = function (id) {
        angular.forEach($scope.cartItems ,function (item,index) {
            if(item.p_id === id){
                $scope.cartItems.splice(index,1);
                $scope.wishlist.push(item);
            }
        })
    }

    $scope.updateCart = function () {

    }

    $scope.removeItem = function (id) {
        angular.forEach($scope.cartItems ,function (item,index) {
            if(item.p_id === id){
                $scope.cartItems.splice(index,1);
            }
        })
    }






    
});
