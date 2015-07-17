(function(){
  'use strict';

  angular.module('app', ['qul.eventemitter'])
    .factory('Service', function(EventEmitter){
      function Service(){
        this.data = [];

        /**
         * Push new data
         */
        this.push = function(item){
          this.data.push(item);

          this.fire('update', this.data);
        }
      }

      // Inheriting
      Service.prototype = EventEmitter.prototype;

      return new Service();
    })
    .factory('OtherService', function(EventEmitter){
      /**
       * OtherService
       *
       * @param data
       * @constructor
       */
      function OtherService(data){
        this.data     = data || [];
        this.events   = new EventEmitter();
      }

      /**
       * Push new item
       *
       * @param item
       */
      OtherService.prototype.push = function(item){
        this.data.push(item);

        this.events.fire('update', this.data);
      };

      return function(data){
        return new OtherService(data)
      };
    })
    .controller('ExampleController', function($scope, $interval, Service, OtherService){
      this.data = {
        service: [],
        otherService: [],
        otherService2: []
      };

      /**
       * Basic example
       *
       * Singleton service inheriting events
       */

      // Add listener
      Service.on('update', function(data){
        console.log('service updated', data);

        this.data.service = data;
      }.bind(this), $scope);

      Service.push(1);
      Service.push(2);
      Service.push(3);

      /**
       * Advance example
       *
       * Service returning instance implement events
       */
      var otherService    = OtherService([1, 2, 3]);  // Create first instance
      var otherService2   = OtherService();           // Create second instance

      // Create observers
      var fn = otherService.events.on('update', function(data){
        console.log('instance 1 updated', data);

        this.data.otherService = data;
      }.bind(this), $scope);

      otherService2.events.on('update', function(data){
        console.log('instance 2 updated', data);

        this.data.otherService2 = data;
      }.bind(this), $scope);

      // Run actions which fires event
      otherService.push(4);
      otherService2.push(1);

      // Remove listener
      otherService.events.off(fn);

      // This not fire listener function, we remove listener
      otherService.push(5);

      var i = 2;
      $interval(function(){
        otherService2.push(i++);
      }, 500);

      // Important!
      //
      // You must care about remove listeners when scope is destroyed
      // If you set $scope in 3 params this will be doing automatically
      $scope.$on('$destroy', function(){
        console.log('destroy');

        console.log(otherService.events._listeners);
        console.log(otherService2.events._listeners);
        console.log(Service._listeners);
      });

      //$scope.$destroy();
    })
}());