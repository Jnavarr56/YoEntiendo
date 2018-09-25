class AddColumnsToPassageShares < ActiveRecord::Migration[5.2]
  def change
    add_column :passage_shares, :opened, :boolean
    add_column :passage_shares, :opened_at, :datetime
  end
end
