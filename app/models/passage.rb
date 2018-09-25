class Passage < ApplicationRecord
    has_many :passage_shares, dependent: :destroy
    belongs_to :user
    has_many :update_tracks
    has_one :document_passage, dependent: :destroy
    has_many :annotations, dependent: :destroy
end
