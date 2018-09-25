class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable


  has_many :update_tracks
  has_many :passages
  has_many :document_passages, through: :passages
  has_many :annotations, through: :passages
  has_many :passage_shares
  has_many :documents
  has_many :document_passages, through: :documents
end
