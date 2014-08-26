class User < ActiveRecord::Base
  validates :name, :email, presence: true
  validates :password, length: {minimum: 6, allow_nil: true}
  
  before_validation :ensure_session_token
  
  attr_reader :password
  
  has_many(
  :owned_lists,
  dependent: :destroy,
  class_name: "List",
  foreign_key: :owner_id,
  primary_key: :id
  )
  
  has_many(
  :list_shares,
  class_name: "ListShare",
  foreign_key: :user_id,
  primary_key: :id
  )
  
  has_many(
  :shared_lists,
  through: :list_shares,
  source: :list
  )
  
  def self.find_by_credentials(email, password)
    user = User.find_by(email: email)
    if user.is_password?(password)
      return user
    end
  end
  
  def self.generate_session_token
    SecureRandom::urlsafe_base64
  end
  
  def is_password?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end
  
  def password=(password)
    self.password_digest = BCrypt::Password.create(password)
  end
  
  def ensure_session_token
    if !self.session_token
      self.session_token = User.generate_session_token
    end
  end
  
  def reset_session_token!
    self.session_token = User.generate_session_token
    self.save!
  end
end
