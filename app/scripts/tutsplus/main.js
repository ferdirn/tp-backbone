var Person = Backbone.Model.extend({
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

var PersonView = Backbone.View.extend({
  tagName: 'li',
  template: _.template( $('#personTemplate').html() ),
  initialize: function() {
    this.render();
  },
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
  }
});

person = new Person();
personView = new PersonView({model: person});

// var Person = function(config) {
//   this.name = config.name;
//   this.age = config.age;
//   this.occupation = config.occupation;
// };

// Person.prototype.work = function() {
//   return this.name + ' is working.';
// };