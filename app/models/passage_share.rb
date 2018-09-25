class PassageShare < ApplicationRecord
    belongs_to :passage
    belongs_to :user, :foreign_key => "recieving_user_id"
    belongs_to :user, :foreign_key => "author_user_id"
end
