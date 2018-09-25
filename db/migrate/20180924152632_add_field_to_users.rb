class AddFieldToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :made_by, :integer
  end
end
