class AddFieldsToPassages < ActiveRecord::Migration[5.2]
  def change
    add_column :passages, :made_by, :integer
    add_column :passages, :in_update, :integer
    add_column :passages, :main_content, :string
  end
end
