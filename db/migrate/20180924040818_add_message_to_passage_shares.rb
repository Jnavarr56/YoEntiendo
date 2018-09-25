class AddMessageToPassageShares < ActiveRecord::Migration[5.2]
  def change
    add_column :passage_shares, :message, :string
  end
end
