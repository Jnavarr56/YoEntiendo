class DocumentPassage < ApplicationRecord
    belongs_to :document
    belongs_to :passage
end
