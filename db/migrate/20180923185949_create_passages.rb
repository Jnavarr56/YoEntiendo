class CreatePassages < ActiveRecord::Migration[5.2]
  def change
    create_table :passages do |t|
      t.integer :user_id
      t.string :title
      t.string :content

      t.timestamps
    end
  end
end
