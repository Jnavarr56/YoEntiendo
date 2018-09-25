class AddColumnToUpdateTracks < ActiveRecord::Migration[5.2]
  def change
    add_column :update_tracks, :main_content, :string
  end
end
