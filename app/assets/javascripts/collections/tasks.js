Wunderclone.Collections.Tasks = Backbone.Collection.extend({
  model: Wunderclone.Models.Task,
  
  url: function(){
    return this.list.url() + "/tasks";
  },
  
  initialize: function (models, options){
    this.list = options.list;
  },
  
  comparator: function(task){
    return task.get('created_at');
  }
  
})