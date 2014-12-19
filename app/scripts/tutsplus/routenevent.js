(function(){
  window.App = {
    Models: {},
    Views: {},
    Collections: {},
    Routers: {},
    Helpers: {}
  };

  var vent = _.extend({}, Backbone.Events);

  App.Models.task = Backbone.Model.extend({
    defaults: {
      'title': 'Sholat subuh'
    }
  });

  App.Collections.tasks = Backbone.Collection.extend({
    model: App.Models.task
  });

  App.Views.task = Backbone.View.extend({
    tagName: 'li',
    render: function() {
      this.$el.append( this.model.get('title') );
      return this;
    }
  });

  App.Views.tasks = Backbone.View.extend({
    tagName: 'ul',
    initialize: function() {
      vent.on('task:show', this.show, this);
    },
    show: function(id) {
      var model = this.collection.at(id);
      var taskView = new App.Views.task( { model: model });
      $(document.body).html( taskView.render().el );
    }
  });

  App.Routers.router = Backbone.Router.extend({
    routes: {
      '': 'index',
      'show/:id': 'show',
      'download/:id/*filename': 'download'
    },
    index: function() {
      console.log('You are on index page');
    },
    show: function(id) {
      console.log('Showing id ' + id);
      vent.trigger('task:show', id);
    },
    download: function(id, filename) {
      console.log('Download file ' + filename + ' with id ' + id);
    }
  });

  var tasksCollection = new App.Collections.tasks([
    {'title': 'Senam pagi'},
    {'title': 'Belajar backbone js'},
    {'title': 'Makan makanan yang bergizi'}
  ]);
  var tasksView = new App.Views.tasks( {collection: tasksCollection} );

  new App.Routers.router;
  Backbone.history.start();

})();