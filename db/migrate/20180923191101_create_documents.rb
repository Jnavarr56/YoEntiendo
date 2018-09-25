class CreateDocuments < ActiveRecord::Migration[5.2]
  def change
    create_table :documents do |t|
      t.string :title
      t.integer :author_user_id

      t.timestamps
    end
  end
end
