(function(){
  'use strict';

  var App = {
    Models: {},
    Views: {},
    Collections: {},
    Helpers: {}
  };

  App.Helpers.template =  function(id) {
    return _.template( $('#' + id).html() );
  };

  // Task Model
  App.Models.Task = Backbone.Model.extend({
    validate: function(attrs, options) {
      if (! $.trim(attrs.title) ) {
        return 'A task requires a valid title.';
      }
    }
  });

  // Tasks Collections
  App.Collections.Tasks = Backbone.Collection.extend({
    model: App.Models.Task
  });

  // Task View
  App.Views.Task = Backbone.View.extend({
    tagName: 'li',
    className: 'list-group-item',
    template: App.Helpers.template('taskTemplate'),
    initialize: function() {
      this.model.on('change', this.render, this);
      this.model.on('destroy', this.remove, this);
    },
    events: {
      'click .edit': 'editTask',
      'click .delete': 'destroyTask'
    },
    editTask: function() {
      var newTaskTitle = prompt('[Edit] Enter the new task', this.model.get('title'));
      console.log(newTaskTitle);
      if ( newTaskTitle !== null && ! this.model.set('title', newTaskTitle, {validate: true}) ) {
        alert(this.model.validationError);
      }
    },
    destroyTask: function() {
      if (confirm('Are you sure to delete task "' + this.model.get('title') + '"?')) {
        this.model.destroy();
      }
    },
    remove: function() {
      this.$el.remove();
    },
    render: function() {
      var template = this.template( this.model.toJSON() );
      this.$el.html(template);
      return this;
    }
  });

  // Add Task
  App.Views.AddTask = Backbone.View.extend({
    el: '#addTask',
    events: {
      'submit': 'submitTask'
    },
    submitTask: function(e) {
      e.preventDefault();
      var newTaskTitle = $(e.currentTarget).find('input[type=text]').val();
      var newTaskPriority = $(e.currentTarget).find('#priority').val();
      var task = new App.Models.Task({ title: newTaskTitle, priority: newTaskPriority });
      this.collection.add(task);

      $(e.currentTarget).find('input[type=text]').val('');
      $(e.currentTarget).find('#priority').val('1');
    }
  });

  // Tasks Collection View
  App.Views.Tasks = Backbone.View.extend({
    tagName: 'ul',
    className: 'list-group',
    initialize: function() {
      this.collection.on('add', this.addOne, this);
    },
    render: function() {
      this.collection.each(this.addOne, this);
      return this;
    },
    addOne: function(task) {
      var taskView = new App.Views.Task({ model: task });
      this.$el.append( taskView.render().el );
    }
  });

  // Implementations

  var tasksCollection = new App.Collections.Tasks([
    {
      'title': 'Go to the store',
      'priority': 4
    },
    {
      'title': 'Go to the mall',
      'priority': 3
    },
    {
      'title': 'Go to work',
      'priority': 5
    }
  ]);

  var addTask = new App.Views.AddTask({ collection: tasksCollection });
  var tasksView = new App.Views.Tasks({ collection: tasksCollection });

  $('.tasks').append(tasksView.render().el);

})();