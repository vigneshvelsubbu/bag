
//Creation of ShoppingCart application 
var cartApp = angular.module('shoppingcartApp',["ngRoute","angularModalService"]);

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
cartApp.controller('BagController', function ListController($rootScope,$scope,$http,ModalService) {

    $rootScope.cartItems=[];
    $scope.wishlist=[];


    $scope.selectedItem = {};

    $scope.init = function () {
        $http.get("api/cart.json")
            .then(function(response) {
                $rootScope.cartItems = response.data.productsInCart;
                calcTotal();
            });
    };
    function  calcOffer() {
        var itemNumber = $rootScope.cartItems.length;
        var offer = 0;
        if(itemNumber === 3){
            offer = 5;
        }else if(itemNumber >3 && itemNumber <=6 ){
            offer = 10;
        }else if(itemNumber>10){
            offer = 25;
        }
        return offer;

    };

    function calcTotal() {
        $scope.offer = calcOffer();
        var subTotal=0
        angular.forEach($rootScope.cartItems,function (item) {
            subTotal = subTotal+(item.p_quantity*item.p_originalprice);
        });
        $scope.subTotal = subTotal;
        if($scope.offer>0){
            $scope.offerAmount = (subTotal*$scope.offer)/100;
            $scope.total = subTotal-$scope.offerAmount;
        }else{
            $scope.offerAmount =0;
            $scope.total = subTotal;
        }

    };
    $scope.openModal = function (id) {
        ModalService.showModal({
            templateUrl: "editCart.html",
            controller: "cartEditController",
            inputs: {
                id: id
            }
        }).then(function(modal) {
            modal.close.then(function(result) {
                if(result.item){
                    angular.forEach($rootScope.cartItems ,function (item,index) {
                        if(item.p_id ===result.item.p_id){
                            item.p_selected_color = result.item.p_selected_color;
                            item.p_selected_size = result.item.p_selected_size;
                            item.p_quantity = result.item.p_quantity;
                        }
                    })
                }
            });
        });
    }

    $scope.moveToWishlist = function (id) {
        angular.forEach($rootScope.cartItems ,function (item,index) {
            if(item.p_id === id){
                $rootScope.cartItems.splice(index,1);
                $scope.wishlist.push(item);
                calcTotal();
            }
        })
    }


    $scope.removeItem = function (id) {
        angular.forEach($rootScope.cartItems ,function (item,index) {
            if(item.p_id === id){
                $rootScope.cartItems.splice(index,1);
                calcTotal();
            }
        })
    }
    
});

cartApp.controller('cartEditController',function ($rootScope,$scope,close,id) {
    // var id = id;
    function init(id){
        angular.forEach($rootScope.cartItems ,function (item,index) {
            if(item.p_id === id){
                $scope.selectedItem = angular.copy(item);
            }
        })
    }
    $scope.edit = function edit() {
        close({
            item: $scope.selectedItem
        }, 500);
    };
    $scope.close = function() {
        close({ }, 500);
    };
    $scope.selectColor = function (color) {
        $scope.selectedItem.p_selected_color = color;
    };
    $scope.isSelected = function (color) {
       return $scope.selectedItem.p_selected_color.name === color.name;
    }
    init(id);
});
cartApp.filter('range', function() {
    return function(input, min, max) {
        min = parseInt(min);
        max = parseInt(max);
        for (var i=min; i<max; i++)
            input.push(i);
        return input;
    };
});
