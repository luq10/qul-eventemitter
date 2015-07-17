(function(){
  'use strict';

  angular.module('qul.eventemitter', [])
    .factory('EventEmitter', function(){
      /**
       * EventEmitter
       *
       * @constructor
       */
      function EventEmitter(){
        this._listeners = {};
      }

      /**
       * Listeners function storage
       *
       * @type {Object}
       * @private
       */
      EventEmitter.prototype._listeners = {};

      /**
       * Add event function
       *
       * Return hash used to remove listener
       *
       * @example
       * <pre>
       *   var fn = EventEmitter.on('foo', function(data){
       *      console.log(data);
       *   }, $scope);
       *
       *   EventEmitter.off(fn);
       * </pre>
       *
       * @param {String} name
       * @param {Function} fn
       * @param {Object} [scope]
       * @returns {Object}
       */
      EventEmitter.prototype.on = function(name, fn, scope){
        // Prepare
        if(undefined === this._listeners[name]){
          this._listeners[name] = [];
        }

        // Create result
        var res = {
          name:   name,
          index:  this._listeners[name].length,
          fn:     fn
        };

        // Add listener
        this._listeners[name].push(fn);

        if(undefined !== scope){
          // Remove listener when destroy scope
          scope.$on('$destroy', function(){
            this.off(res);
          }.bind(this));
        }

        return res;
      };

      /**
       * Remove listener function
       *
       * @param {Object} EventEmitterHash
       */
      EventEmitter.prototype.off = function(EventEmitterHash){
        var name  = EventEmitterHash.name;
        var fn    = EventEmitterHash.fn;
        var index;

        var listeners = this._listeners[name];

        if(undefined == listeners){
          // destroyed earlier
          return;
        }

        // Search index
        for(var i = 0, ilen = listeners.length; i < ilen; i++){
          if(fn == listeners[i]){
            index = i;
            break;
          }
        }

        if(undefined == index){
          // destroyed earlier
          return;
        }

        this._listeners[name].splice(index);

        // Remove empty
        if(0 === listeners.length){
          delete this._listeners[name];
        }
      };

      /**
       * Fire event
       *
       * @param {String} name
       * @param {*} data
       */
      EventEmitter.prototype.fire = function(name, data){
        var listeners = this._listeners[name];

        if(undefined === listeners){
          // We not have any listeners for this name
          return;
        }

        listeners.forEach(function(fn){
          fn(data);
        })
      };

      return EventEmitter;
    });
}());