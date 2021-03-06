Wunderclone.Views.ListsEditModal = Backbone.View.extend({
  template: JST['lists/edit_modal'],

  events: {
    'click .hide-modal': 'hideModal',
    'click' : 'checkHideModal',
    'click .delete-list' : 'deleteList',
    'submit #share-user-form' : 'addSharedUser',
    'submit .edit-list-form' : 'updateList',
    'click #save-list-button' : 'updateList',
    'click .remove-list-share' : 'removeSharedUser',
    'keyup #share-user-form input[type=text]': 'checkEmpty'
  },

  checkEmpty:function(event){
    if(!event.target.value){
      this.$el.find('#share-user-form').removeClass("invalid-email");
    }
  },

  hideModal: function(){
    event.preventDefault();
    event.stopPropagation();
    this.$el.find('#modal').removeClass("is-active");
  },

  checkHideModal: function(event){
    if(event.target.id == "modal"){
      event.preventDefault();
      this.$el.find('#modal').removeClass("is-active");
    }
  },

  removeSharedUser: function(event){
    event.preventDefault();
    var that = this;
    var userId = $(event.target).attr("data-id");

    var i = this.currentSharedIds.indexOf(userId);
    this.currentSharedIds.splice(i, 1);

    var attrs = this.$el.find('.edit-list-form').serializeJSON();
    attrs['list']['shared_user_ids'] = this.currentSharedIds;

    $(event.target).closest("li").remove();
    this.model.save(attrs);
  },

  addSharedUser: function(event){
    event.preventDefault();
    this.$el.find('#share-user-form').removeClass("invalid-email");

    var email = $(event.target).serializeJSON()['user_email']
    var id = Wunderclone.otherUsers[email];
    if (!id){
      this.$el.find('#share-user-form').addClass("invalid-email");
      return;
    }

    if (this.currentSharedIds.indexOf(id) == -1){
      $(event.target).find("input[type=text]").val("");
      var newUserLi = '<li>' + email + '<span class="pending-tag">Pending</span></li>';
      this.currentSharedIds.push(id);
      this.$el.find('#list-members-ul').append(newUserLi);

      var attrs = this.$el.find('.edit-list-form').serializeJSON();
      attrs['list']['shared_user_ids'] = this.currentSharedIds;
      this.model.save(attrs);
    }
  },

  initialize: function(){
  },

  render: function(){
    var content = this.template({list: this.model})
    this.$el.html(content).appendTo('#modal-container');

    return this;
  },

  updateList: function(){
    event.preventDefault();
    if (this.currentSharedIds.indexOf(Wunderclone.currentUserId) != -1){
     this.hideModal();
     return;
    }
    var that = this;
    event.preventDefault();
    var attrs = this.$el.find('.edit-list-form').serializeJSON();
    attrs['list']['shared_user_ids'] = this.currentSharedIds;

    this.model.save(attrs, {
      success: function(){
        that.hideModal();
        that.model.trigger("show");
      }
    })
  },

  edit: function(model){
    var that = this;
    this.$el.empty();
    this.model = model;
    this.render();
    this.$el.find('#modal').addClass("is-active");
    this.currentSharedIds = [];
    this.model.get("shared_users").forEach(function(user){
      that.currentSharedIds.push(user.id);
    });
    if (this.currentSharedIds.indexOf(Wunderclone.currentUserId) != -1){
      this.$el.find('.delete-list').addClass("hidden");
      this.$el.find('.edit-list-form input').attr('readonly', true);
    };
  },

  deleteList: function(event){
    event.preventDefault();
    Wunderclone.Collections.lists.remove(this.model);
    Wunderclone.Models.inbox.trigger("show");
    this.hideModal();
    this.model.destroy();
  },
})
