(function(){
  window.App = {
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
      if ( ! this.model.set('title', newTaskTitle, {validate: true}) ) {
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

  // Tasks Collection View
  App.Views.Tasks = Backbone.View.extend({
    tagName: 'ul',
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

  var tasksView = new App.Views.Tasks({ collection: tasksCollection });

  $('.tasks').append(tasksView.render().el);

})();