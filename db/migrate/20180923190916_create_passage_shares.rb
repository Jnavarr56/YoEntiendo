class CreatePassageShares < ActiveRecord::Migration[5.2]
  def change
    create_table :passage_shares do |t|
      t.integer :author_user_id
      t.integer :recieving_user_id
      t.integer :passage_id
      t.boolean :edit_privilege

      t.timestamps
    end
  end
end
