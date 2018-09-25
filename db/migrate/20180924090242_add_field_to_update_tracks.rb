class AddFieldToUpdateTracks < ActiveRecord::Migration[5.2]
  def change
    add_column :update_tracks, :nature, :string
  end
end
