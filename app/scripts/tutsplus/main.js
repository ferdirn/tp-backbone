(function(){
  // Namespaces
  window.App = {
    Models: {},
    Views: {},
    Collections: {},
    Helpers: {}
  };

  // Template helper
  App.Helpers.template = function(id) {
    return _.template( $('#' + id).html() );
  };

  // Person model
  App.Models.Person = Backbone.Model.extend({
    defaults: {
      name: "John Doe",
      age: 30,
      occupation: 'Worker'
    },
    validate: function(attrs, options) {
      if (attrs.age < 1) {
        return 'Age must be a positive number!';
      }
      if (!attrs.name) {
        return 'Everyone has a name!';
      }
    },
    work: function() {
      return this.get('name') + ' is working.';
    }
  });

  // List of People, collection
  App.Collections.People = Backbone.Collection.extend({
    model: App.Models.Person
  });

  // The Views
  App.Views.Person = Backbone.View.extend({
    tagName: 'li',
    template: App.Helpers.template('personTemplate'),
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });

  App.Views.People = Backbone.View.extend({
    tagName: 'ul',
    render: function() {
      this.collection.each(function(person) {
        var personView = new App.Views.Person({ model: person});
        this.$el.append(personView.render().el);
      }, this);
      return this;
    }
  });

  // Implementation

  var peopleCollection = new App.Collections.People([
    {
      name: 'Widi Astuti',
      age: 35,
      occupation: 'Manager'
    },
    {
      name: 'Joni',
      age: 50,
      occupation: 'Entertainer'
    }
  ]);

  var person = new App.Models.Person();

  peopleCollection.add(person);

  var peopleView = new App.Views.People({ collection: peopleCollection });

  $(document.body).append(peopleView.render().el);

})();


// var Person = function(config) {
//   this.name = config.name;
//   this.age = config.age;
//   this.occupation = config.occupation;
// };

// Person.prototype.work = function() {
//   return this.name + ' is working.';
// };