class CreateUpdateTracks < ActiveRecord::Migration[5.2]
  def change
    create_table :update_tracks do |t|
      t.integer :last_user_id
      t.integer :passage_id
      t.string :annotation_code

      t.timestamps
    end
  end
end
