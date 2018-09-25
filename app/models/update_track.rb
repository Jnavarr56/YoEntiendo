class UpdateTrack < ApplicationRecord
    belongs_to :passage
    belongs_to :user, :foreign_key => "last_user_id"
end
