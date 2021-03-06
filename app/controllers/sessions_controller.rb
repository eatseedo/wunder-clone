class SessionsController < ApplicationController
  before_action :require_signed_out, only: [:new, :create]
  before_action :require_signed_in, only: [:destroy]
  
  def new
  end
  
  def create
    @user = User.find_by_credentials(user_params[:email], user_params[:password])
    if @user
      sign_in(@user)
      redirect_to root_url
    else
      flash.now[:errors] = ["Wrong username/password combo"]
      render :new
    end
  end
  
  def oauth
    auth = request.env["omniauth.auth"] 
    user = User.find_by(provider: auth["provider"], uid: auth["uid"]) || User.find_by(email: auth["info"]["email"]) || User.create_with_omniauth(auth)
    if user
      sign_in(user)
      redirect_to root_url
    else
      flash.now[:errors] = user.errors.full_messages
      render :new
    end
  end
  
  def destroy
    sign_out
    redirect_to landing_url
  end
  
  private
  
  def user_params
    params.require(:user).permit(:email, :name, :password)
  end
  
end
