class AddFieldsToAnnotations < ActiveRecord::Migration[5.2]
  def change
    add_column :annotations, :element, :string
    add_column :annotations, :made_by, :integer
    add_column :annotations, :in_update, :integer
    add_column :annotations, :main_content, :string
  end
end
