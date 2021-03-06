Wunderclone.Views.TasksNew = Backbone.View.extend({
  template: JST["tasks/new"],
  
  events: {
    'submit .task-form':'submit',
    'mousedown .star.task-form-star' : 'starTask',
    'mousedown .task-form-date' : 'selectDate',
    'click .task-form' : 'activateForm'
  },
  
  handleClick: function(event){
    event.stopPropagation();
  },

  activateForm: function(event){
    event.stopPropagation();
    this.$el.find('.task-form').addClass('active-task-form');
  },
  
  deactivateDate: function(){
    this.$el.find('.task-form-date').removeClass('show-date-dropdown');
    Wunderclone.bindFocusOutCallbacks();
  },
  
  selectDate: function(event){
    event.preventDefault();
    event.stopPropagation();
    $(document).off("focusout");
  },
  
  deactivateForm: function(){
    $('.task-form').removeClass('active-task-form');
  },
  
  initialize: function(options){
    this.bindKeypress();
  },
  
  changeList: function(list, options){
    if(options && options.type){
      this.type = options.type;
    } else {
      this.type = null;
    }
    this.list = list, 
    this.render();
    this.collection = this.list.activeTasks();
  },
  
  ISODateString: function(d){
   function pad(n){return n<10 ? '0'+n : n}
   return d.getUTCFullYear()+'-'
        + pad(d.getUTCMonth()+1)+'-'
        + pad(d.getUTCDate())
  },
  
  render: function(){
    var content = this.template({list: this.list});
    this.$el.html(content);
    $('#new-task-div').html(this.$el);
    this.delegateEvents();
    
    if(this.type === "starred"){
      this.$el.find('.task-form-name').attr("placeholder",
       'Add a starred item in "Inbox"...');
      this.$el.find('#star').val(true);
      this.$el.find('.task-form-star').addClass("starred")
    } else if (this.type === "today"){
      this.$el.find('.task-form-name').attr("placeholder",
       'Add an item due today in "Inbox"...');
      var today = this.ISODateString(new Date);
      this.$el.find('input[type=date]').attr('value', today);
    }
    return this;
  },
  
  starTask: function(event){
    event.preventDefault();
    event.stopPropagation();
    var attrs = this.$el.find('.task-form').serializeJSON();
    var that = this;
    var $star = this.$el.find('#star')
    if ($star.val() == "false"){
      $star.val(true);
      $(event.target).addClass("starred");
    } else {
      $star.val(false);
      $(event.target).removeClass("starred");
    }
  },
  
  bindKeypress: function() { 
    var that = this;
    this.$el.on('keydown', '.task-form', function (e) {
      if(e.which === 13){ // enter key
        event.preventDefault();
        that.submit();
      }
    });
  },
  
  
  submit: function(){
    var that = this;
    event.preventDefault();
    var attrs = this.$el.find('.task-form').serializeJSON();
    var task = new Wunderclone.Models.Task(attrs);
    this.collection.create(attrs, {
      wait: true,
      success: function(){
        that.render();
      }
    });
  }
})