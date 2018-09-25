class Document < ApplicationRecord
    belongs_to :user, :foreign_key => "author_user_id"
    has_many :document_passages, dependent: :destroy
end
